import { useEffect, useRef, useState } from "react";
import { json, redirect } from "@remix-run/node";
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import {
  useLoaderData,
  Form,
  useNavigate,
  useSearchParams,
  Outlet,
} from "@remix-run/react";

import { Button } from "~/components/atoms/button";
import { BookmarkCard } from "~/components/organisms/BookmarkCard";
import { Input } from "~/components/atoms/input";
import { deleteBookmark, fetchBookmarks } from "~/api/bookmarks";
import type { Bookmark } from "~/types";
import { bookmarksChanges } from "~/utils/realm";

export const meta: MetaFunction = () => {
  return [
    { title: "Bookmarks AI" },
    { name: "description", content: "Welcome to Bookmarks App!" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const lastId = new URL(request.url).searchParams.get("lastId");
  const search = new URL(request.url).searchParams.get("search");

  const bookmarks = await fetchBookmarks(search, lastId);

  return json(bookmarks);
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  // handle deleting bookmarks
  const bookmarkId = formData.get("bookmarkId")?.toString();

  if (bookmarkId) await deleteBookmark(bookmarkId);

  return redirect("/home");
}

export default function Index() {
  const bookmarks = useLoaderData<Bookmark[]>();
  const navigate = useNavigate();

  const [params] = useSearchParams();
  const searchParams = params.get("search") || "";
  const [search, setSearch] = useState(searchParams);
  const searchRef = useRef<HTMLInputElement>(null);

  const [bookmarkData, setBookmarkData] = useState<Bookmark[]>(bookmarks || []);

  useEffect(() => {
    // sets the bookmark state after a mutation
    setBookmarkData(bookmarks);
  }, [bookmarks]);

  useEffect(() => {
    // reset the search params on clear
    setSearch(searchParams);
  }, [searchParams]);

  useEffect(() => {
    (async function () {
      await bookmarksChanges<Bookmark>((updatedBookmark) => {
        //@ts-ignore: we also get the embedding field
        delete updatedBookmark["embedding"];

        setBookmarkData((bookmarks) =>
          bookmarks.map((bookmark) =>
            bookmark._id === updatedBookmark._id.toString()
              ? { ...bookmark, ...updatedBookmark }
              : bookmark
          )
        );
      });
    })();
  }, []);

  return (
    <>
      <Form>
        <div className="flex p-10 gap-6">
          <Input
            ref={searchRef}
            name="search"
            placeholder="enter search query"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <fieldset className="flex gap-6" disabled={!search}>
            <Button type="submit">Search</Button>
            <Button type="button" onClick={() => navigate("/")}>
              Clear
            </Button>
          </fieldset>
        </div>
      </Form>

      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 align-stretch">
        {bookmarkData.map((bookmark) => (
          <div key={bookmark._id} className="col-span-1">
            <Form method="POST" className="h-full">
              <input type="hidden" name="bookmarkId" value={bookmark._id} />
              <BookmarkCard bookmark={bookmark} />
            </Form>
          </div>
        ))}
      </div>

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
