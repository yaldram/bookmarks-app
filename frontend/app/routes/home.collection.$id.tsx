import { useEffect, useRef, useState } from "react";
import { PlusIcon, SearchIcon, BadgeXIcon } from "lucide-react";
import { json, redirect } from "@remix-run/node";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import {
  Form,
  Outlet,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from "@remix-run/react";

import { BookmarkCard } from "~/components/organisms/bookmark-card";
import { Input } from "~/components/atoms/input";
import { Button } from "~/components/atoms/button";
import type { Bookmark } from "~/types";
import { bookmarksChanges } from "~/utils/realm";
import { ScrollArea } from "~/components/molecules/scroll-area";
import {
  deleteBookmark,
  fetchBookmarks,
  searchBookmarks,
} from "~/api/bookmarks";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const collectionId = params.id as string;
  const bookmarks = await fetchBookmarks(collectionId);

  const searchQuery = new URL(request.url).searchParams.get("search");

  if (searchQuery) {
    const searchedBookmarks = await searchBookmarks(searchQuery, collectionId);

    return json(searchedBookmarks);
  }

  return json(bookmarks);
}

export async function action({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData();
  const bookmarkId = formData.get("bookmarkId")?.toString();

  if (bookmarkId) await deleteBookmark(bookmarkId);

  const collectionId = params.id as string;

  return redirect(`/home/collection/${collectionId}`);
}

export default function HomeIndexPage() {
  const bookmarks = useLoaderData<Bookmark[]>();
  const [bookmarkData, setBookmarkData] = useState<Bookmark[]>(bookmarks || []);

  const [params] = useSearchParams();
  const searchParams = params.get("search") || "";
  const [search, setSearch] = useState(searchParams);
  const searchRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();

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
    if (searchParams) return navigate(".");

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
            placeholder="Search this collection using natural language."
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

      <ScrollArea style={{ height: "90%" }} className="px-10 pt-8">
        <div className="pb-8 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-10 align-stretch">
          {bookmarkData.map((bookmark) => (
            <Form method="POST" key={bookmark._id}>
              <input type="hidden" name="bookmarkId" value={bookmark._id} />
              <BookmarkCard bookmark={bookmark} />
            </Form>
          ))}
        </div>
      </ScrollArea>

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
