import { bookmarkCollection } from "@utils/dbClient";
import { generateEmbeddings } from "@utils/openai";

export async function bookmarksVectorSearch(searchQuery: string, collectionId?: string) {
  const embeddings = await generateEmbeddings(searchQuery);

  const pipeline = [
    {
    $vectorSearch: {
      queryVector: embeddings,
      path: "embedding",
      numCandidates: 10,
      ...(collectionId && {
        filter: {
          collectionId
        }
      }),
      limit: 6,
      index: "bookmarks-search"
    }
  },
  {
    $project: { embedding: 0 }
  }];

  return bookmarkCollection.aggregate(pipeline);
}
