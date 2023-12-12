import * as Realm from "realm-web";
import { useEffect, useRef, useState } from "react";
import { json, redirect } from "@remix-run/node";
import { z } from "zod";
import { parse } from "@conform-to/zod";
import { conform, useForm } from "@conform-to/react";
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import {
  useLoaderData,
  Form,
  useFetcher,
  useActionData,
  useNavigate,
  useSearchParams,
} from "@remix-run/react";

import { Button } from "~/components/atoms/button";
import { BookmarkCard } from "~/components/organisms/BookmarkCard";
import { Modal } from "~/components/molecules/Modal";
import { Input } from "~/components/atoms/input";
import { useModal } from "~/hooks/useModal";
import {
  deleteBookmark,
  fetchBookmarks,
  insertBookmarks,
} from "~/api/bookmarks";

const realmApp = new Realm.App({ id: "bookmarks-app-wjney" });

const createBookmarkSchema = z.object({
  link: z
    .string({ required_error: "link is required" })
    .url("link is not valid"),
  context: z.string({ required_error: "context is required" }),
});

const searchBookmarkSchema = z.object({
  search: z.string({ required_error: "search cannot be empty" }),
});

export const meta: MetaFunction = () => {
  return [
    { title: "Bookmarks AI" },
    { name: "description", content: "Welcome to Bookmarks App!" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const lastId = new URL(request.url).searchParams.get("lastId");
  const searchQuery = new URL(request.url).searchParams.get("searchQuery");

  const response = await fetchBookmarks(searchQuery, lastId);

  if (!response.ok) throw new Error("Could'nt load bookmarks");

  const data = await response.json();

  return json(data.bookmarks);
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  // handle adding bookmarks
  if (request.method === "POST") {
    const submission = parse(formData, { schema: createBookmarkSchema });

    if (!submission.value) {
      return json(submission, { status: 400 });
    }

    const { link, context } = submission.value;

    await insertBookmarks(link, context);
  }

  // handle deleting bookmarks
  const bookmarkId = await formData.get("bookmarkId")?.toString();

  if (request.method === "DELETE" && bookmarkId) {
    await deleteBookmark(bookmarkId);
  }

  return redirect("/");
}

type Bookmark = {
  _id: string;
  summary?: string;
  link: string;
  context: string;
  tags?: string[];
};

export default function Index() {
  const bookmarks = useLoaderData<Bookmark[]>();
  const infinteScrollFetcher = useFetcher();
  const addBookmarksFetcher = useFetcher();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const lastSubmission = useActionData<typeof action>();

  const observerRef = useRef(null);
  const searchFormRef = useRef<HTMLFormElement>(null);

  const [createBookmarkForm, { link, context }] = useForm({
    id: "bookmark",
    lastSubmission,
    shouldRevalidate: "onInput",
    onValidate({ formData }) {
      return parse(formData, { schema: createBookmarkSchema });
    },
  });

  const [searchBookmarkForm, { search }] = useForm({
    id: "search",
    shouldRevalidate: "onInput",
    ref: searchFormRef,
    onSubmit(event, { submission }) {
      event.preventDefault();
      const searchQuery = submission.payload.search as string;
      navigate(`/?index&searchQuery=${searchQuery}`);
    },
    defaultValue: {
      search: params.has("searchQuery") ? params.get("searchQuery") : "",
    },
    onValidate({ formData }) {
      return parse(formData, { schema: searchBookmarkSchema });
    },
  });

  const [bookmarkData, setBookmarkData] = useState<Bookmark[]>(bookmarks || []);
  const [shouldFetch, setShouldFetch] = useState(true);

  const { isModalOpen, closeModal, toggleModal } = useModal(false);

  useEffect(() => {
    setBookmarkData(bookmarks);
    // reset the status to true, whenever the loader runs
    setShouldFetch(true);
  }, [bookmarks]);

  useEffect(() => {
    if (!params.has("searchQuery")) {
      searchFormRef.current?.reset();
    }
  }, [params]);

  useEffect(() => {
    (async function () {
      // authenticate using anonymous user
      realmApp.logIn(Realm.Credentials.anonymous());

      if (realmApp.currentUser) {
        const mongodb = realmApp.currentUser.mongoClient("mongodb-atlas");
        const bookmarksCollection = mongodb
          .db("bookmarks")
          .collection("bookmarks");

        const changeStream = bookmarksCollection.watch({
          filter: {
            operationType: "update",
            "updateDescription.updatedFields.summary": { $exists: true },
          },
        });

        for await (const change of changeStream) {
          // @ts-ignore: we are only watching for updates
          const updatedBookmark = change.fullDocument as Bookmark;

          // @ts-ignore: we also get the embedding field
          delete updatedBookmark["embedding"];

          setBookmarkData((bookmarks) =>
            bookmarks.map((bookmark) =>
              bookmark._id === updatedBookmark._id.toString()
                ? { ...bookmark, ...updatedBookmark }
                : bookmark
            )
          );
        }
      }
    })();
  }, []);

  // run only on mount; not to open too many connections
  // useEffect(() => {
  //   const eventSource = new EventSource(
  //     "http://localhost:8000/api/bookmarks/events"
  //   );

  //   // Handle messages received from the server
  //   eventSource.onmessage = (event) => {
  //     const updatedBookmark = JSON.parse(event.data) as Bookmark;

  //     if (updatedBookmark) {
  //       setBookmarkData((bookmarks) =>
  //         bookmarks.map((bookmark) =>
  //           bookmark._id === updatedBookmark._id
  //             ? { ...bookmark, ...updatedBookmark }
  //             : bookmark
  //         )
  //       );
  //     }
  //   };

  //   // Handle SSE errors
  //   eventSource.onerror = (error) => {
  //     console.error("Error occurred:", error);
  //   };

  //   return () => {
  //     if (eventSource) {
  //       eventSource.close();
  //     }
  //   };
  // }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];

      // @ts-ignore: search is available on the searchFormRef
      const searchValue = searchFormRef.current?.elements?.search.value;

      if (!shouldFetch || searchValue) return;

      if (entry.isIntersecting && infinteScrollFetcher.state !== "loading") {
        infinteScrollFetcher.load(
          `/?index&lastId=${bookmarkData[bookmarkData.length - 1]._id}`
        );
      }
    });

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [observerRef, shouldFetch, infinteScrollFetcher, bookmarkData]);

  useEffect(() => {
    if (!infinteScrollFetcher.data) return;

    const fetcherData = infinteScrollFetcher.data as Bookmark[];

    if (fetcherData.length === 0) {
      setShouldFetch(false);
      return;
    }

    if (fetcherData.length > 0) {
      setBookmarkData((prevData) => [...prevData, ...fetcherData]);
    }
  }, [infinteScrollFetcher.data]);

  useEffect(() => {
    if (addBookmarksFetcher.formData && isModalOpen) {
      closeModal();
    }
  }, [addBookmarksFetcher.formData, isModalOpen, closeModal]);

  return (
    <>
      <Modal onOutsideClick={toggleModal} isOpen={isModalOpen}>
        <addBookmarksFetcher.Form method="POST" {...createBookmarkForm.props}>
          <Modal.Header>Add Bookmark Link</Modal.Header>
          <Modal.Body className="flex flex-col gap-4">
            <Input
              {...conform.input(link, { type: "text", ariaAttributes: true })}
              label="Link"
              placeholder="Enter bookmark link"
              error={link.error}
            />

            <Input
              {...conform.input(context, {
                type: "text",
                ariaAttributes: true,
              })}
              label="Context"
              placeholder="Enter more context about the link"
              error={context.error}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button
              disabled={
                addBookmarksFetcher.state === "submitting" ||
                addBookmarksFetcher.state === "loading"
              }
              type="submit"
            >
              Save
            </Button>
          </Modal.Footer>
        </addBookmarksFetcher.Form>
      </Modal>

      <Form {...searchBookmarkForm.props}>
        <div className="flex flex-col p-10 gap-6">
          <Input
            {...conform.input(search, {
              type: "text",
              ariaAttributes: true,
            })}
            label="Search"
            placeholder="enter search query"
            error={search.error}
          />
          <Button>Search</Button>
        </div>
      </Form>

      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 align-stretch">
        {bookmarkData.map((bookmark) => (
          <div key={bookmark._id} className="col-span-1">
            <Form method="DELETE" className="h-full">
              <input type="hidden" name="bookmarkId" value={bookmark._id} />
              <BookmarkCard
                tags={bookmark.tags}
                summary={bookmark.summary}
                context={bookmark.context}
                link={bookmark.link}
              />
            </Form>
          </div>
        ))}
      </div>
      {/* Intersection Observer target */}
      {bookmarkData.length > 4 && (
        <div ref={observerRef} style={{ height: "1px" }} />
      )}
      <Button
        onClick={toggleModal}
        className="fixed right-4 bottom-4 p-6 w-16 h-16 text-2xl rounded-full shadow-lg"
      >
        +
      </Button>
    </>
  );
}
