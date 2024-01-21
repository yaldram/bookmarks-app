import type { Collection } from "~/types";

export async function fetchCollections() {
  const response = await fetch("http://localhost:8000/api/collections");

  if (!response.ok) throw new Error("Could'nt load collections");

  const data = await response.json();

  return data.collections as Collection[];
}

export async function insertCollections(
  collectionInfo: Omit<Collection, "_id">
) {
  const response = await fetch("http://localhost:8000/api/collections", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(collectionInfo),
  });

  if (!response.ok) throw new Error("Could'nt insert collection");

  const data = await response.json();

  return data.collection as Collection;
}
