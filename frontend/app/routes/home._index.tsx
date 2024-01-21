import { useEffect, useRef, useState } from "react";
import { SearchIcon, BadgeXIcon } from "lucide-react";
import { json } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";
import {
  Form,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from "@remix-run/react";

import { searchBookmarks } from "~/api/bookmarks";
import { Input } from "~/components/atoms/input";
import { Button } from "~/components/atoms/button";
import type { Bookmark } from "~/types";
import { BookmarkCard } from "~/components/organisms/bookmark-card";

export async function loader({ request }: LoaderFunctionArgs) {
  const searchQuery = new URL(request.url).searchParams.get("search");

  if (searchQuery) {
    const bookmarks = await searchBookmarks(searchQuery);

    return json(bookmarks);
  }

  return [];
}

export default function HomeIndexPage() {
  const bookmarks = useLoaderData() as Bookmark[];
  const navigate = useNavigate();

  const [params] = useSearchParams();
  const searchParams = params.get("search") || "";
  const [search, setSearch] = useState(searchParams);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // reset the search params on clear
    setSearch(searchParams);
  }, [searchParams]);

  const clearInput = () => {
    if (searchParams) return navigate("/");

    setSearch("");
  };

  return (
    <>
      <Form>
        <div className="flex items-end p-10 pb-0 gap-6">
          <Input
            ref={searchRef}
            name="search"
            id="search"
            placeholder="Search all your bookmarks using natural."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <fieldset className="flex gap-6" disabled={!search}>
            <Button type="submit">
              <SearchIcon className="mr-2 h-4 w-4" /> Search
            </Button>
            <Button variant="secondary" type="button" onClick={clearInput}>
              <BadgeXIcon className="mr-2 h-4 w-4" /> Clear
            </Button>
          </fieldset>
        </div>
      </Form>

      <div className="px-10 py-10 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-10 align-stretch">
        {bookmarks.map((bookmark) => (
          <Form method="POST" key={bookmark._id}>
            <input type="hidden" name="bookmarkId" value={bookmark._id} />
            <BookmarkCard bookmark={bookmark} />
          </Form>
        ))}
      </div>
    </>
  );
}
