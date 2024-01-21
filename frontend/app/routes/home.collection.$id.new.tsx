import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { z } from "zod";
import { parse } from "@conform-to/zod";
import { conform, useForm } from "@conform-to/react";
import {
  Form,
  useActionData,
  useNavigate,
  useNavigation,
} from "@remix-run/react";

import { insertBookmarks } from "~/api/bookmarks";
import { Button } from "~/components/atoms/button";
import { Input } from "~/components/atoms/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/molecules/dialog";

const createBookmarkSchema = z.object({
  link: z
    .string({ required_error: "link is required" })
    .url("link is not valid"),
  context: z.string({ required_error: "context is required" }),
});

export async function action({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData();

  const submission = parse(formData, { schema: createBookmarkSchema });

  if (!submission.value) return json(submission, { status: 400 });

  const collectionId = params.id as string;

  await insertBookmarks({ ...submission.value, collectionId });

  return redirect(`/home/collection/${collectionId}`);
}

export default function NewBookmark() {
  const navigation = useNavigation();
  const navigate = useNavigate();
  const lastSubmission = useActionData<typeof action>();

  const [form, { link, context }] = useForm({
    id: "new-bookmark",
    lastSubmission,
    shouldRevalidate: "onInput",
    onValidate({ formData }) {
      return parse(formData, { schema: createBookmarkSchema });
    },
  });

  const handleDialogOpen = (opening: boolean) => {
    if (opening) return;

    return navigate("..");
  };

  return (
    <Dialog defaultOpen onOpenChange={handleDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a new bookmark</DialogTitle>
          <DialogDescription>
            Add a new bookmark. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        <Form method="POST" className="flex flex-col gap-5" {...form.props}>
          <Input
            {...conform.input(link, { type: "text", ariaAttributes: true })}
            label="Link"
            id="link"
            placeholder="Enter bookmark link"
            error={link.error}
            errorId={link.errorId}
          />

          <Input
            {...conform.input(context, {
              type: "text",
              ariaAttributes: true,
            })}
            id="context"
            label="Context"
            placeholder="Enter more context about the link"
            error={context.error}
            errorId={context.errorId}
          />

          <Button
            disabled={navigation.state !== "idle"}
            type="submit"
            className="w-full"
          >
            Save
          </Button>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
