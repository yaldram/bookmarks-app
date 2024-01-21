import { Request, Response } from 'express';
import { ObjectId } from "mongodb"

import { bookmarkCollection } from '../../utils/dbClient';
import { bookmarksVectorSearch } from './bookmarks.services';

class BookmarksController {
  async getAllBookmarks(req: Request, res: Response) {
    const { collectionId } = req.query;
    
    const bookmarks = await bookmarkCollection
    .find(
      { collectionId }, 
      { projection: { embedding: 0 } }
    )
    .sort({ _id: -1 })
    .toArray();

    return res.status(200).json({
      status: true,
      statusCode: 200,
      bookmarks
    });
  }

  async searchBookmarks(req: Request, res: Response) {
    const { searchQuery, collectionId } = req.query;
    
    const data = await bookmarksVectorSearch(searchQuery as string, collectionId as string)
    const bookmarks = await data.toArray()

    return res.status(200).json({
      status: true,
      statusCode: 200,
      bookmarks
    });
  }


  async insertBookmark(req: Request, res: Response) {
    const link = req.body.link;
    const context = req.body.context;
    const collectionId = req.body.collectionId

    const bookmark = await bookmarkCollection.insertOne({ link, context, collectionId });

    return res.status(201).json({
      status: true,
      statusCode: 201,
      bookmark: {
        _id: bookmark.insertedId.toString(),
        link,
        context,
        collectionId
      }
    })
  }

  async deleteBookmark(req: Request, res: Response) {
    const bookmarkId = new ObjectId(req.params.bookmarkId as string);
    
    const { deletedCount } = await bookmarkCollection.deleteOne({ _id: bookmarkId })
    
    if (deletedCount === 0) {
      return res.status(404).json({
        status: false,
        statusCode: 404,
        message: "Bookmark not found for the provided id"
      })
    }

    return res.status(200).json({
      status: true,
      statusCode: 200
    })
  }

  
}

export const bookmarksController = new BookmarksController();
