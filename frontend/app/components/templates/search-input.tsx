import { Form, useNavigate, useSearchParams } from "@remix-run/react";
import { BadgeXIcon, SearchIcon } from "lucide-react";

import { Input } from "../atoms/input";
import { Button } from "../atoms/button";
import { useEffect, useState } from "react";

export function SearchInput() {
  const navigate = useNavigate();

  const [params] = useSearchParams();
  const searchParams = params.get("search") || "";

  const [search, setSearch] = useState(searchParams);

  useEffect(() => {
    // reset the search params on clear
    setSearch(searchParams);
  }, [searchParams]);

  const clearInput = () => {
    if (searchParams) return navigate(".");

    setSearch("");
  };

  return (
    <Form>
      <div className="flex items-end p-10 pb-0 gap-6">
        <Input
          name="search"
          id="search"
          placeholder="Search this collection using natural language."
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
  );
}
