import { MongoClient, ServerApiVersion } from 'mongodb';

const DB_NAME = 'bookmarks';
const BOOKMARKS_COLLECTION = 'bookmarks';

const mongoClient = new MongoClient(process.env.MONGO_URI as string, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: false,
        deprecationErrors: true,
    },
});

export async function connectToDb() {
    try {
        await mongoClient.connect();
        await mongoClient.db(DB_NAME).command({ ping: 1 });
        console.log('Pinged your deployment. You successfully connected to MongoDB!');
    } catch (error) {
        console.log('Error connecting toe MongoDB', error);
    }
}

export const bookmarksCollection = mongoClient.db(DB_NAME).collection(BOOKMARKS_COLLECTION);
