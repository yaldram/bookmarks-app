import { Link } from "@remix-run/react";

import type { Bookmark } from "~/types";
import { Button } from "../atoms/button";
import { Badge } from "../atoms/badge";
import { Card, CardContent, CardFooter } from "../molecules/card";

interface BookmarkCardProps {
  bookmark: Bookmark;
}

export function BookmarkCard({ bookmark }: BookmarkCardProps) {
  const { summary, context, tags, link } = bookmark;

  return (
    <Card className="flex flex-col align-stretch justify-between h-full">
      <CardContent className="flex flex-col gap-6 pt-6">
        <div>{summary || context}</div>

        {tags && (
          <div className="flex gap-2 flex-wrap">
            {tags.map((tag, index) => (
              <Badge key={index}>{tag}</Badge>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="border-t border-muted p-0 py-3 px-6 justify-end gap-4">
        <Button type="submit" variant="destructive">
          Delete
        </Button>
        <Button asChild>
          <Link to={link} target="_blank" rel="noopener noreferrer">
            View
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
