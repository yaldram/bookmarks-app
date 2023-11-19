import type { ReactNode } from "react";

import { Button, ButtonLink } from "../atoms/button";
import { Tag } from "../atoms/tag";

interface BookmarkCardProps {
  summary?: string;
  tags?: string[];
  link: string;
  context: string;
  children?: ReactNode;
}

export function BookmarkCard({
  tags = [],
  summary,
  context,
  link,
}: BookmarkCardProps) {
  return (
    <div className="flex flex-col justify-between bg-white h-full shadow rounded-lg py-6">
      <div>
        <div className="mb-4 px-6">
          <p className="text-gray-700 text-lg">{summary || context}</p>
        </div>
        <div className="mb-4 flex gap-2 flex-wrap px-6">
          {tags.map((tag, index) => (
            <Tag key={index}>{tag}</Tag>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2 px-6 border-t border-gray-200 pt-4">
        <Button type="submit" variant="error">
          Delete
        </Button>
        <ButtonLink href={link} target="_blank" rel="noopener noreferrer">
          View
        </ButtonLink>
      </div>
    </div>
  );
}
