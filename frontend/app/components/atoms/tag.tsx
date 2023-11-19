import type { ReactNode } from "react";

export type TagProps = {
  children?: ReactNode;
};

export function Tag({ children }: TagProps) {
  return (
    <span className="bg-red-300 text-black-700 text-xs p-2 rounded uppercase font-semibold tracking-wide">
      {children}
    </span>
  );
}
