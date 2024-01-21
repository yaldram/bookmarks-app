import { asyncHandler } from "@middlewares/asyncHandler";
import { BaseRouter } from "@utils/BaseRouter";
import { bookmarksController } from "./bookmarks.controller";

class BookmarksRouter extends BaseRouter {
  constructor() {
    super();
  }

  addRoutes(): void {
    this.router.get('/', asyncHandler(bookmarksController.getAllBookmarks));
    this.router.get("/search", asyncHandler(bookmarksController.searchBookmarks))
    this.router.post('/', asyncHandler(bookmarksController.insertBookmark));
    this.router.delete("/:bookmarkId", asyncHandler(bookmarksController.deleteBookmark));
  }

  returnApiEndpointRouter() {
    this.addRoutes();
    return this.router;
  }
}

export const bookmarksRouter = new BookmarksRouter().returnApiEndpointRouter();
