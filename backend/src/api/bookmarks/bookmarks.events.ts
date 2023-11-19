import { Request, Response } from 'express';

import { bookmarkCollectionChangeStream } from '../../utils/dbClient';

class BookmarksEvent {
  async updateSummaryEvent(req: Request, res: Response) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    bookmarkCollectionChangeStream.on('change', (change) => {
      console.log("Change Stream triggered", change);
      if (change.operationType === 'update' && change?.updateDescription?.updatedFields?.summary) {
          const updatedDocument = {
            summary: change.updateDescription.updatedFields.summary,
            tags: change.updateDescription.updatedFields.tags,
            _id: change.documentKey._id.toString(),
          }
          
          return res.write(`data: ${JSON.stringify(updatedDocument)}\n\n`);
        }
    });
   }
}

export const bookmarksEvent = new BookmarksEvent();
