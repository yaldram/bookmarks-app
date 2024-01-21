import { Outlet, NavLink, useNavigate, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import type { MetaFunction } from "@remix-run/node";

import { Button } from "~/components/atoms/button";
import { fetchCollections } from "~/api/collections";

export const meta: MetaFunction = () => {
  return [
    { title: "Bookmarks AI" },
    { name: "description", content: "Welcome to Bookmarks App!" },
  ];
};

export async function loader() {
  const collections = await fetchCollections();

  return json(collections);
}

export default function Index() {
  const collections = useLoaderData<typeof loader>();

  const navigate = useNavigate();

  return (
    <div className="flex h-screen">
      <div className="flex justify-between h-full flex-col border-e w-1/4">
        <div>
          {/* Sticky bar separator */}
          <div
            onClick={() => navigate("/home")}
            className="flex cursor-pointer hover:bg-muted pointer-cursor uppercase font-bold text-2xl items-center px-8 sticky inset-x-0 top-0 border-b bg-red h-20"
          >
            All Collections
          </div>

          {/* List of collections */}
          <div className="px-4 pb-4">
            <ul className="mt-6 space-y-3">
              {collections.map((collection) => (
                <li key={collection._id}>
                  {/* Navigation links for collections */}
                  <NavLink
                    to={`/home/collection/${collection._id}`}
                    className={({ isActive }) =>
                      `block rounded-lg p-4 text-sm font-medium hover:bg-accent hover:text-accent-foreground ${
                        isActive
                          ? "bg-accent text-accent-foreground"
                          : "bg-background"
                      }`
                    }
                  >
                    {collection.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom section - User details and Logout button */}
        <div className="sticky px-6 inset-x-0 bottom-0 pb-6">
          <Button onClick={() => navigate("new")} className="w-full" size="lg">
            Add New Collection
          </Button>
        </div>
      </div>

      <div className="w-full h-full">
        <Outlet />
      </div>
    </div>
  );
}
