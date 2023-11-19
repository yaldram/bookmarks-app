import { asyncHandler } from "@middlewares/asyncHandler";
import { BaseRouter } from "@utils/BaseRouter";
import { bookmarksController } from "./bookmarks.controller";
import { bookmarksEvent } from "./bookmarks.events";

class BookmarksRouter extends BaseRouter {
  constructor() {
    super();
  }

  addRoutes(): void {
    this.router.get('/', asyncHandler(bookmarksController.getAllBookmarks));
    this.router.post('/', asyncHandler(bookmarksController.insertBookmark));
    this.router.delete("/:bookmarkId", asyncHandler(bookmarksController.deleteBookmark));
    this.router.get("/events", asyncHandler(bookmarksEvent.updateSummaryEvent));
  }

  returnApiEndpointRouter() {
    this.addRoutes();
    return this.router;
  }
}

export const bookmarksRouter = new BookmarksRouter().returnApiEndpointRouter();
