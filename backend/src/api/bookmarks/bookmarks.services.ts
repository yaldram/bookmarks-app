import { bookmarkCollection } from "@utils/dbClient";
import { generateEmbeddings } from "@utils/openai";

export async function searchVector(searchQuery: string) {
  const embeddings = await generateEmbeddings(searchQuery);

  const pipeline = [
    {
      $vectorSearch: {
        queryVector: embeddings,
        path: "embedding", // filed name of the embedding in the colleciton
        numCandidates: 10, // match with 10 documents
        limit: 4, // return only top 4 results
        index: "bookmarks-search" // name of our index
      }
    },
    {
      $project: {
        embedding: 0, // return all fields, except embedding
      }
    }
  ];

  return bookmarkCollection.aggregate(pipeline);
}