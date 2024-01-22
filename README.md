# Bookmarks App

Manage bookmarks easily, search with Natural Language, save articles, resources, and websites. Explore app details and technology.

[Video Demo of the application](https://pub-2e209747425f40cdacae2d98eae729f3.r2.dev/Bookmarks%20AI.webm)

## Project Overview

1.  **Backend:** Manages data and requests using Express.js (written in TypeScript).
2.  **Frontend:** Interactive user interface built with Remix.js it has search and infinite scrolling for great user experience (written in TypeScript).
3.  **Serverless:** Uses AWS SAM as IaC for easy deployments to AWS(written in TypeScript).
4.  **Database:** MongoDB Atlas a cloud-based NoSQL database service for storing bookmark links and related information.

## App Workflow

- Users create a bookmark link and provide additional context about it through the frontend interface.They can also create collections and organize their bookmarks within these collections.
- The backend stores the bookmark link and context in MongoDB Atlas,
- MongoDB Atlas triggers an event on EventBridge, a serverless event bus service provided by AWS, upon the addition of a new bookmark.
- A Lambda function is triggered by the EventBridge event.
- The Lambda function retrieves the link and scrapes information from the webpage using `cheerio`.
- After retrieving the content, the app uses `Open AI` to create a summary and generate 5 tags. It also creates an `embedding` for the summary, which is used later for vector search. The app then adds the summary to the summary field, tags to the tags field, embedding to the embedding field and updates the document in MongoDB Atlas.
- The server-side code utilizes a change stream to detect updates in the MongoDB Atlas database.
- Server-Sent Events (SSE) are used to push the updated bookmark document to the frontend in real-time.
- Users can search bookmarks using natural language thanks to MongoDB's vector search feature.

## Getting Started

To run the Bookmarks App locally, follow these steps:

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/yaldram/bookmarks-app.git
   ```

2. **Start the Frontend and Backend Servers:**

   ```bash
   cd frontend
   npm run dev
   ```

   ```bash
   cd backend
   npm run dev
   ```

3. **Create and Configure the `.env` File:**

   Create a `.env` file in the root directory of the `backend` folder and copy over the variables from `.env.sample`

The app will be accessible at `http://localhost:3000`.

### Serverless

- To deploy the lambda function `cd serverless/summarize` and run `npm install`
- Then `cd ..` run `sam build`
- To deploy the stack use `sam deploy --guided`

### Resources Created:

- **Lambda Function (SummarizeFunction):**
  A serverless function hosted on AWS Lambda. Responsible for summarizing content.

- **Event Rule (EventRule):**
  A rule in AWS Events that triggers when new records are inserted into MongoDB. This rule then activates the 'summarizer' AWS Lambda function.

- **Lambda Function Permission (PermissionForEventsToInvokeLambda):**
  Provides permission for the Event Rule to invoke the Lambda function. Specifies necessary actions and permissions for event-driven execution.

## Configuration Tips

### Creating a Search Index in MongoDB Atlas

- To gain a deeper understanding of indexing vector embeddings for effective vector search, please refer to the comprehensive documentation on [How to Index Vector Embeddings for Vector Search](https://www.mongodb.com/docs/atlas/atlas-vector-search/vector-search-overview/).

- In your query pipeline, make use of the powerful `$vectorSearch` stage. This stage plays a crucial role in facilitating efficient vector searches.

- For more precise filtering, integrate the `$filter` pipeline stage. This allows you to filter bookmarks based on their `collectionIds`.

Here's the vector search index created in MongoDB Atlas, used in the application -

```ts
{
  "fields": [
    {
      "numDimensions": 1536,
      // the name of embedding field
      "path": "embedding",
      "similarity": "cosine",
      "type": "vector"
    },
    {
      "path": "collectionId",
      "type": "filter"
    }
  ]
}
```

## Real-Time Updates with MongoDB Realm

The application has been updated to utilize MongoDB Realm for real-time updates instead of Server-Sent Events (SSE) used previously.

### Key Improvements

1. **Real-Time Updates:** Replaced SSE with MongoDB Realm for seamless real-time data synchronization.
2. **Reduced Server Load:** By leveraging Realm, the Node server no longer handles change streams or SSE events, focusing solely on API delivery.
3. **Efficient Client Management:** MongoDB Realm handles client connections and management, reducing server-side compute.

### Implementation Guide

To implement these changes:

1. **Create MongoDB Realm App:** Follow [this tutorial](https://www.mongodb.com/developer/products/mongodb/real-time-data-javascript/) to set up an app service in MongoDB Atlas for real-time data updates.

### Environment Variables in Lambda Function

After deploying the application, navigate to the AWS Lambda Management Console. Locate the deployed Lambda function. Inside the function configuration, add the following environment variables:

- **MONGO_URI**: MongoDB Atlas cluster URL for storing extracted data.
- **OPENAI_API_KEY**: OpenAI API key for accessing the OpenAI API.

## Contribution Guidelines

We welcome contributions from the community! If you'd like to contribute to the Bookmarks App project, please follow these guidelines:

- Fork the repository and create a new branch for your feature or bug fix.
- Make your changes and submit a pull request.
- Provide a clear and detailed description of your changes in the pull request.
