import { asyncHandler } from "@middlewares/asyncHandler";
import { BaseRouter } from "@utils/BaseRouter";
import { collectionsController } from "./collections.controller";

class CollectionsRouter extends BaseRouter {
  constructor() {
    super();
  }

  addRoutes(): void {
    this.router.get('/', asyncHandler(collectionsController.getAllCollections));
    this.router.post('/', asyncHandler(collectionsController.insertCollection));
  }

  returnApiEndpointRouter() {
    this.addRoutes();
    return this.router;
  }
}

export const collectionsRouter = new CollectionsRouter().returnApiEndpointRouter();
