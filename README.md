# Bookmarks App

Easily manage bookmarks, search with Natural Language, and organize collections. 

[![Demo Video](https://img.shields.io/badge/Video%20Demo-Click%20Here-blue)](https://www.youtube.com/watch?v=kGNfn6eeOaI)

## Workflow

![Workflow Diagram](https://pub-2e209747425f40cdacae2d98eae729f3.r2.dev/bookmarks.png)

1. Users save bookmarks and organize them into collections.
2. MongoDB Atlas triggers an EventBridge event on new bookmarks.
3. A Lambda function retrieves the link and scrapes information from the webpage using `cheerio`.
4. Lambda function uses `Open AI` to create a summary and generate 5 tags. It also creates an `embedding` for the summary, which is used later for vector search.
5. Real-time updates to the frontend via MongoDB Realm.
6. Users can search bookmarks using natural language thanks to MongoDB's vector search feature.


## Project Overview

1.  **Backend:** Manages data and requests using Express.js (written in TypeScript).
2.  **Frontend:** Interactive user interface built with Remix.js it has search and infinite scrolling for great user experience (written in TypeScript).
3.  **Serverless:** Uses AWS SAM as IaC for easy deployments to AWS (written in TypeScript).
4.  **Database:** MongoDB Atlas a cloud-based NoSQL database service for storing bookmark links and related information.


## Getting Started

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/yaldram/bookmarks-app.git
   ```
2. **Run the Frontend & Backend:**
   ```bash
   cd frontend && npm run dev
   ```
   ```bash
   cd backend && npm run dev
   ```
3. **Configure Environment Variables:**
   Copy `.env.sample` to `.env` in `backend` and set required values.

### Serverless

- To deploy the lambda function `cd serverless/summarize` and run `npm install`
- Then `cd ..` run `sam build`
- To deploy the stack use `sam deploy --guided`

## Resources Created:

- **SummarizeFunction:** AWS Lambda function that summarizes content.
- **EventRule:** Triggers the Lambda function when new records are inserted into MongoDB.
- **PermissionForEventsToInvokeLambda:** Grants Event Rule permission to invoke the Lambda function.

## Configuration Tips

### Creating a Search Index in MongoDB Atlas

To gain a deeper understanding of indexing vector embeddings for effective vector search, please refer to the comprehensive documentation on [How to Index Vector Embeddings for Vector Search](https://www.mongodb.com/docs/atlas/atlas-vector-search/vector-search-overview/).

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

### Real-Time Updates with MongoDB Realm

The application has been updated to utilize MongoDB Realm for real-time updates instead of Server-Sent Events (SSE) used previously. Follow [this guide](https://www.mongodb.com/developer/products/mongodb/real-time-data-javascript/) to set up an app service in MongoDB Atlas for real-time data updates.

## Environment Variables in Lambda Function

After deploying the application, navigate to the AWS Lambda Management Console. Locate the deployed Lambda function. Inside the function configuration, add the following environment variables:

- **MONGO_URI**: MongoDB Atlas cluster URL.
- **OPENAI_API_KEY**: OpenAI API key.

## Contribution Guidelines

We welcome contributions! Fork the repo, create a new branch, and submit a pull request.
