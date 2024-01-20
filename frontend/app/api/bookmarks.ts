import type { Bookmark } from "~/types";
import { RECORDS_LIMIT } from "~/utils/constant";

export async function fetchBookmarks(
  searchQuery: string | null,
  lastId: string | null
) {
  let url = "http://localhost:8000/api/bookmarks";
  let params = new URLSearchParams();

  if (searchQuery) {
    params.append("searchQuery", searchQuery);
  }

  if (lastId) {
    params.append("lastId", lastId);
  }

  params.append("limit", RECORDS_LIMIT.toString());

  const response = await fetch(`${url}?${params.toString()}`);

  if (!response.ok) throw new Error("Could'nt load bookmarks");

  const data = await response.json();

  return data.bookmarks;
}

export function insertBookmarks(
  bookmarkInfo: Pick<Bookmark, "link" | "context">
) {
  return fetch("http://localhost:8000/api/bookmarks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bookmarkInfo),
  });
}

export function deleteBookmark(bookmarkId: string) {
  return fetch(`http://localhost:8000/api/bookmarks/${bookmarkId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
}
