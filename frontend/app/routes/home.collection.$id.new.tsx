import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { z } from "zod";
import { parseWithZod } from "@conform-to/zod";
import { getInputProps, useForm } from "@conform-to/react";
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

  const submission = parseWithZod(formData, { schema: createBookmarkSchema });

  if (submission.status !== "success") {
    return json({ ...submission.reply() });
  }

  const collectionId = params.id as string;

  await insertBookmarks({ ...submission.value, collectionId });

  return redirect(`/home/collection/${collectionId}`);
}

export default function NewBookmark() {
  const navigation = useNavigation();
  const navigate = useNavigate();
  const actionData = useActionData<typeof action>();

  const [form, { link, context }] = useForm({
    id: "new-bookmark",
    lastResult: actionData,
    shouldValidate: "onInput",
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: createBookmarkSchema });
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

        <Form
          method="POST"
          className="flex flex-col gap-5"
          id={form.id}
          onSubmit={form.onSubmit}
        >
          <Input
            {...getInputProps(link, { type: "text" })}
            label="Link"
            id="link"
            placeholder="Enter bookmark link"
            error={link.errors?.[0] ?? ""}
            errorId={link.errorId}
          />

          <Input
            {...getInputProps(context, { type: "text" })}
            id="context"
            label="Context"
            placeholder="Enter more context about the link"
            error={context.errors?.[0] ?? ""}
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
