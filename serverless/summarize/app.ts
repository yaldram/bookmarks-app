import { ObjectId } from 'mongodb';
import { Context, Callback } from 'aws-lambda';

import { bookmarksCollection, connectToDb } from './utils/dbClient';
import { fetchContent } from './utils/cheerio';
import { generateEmbeddings, generateSummary } from './utils/openai';

export const lambdaHandler = async (event: any, context: Context, callback: Callback) => {
    console.log('LogScheduledEvent');
    await connectToDb();

    const mongoRecord = event.detail.fullDocument;
    const bookmarkId = mongoRecord?._id;
    const bookmarkLink = mongoRecord?.link;
    const bookmarkContext = mongoRecord?.context;

    console.log('Received event:', JSON.stringify(mongoRecord, null, 2));

    const webpageContent = await fetchContent(bookmarkLink);

    if (!webpageContent) {
        await bookmarksCollection.findOneAndUpdate(
            { _id: new ObjectId(bookmarkId) },
            { $set: { link: bookmarkLink, summary: null, tags: null, embedding: null, context: bookmarkContext } },
        );
        console.log('Pagecontent not found for the link.');
        return;
    }

    const summaryResponse = await generateSummary(bookmarkContext, webpageContent);

    if (!summaryResponse) {
        await bookmarksCollection.findOneAndUpdate(
            { _id: new ObjectId(bookmarkId) },
            { $set: { link: bookmarkLink, summary: null, tags: null, embedding: null, context: bookmarkContext } },
        );
        callback(new Error('Unable to generate a summary.'));
        return;
    }

    // Parse the OpenAI response
    const summaryData = JSON.parse(summaryResponse);

    // convert the summary into embeddings
    const summaryEmbedding = await generateEmbeddings(summaryData.summary);

    // update the mongo document
    await bookmarksCollection.findOneAndUpdate(
        { _id: new ObjectId(bookmarkId) },
        {
            $set: {
                link: bookmarkLink,
                summary: summaryData.summary,
                tags: summaryData.tags,
                embedding: summaryEmbedding,
                context: bookmarkContext,
            },
        },
    );

    callback(null, 'Finished generating summary and uploading data.');
};
