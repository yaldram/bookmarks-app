import { useEffect, useState } from "react";
import { json, redirect } from "@remix-run/node";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";

import { BookmarksGrid } from "~/components/templates/bookmarks-grid";
import { SearchInput } from "~/components/templates/search-input";
import type { Bookmark } from "~/types";
import { bookmarksChanges } from "~/utils/realm";
import {
  deleteBookmark,
  fetchBookmarks,
  searchBookmarks,
} from "~/api/bookmarks";
import { AddFab } from "~/components/templates/add-fab";

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

  useEffect(() => {
    // sets the bookmark state after a mutation
    setBookmarkData(bookmarks);
  }, [bookmarks]);

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
      <SearchInput />

      <BookmarksGrid bookmarks={bookmarkData} />

      <AddFab to="new" />

      <Outlet />
    </>
  );
}
