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

import { Button } from "~/components/atoms/button";
import { Input } from "~/components/atoms/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/molecules/dialog";
import { insertCollections } from "~/api/collections";

const createCollectionSchema = z.object({
  name: z.string({ required_error: "name is required" }),
  description: z.string({ required_error: "description is required" }),
});

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const submission = parse(formData, { schema: createCollectionSchema });

  if (!submission.value) return json(submission, { status: 400 });

  const collection = await insertCollections(submission.value);

  return redirect(`/home/collection/${collection._id}`);
}

export default function NewCollectionPage() {
  const navigation = useNavigation();
  const navigate = useNavigate();
  const lastSubmission = useActionData<typeof action>();

  const [form, { name, description }] = useForm({
    id: "new-collection",
    lastSubmission,
    shouldRevalidate: "onInput",
    onValidate({ formData }) {
      return parse(formData, { schema: createCollectionSchema });
    },
  });

  const handleDialogOpen = (opening: boolean) => {
    if (opening) return;

    return navigate(-1);
  };

  return (
    <Dialog defaultOpen onOpenChange={handleDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a new collection</DialogTitle>
          <DialogDescription>
            Add a new collection. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        <Form method="POST" className="flex flex-col gap-5" {...form.props}>
          <Input
            {...conform.input(name, { type: "text", ariaAttributes: true })}
            label="Name"
            id="name"
            placeholder="Name for the collection."
            error={name.error}
            errorId={name.errorId}
          />

          <Input
            {...conform.input(description, {
              type: "text",
              ariaAttributes: true,
            })}
            id="description"
            label="Description"
            placeholder="A short description."
            error={description.error}
            errorId={description.errorId}
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
