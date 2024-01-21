import type { Bookmark } from "~/types";

export async function fetchBookmarks(collectionId: string) {
  let url = "http://localhost:8000/api/bookmarks";
  let params = new URLSearchParams();

  params.append("collectionId", collectionId);

  const response = await fetch(`${url}?${params.toString()}`);

  if (!response.ok) throw new Error("Could'nt load bookmarks");

  const data = await response.json();

  return data.bookmarks;
}

export async function searchBookmarks(
  searchQuery: string,
  collectionId?: string
) {
  let url = "http://localhost:8000/api/bookmarks/search";
  let params = new URLSearchParams();

  params.append("searchQuery", searchQuery);

  if (collectionId) params.append("collectionId", collectionId);

  const response = await fetch(`${url}?${params.toString()}`);

  if (!response.ok) throw new Error("Could'nt search all bookmarks");

  const data = await response.json();

  return data.bookmarks as Bookmark[];
}

export function insertBookmarks(
  bookmarkInfo: Pick<Bookmark, "link" | "context" | "collectionId">
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
