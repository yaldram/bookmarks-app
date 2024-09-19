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

import { insertCollections } from "~/api/collections";
import { Button } from "~/components/atoms/button";
import { Input } from "~/components/atoms/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/molecules/dialog";

const createCollectionSchema = z.object({
  name: z.string({ required_error: "name is required" }),
  description: z.string({ required_error: "description is required" }),
});

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const submission = parseWithZod(formData, { schema: createCollectionSchema });

  if (submission.status !== "success") {
    return json({ ...submission.reply() });
  }

  const collection = await insertCollections(submission.value);

  return redirect(`/home/collection/${collection._id}`);
}

export default function NewCollectionPage() {
  const navigation = useNavigation();
  const navigate = useNavigate();
  const actionData = useActionData<typeof action>();

  const [form, { name, description }] = useForm({
    id: "new-collection",
    lastResult: actionData,
    shouldValidate: "onInput",
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: createCollectionSchema });
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

        <Form
          method="POST"
          className="flex flex-col gap-5"
          id={form.id}
          onSubmit={form.onSubmit}
        >
          <Input
            {...getInputProps(name, { type: "text" })}
            label="Name"
            id="name"
            placeholder="Name for the collection."
            error={name.errors?.[0] ?? ""}
            errorId={name.errorId}
          />

          <Input
            {...getInputProps(description, { type: "text" })}
            id="description"
            label="Description"
            placeholder="A short description."
            error={description.errors?.[0] ?? ""}
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
