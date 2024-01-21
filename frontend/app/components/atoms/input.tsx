import * as React from "react";
import { Label } from "@radix-ui/react-label";
import { tv } from "tailwind-variants";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  id: string;
  error?: string;
  errorId?: string;
}

const labelStyles = tv({
  variants: {
    error: {
      true: "text-destructive",
    },
  },
});

const inputStyles = tv({
  base: "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
});

const errorStyles = tv({
  base: "text-sm font-medium text-destructive mt-0.5",
});

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, errorId, id, label, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-2 w-full">
        {label && (
          <Label className={labelStyles({ error: !!error })} htmlFor={id}>
            {label}
          </Label>
        )}
        <input
          id={id}
          type={type}
          className={inputStyles({ className })}
          ref={ref}
          {...props}
        />
        {error && (
          <p className={errorStyles()} id={errorId}>
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
