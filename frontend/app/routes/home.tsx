import * as Realm from "realm-web";
import { useEffect, useRef, useState } from "react";
import { json, redirect } from "@remix-run/node";
import { z } from "zod";
import { parse } from "@conform-to/zod";
import { conform, useForm } from "@conform-to/react";
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import {
  useLoaderData,
  Form,
  useFetcher,
  useNavigate,
  useSearchParams,
  Outlet,
} from "@remix-run/react";

import { Button } from "~/components/atoms/button";
import { BookmarkCard } from "~/components/organisms/BookmarkCard";
import { Input } from "~/components/atoms/input";
import { deleteBookmark, fetchBookmarks } from "~/api/bookmarks";
import type { Bookmark } from "~/types";

const realmApp = new Realm.App({ id: "bookmarks-app-wjney" });

const searchBookmarkSchema = z.object({
  search: z.string({ required_error: "search cannot be empty" }),
});

export const meta: MetaFunction = () => {
  return [
    { title: "Bookmarks AI" },
    { name: "description", content: "Welcome to Bookmarks App!" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const lastId = new URL(request.url).searchParams.get("lastId");
  const search = new URL(request.url).searchParams.get("search");

  const response = await fetchBookmarks(search, lastId);

  if (!response.ok) throw new Error("Could'nt load bookmarks");

  const data = await response.json();

  return json(data.bookmarks);
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  // handle deleting bookmarks
  const bookmarkId = await formData.get("bookmarkId")?.toString();

  if (request.method === "DELETE" && bookmarkId) {
    await deleteBookmark(bookmarkId);
  }

  return redirect("/");
}

export default function Index() {
  const bookmarks = useLoaderData<Bookmark[]>();
  const infinteScrollFetcher = useFetcher();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const observerRef = useRef(null);
  const searchFormRef = useRef<HTMLFormElement>(null);

  const [searchBookmarkForm, { search }] = useForm({
    id: "search",
    ref: searchFormRef,
    defaultValue: {
      search: params.has("search") ? params.get("search") : "",
    },
    onValidate({ formData }) {
      return parse(formData, { schema: searchBookmarkSchema });
    },
  });

  const [bookmarkData, setBookmarkData] = useState<Bookmark[]>(bookmarks || []);
  const [shouldFetch, setShouldFetch] = useState(true);

  useEffect(() => {
    setBookmarkData(bookmarks);
    // reset the status to true, whenever the loader runs
    setShouldFetch(true);
  }, [bookmarks]);

  useEffect(() => {
    if (!params.has("search")) {
      searchFormRef.current?.reset();
    }
  }, [params]);

  useEffect(() => {
    (async function () {
      // authenticate using anonymous user
      realmApp.logIn(Realm.Credentials.anonymous());

      if (realmApp.currentUser) {
        const mongodb = realmApp.currentUser.mongoClient("mongodb-atlas");
        const bookmarksCollection = mongodb
          .db("bookmarks")
          .collection("bookmarks");

        const changeStream = bookmarksCollection.watch({
          filter: {
            operationType: "update",
            "updateDescription.updatedFields.summary": { $exists: true },
          },
        });

        for await (const change of changeStream) {
          // @ts-ignore: we are only watching for updates
          const updatedBookmark = change.fullDocument as Bookmark;

          // @ts-ignore: we also get the embedding field
          delete updatedBookmark["embedding"];

          setBookmarkData((bookmarks) =>
            bookmarks.map((bookmark) =>
              bookmark._id === updatedBookmark._id.toString()
                ? { ...bookmark, ...updatedBookmark }
                : bookmark
            )
          );
        }
      }
    })();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];

      // @ts-ignore: search is available on the searchFormRef
      const searchValue = searchFormRef.current?.elements?.search.value;

      if (!shouldFetch || searchValue) return;

      if (entry.isIntersecting && infinteScrollFetcher.state !== "loading") {
        infinteScrollFetcher.load(
          `/?index&lastId=${bookmarkData[bookmarkData.length - 1]._id}`
        );
      }
    });

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [observerRef, shouldFetch, infinteScrollFetcher, bookmarkData]);

  useEffect(() => {
    if (!infinteScrollFetcher.data) return;

    const fetcherData = infinteScrollFetcher.data as Bookmark[];

    if (fetcherData.length === 0) {
      setShouldFetch(false);
      return;
    }

    if (fetcherData.length > 0) {
      setBookmarkData((prevData) => [...prevData, ...fetcherData]);
    }
  }, [infinteScrollFetcher.data]);

  return (
    <>
      <Form {...searchBookmarkForm.props}>
        <div className="flex flex-col p-10 gap-6">
          <Input
            {...conform.input(search, {
              type: "text",
              ariaAttributes: true,
            })}
            label="Search"
            placeholder="enter search query"
            error={search.error}
          />
          <Button type="submit">Search</Button>
          <Button type="button" onClick={() => navigate("/")}>
            Clear
          </Button>
        </div>
      </Form>

      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 align-stretch">
        {bookmarkData.map((bookmark) => (
          <div key={bookmark._id} className="col-span-1">
            <Form method="DELETE" className="h-full">
              <input type="hidden" name="bookmarkId" value={bookmark._id} />
              <BookmarkCard bookmark={bookmark} />
            </Form>
          </div>
        ))}
      </div>
      {/* Intersection Observer target */}
      {bookmarkData.length > 4 && (
        <div ref={observerRef} style={{ height: "1px" }} />
      )}
      <Button
        onClick={() => navigate("new")}
        className="fixed right-4 bottom-4 p-6 w-16 h-16 text-2xl rounded-full shadow-lg"
      >
        +
      </Button>

      <Outlet />
    </>
  );
}
