import type { Bookmark } from "~/types";

export function fetchBookmarks(
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

  return fetch(`${url}?${params.toString()}`);
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
