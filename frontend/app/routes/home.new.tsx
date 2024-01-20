import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { z } from "zod";
import { parse } from "@conform-to/zod";
import { conform, useForm } from "@conform-to/react";
import { insertBookmarks } from "~/api/bookmarks";

import { Button } from "~/components/atoms/button";
import { Input } from "~/components/atoms/input";
import { Modal } from "~/components/molecules/Modal";
import {
  Form,
  useActionData,
  useNavigate,
  useNavigation,
} from "@remix-run/react";

const createBookmarkSchema = z.object({
  link: z
    .string({ required_error: "link is required" })
    .url("link is not valid"),
  context: z.string({ required_error: "context is required" }),
});

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const submission = parse(formData, { schema: createBookmarkSchema });

  if (!submission.value) return json(submission, { status: 400 });

  await insertBookmarks(submission.value);

  return redirect("/home");
}

export default function NewBookmark() {
  const navigation = useNavigation();
  const navigate = useNavigate();
  const lastSubmission = useActionData<typeof action>();

  const [createBookmarkForm, { link, context }] = useForm({
    id: "bookmark",
    lastSubmission,
    shouldRevalidate: "onInput",
    onValidate({ formData }) {
      return parse(formData, { schema: createBookmarkSchema });
    },
  });

  return (
    <Modal onOutsideClick={() => navigate("..")} isOpen>
      <Form method="POST" {...createBookmarkForm.props}>
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
          <Button type="submit" disabled={navigation.state !== "idle"}>
            Save
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
