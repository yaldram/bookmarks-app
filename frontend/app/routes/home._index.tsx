import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import type { LoaderFunctionArgs } from "@remix-run/node";

import { SearchInput } from "~/components/templates/search-input";
import { BookmarksGrid } from "~/components/templates/bookmarks-grid";
import { searchBookmarks } from "~/api/bookmarks";
import type { Bookmark } from "~/types";

export async function loader({ request }: LoaderFunctionArgs) {
  const searchQuery = new URL(request.url).searchParams.get("search");

  if (searchQuery) {
    const bookmarks = await searchBookmarks(searchQuery);

    return json(bookmarks);
  }

  return [];
}

export default function HomeIndexPage() {
  const bookmarks = useLoaderData() as Bookmark[];

  return (
    <>
      <SearchInput placeholder="Search all bookmarks using natural language" />

      <BookmarksGrid bookmarks={bookmarks} />
    </>
  );
}
