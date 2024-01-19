import { Button, ButtonLink } from "../atoms/button";
import { Tag } from "../atoms/tag";
import type { Bookmark } from "~/types";

interface BookmarkCardProps {
  bookmark: Bookmark;
}

export function BookmarkCard({ bookmark }: BookmarkCardProps) {
  const { summary, context, tags, link } = bookmark;

  return (
    <div className="flex flex-col justify-between bg-white h-full shadow rounded-lg py-6">
      <div>
        <div className="mb-4 px-6">
          <p className="text-gray-700 text-lg">{summary || context}</p>
        </div>
        {tags && (
          <div className="mb-4 flex gap-2 flex-wrap px-6">
            {tags.map((tag, index) => (
              <Tag key={index}>{tag}</Tag>
            ))}
          </div>
        )}
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
