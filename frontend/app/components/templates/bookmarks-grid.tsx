import { Form } from "@remix-run/react";

import { ScrollArea } from "../molecules/scroll-area";
import { BookmarkCard } from "../organisms/bookmark-card";
import type { Bookmark } from "~/types";

export type BookmarksGridProps = {
  bookmarks: Bookmark[];
};

export function BookmarksGrid({ bookmarks }: BookmarksGridProps) {
  return (
    <ScrollArea className="h-[90%] px-10 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-10 align-stretch">
        {bookmarks.map((bookmark) => (
          <Form method="POST" key={bookmark._id}>
            <input type="hidden" name="bookmarkId" value={bookmark._id} />
            <BookmarkCard bookmark={bookmark} />
          </Form>
        ))}
      </div>
    </ScrollArea>
  );
}
