import { Request, Response } from 'express';

import { collectionsCollection } from '../../utils/dbClient';

class CollectionsController {
  async getAllCollections(req: Request, res: Response) {
    const collections = await collectionsCollection.find({})
      .sort({ _id: -1 })
     .toArray();

    return res.status(200).json({
      status: true,
      statusCode: 200,
      collections
    });
  }

  async insertCollection(req: Request, res: Response) {
    const name = req.body.name;
    const description = req.body.description;

    const collection = await collectionsCollection.insertOne({ name, description });

    return res.status(201).json({
      status: true,
      statusCode: 201,
      collection: {
        _id: collection.insertedId.toString(),
       name,
       description
      }
    })
  }
}

export const collectionsController = new CollectionsController();
