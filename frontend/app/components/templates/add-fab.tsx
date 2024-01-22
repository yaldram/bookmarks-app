import { useNavigate } from "@remix-run/react";
import { PlusIcon } from "lucide-react";

import { Button } from "../atoms/button";

export type AddFabProps = {
  to: string;
};

export function AddFab({ to }: AddFabProps) {
  const navigate = useNavigate();

  return (
    <Button
      onClick={() => navigate(to)}
      size="icon"
      className="rounded-full h-14 w-14 fixed right-4 bottom-4"
    >
      <PlusIcon className="h-8 w-8" />
    </Button>
  );
}
