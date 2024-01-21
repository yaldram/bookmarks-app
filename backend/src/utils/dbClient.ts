import { MongoClient, ServerApiVersion } from 'mongodb';

export const DB_NAME = "bookmarks";
export const COLLECTION_BOOKMARKS = "bookmarks";
export const COLLECTION_COLLECTIONS = "collections"

if (!process.env.MONGO_URI) {
  throw new Error('Please add Mongo URI to your environment')
}

export const mongoClient = new MongoClient(process.env.MONGO_URI as string, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: false,
    deprecationErrors: true,
  }
});

export const bookmarkCollection = mongoClient.db(DB_NAME).collection(COLLECTION_BOOKMARKS);

export const collectionsCollection = mongoClient.db(DB_NAME).collection(COLLECTION_COLLECTIONS);

const pipeline = [
  {
    $match: {
      operationType: 'update'
    }
  }
];

const options = { fullDocument: 'updateLookup' };

export const bookmarkCollectionChangeStream = bookmarkCollection.watch(pipeline, options)
