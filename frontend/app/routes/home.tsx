import { useEffect, useRef, useState } from "react";
import { json, redirect } from "@remix-run/node";
import { PlusIcon, SearchIcon, BadgeXIcon } from "lucide-react";
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
import { BookmarkCard } from "~/components/organisms/bookmark-card";
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

  const clearInput = () => {
    if (searchParams) return navigate("/");

    setSearch("");
  };

  return (
    <>
      <Form>
        <div className="flex items-end p-10 pb-0 gap-6">
          <Input
            ref={searchRef}
            name="search"
            id="search"
            placeholder="enter search query"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <fieldset className="flex gap-6" disabled={!search}>
            <Button type="submit">
              <SearchIcon className="mr-2 h-4 w-4" /> Search
            </Button>
            <Button variant="secondary" type="button" onClick={clearInput}>
              <BadgeXIcon className="mr-2 h-4 w-4" /> Clear
            </Button>
          </fieldset>
        </div>
      </Form>

      <div className="px-10 py-10 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-10 align-stretch">
        {bookmarkData.map((bookmark) => (
          <Form method="POST" key={bookmark._id}>
            <input type="hidden" name="bookmarkId" value={bookmark._id} />
            <BookmarkCard bookmark={bookmark} />
          </Form>
        ))}
      </div>

      <Button
        onClick={() => navigate("new")}
        size="icon"
        className="rounded-full h-14 w-14 fixed right-4 bottom-4"
      >
        <PlusIcon className="h-8 w-8" />
      </Button>

      <Outlet />
    </>
  );
}
