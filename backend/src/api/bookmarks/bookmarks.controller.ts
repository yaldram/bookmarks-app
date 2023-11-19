import { Request, Response } from 'express';
import { ObjectId } from "mongodb"

import { bookmarkCollection } from '../../utils/dbClient';
import { searchVector } from './bookmarks.services';

class BookmarksController {
  async getAllBookmarks(req: Request, res: Response) {
    const { lastId, searchQuery } = req.query;
    const query = lastId ? { _id: { $lt: new ObjectId(lastId as string) } } : {};

    if (searchQuery) {
      const results = await searchVector(searchQuery as string);
      const bookmarks = await results.toArray();
     
      return res.status(200).json({
        status: true,
        statusCode: 200,
        bookmarks
      });
    }
    
    const bookmarks = await bookmarkCollection.find(query,
      { projection: { embedding: 0 } })
      .sort({ _id: -1 })
      .limit(5).toArray();

    return res.status(200).json({
      status: true,
      statusCode: 200,
      bookmarks
    });
  }

  async insertBookmark(req: Request, res: Response) {
    const link = req.body.link;
    const context = req.body.context;

    const bookmark = await bookmarkCollection.insertOne({ link, context });

    return res.status(201).json({
      status: true,
      statusCode: 201,
      bookmark: {
        _id: bookmark.insertedId.toString(),
        link,
        context
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
