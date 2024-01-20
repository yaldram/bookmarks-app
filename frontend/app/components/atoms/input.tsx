import { cva } from "class-variance-authority";
import { forwardRef, type ComponentProps } from "react";

const input = cva(
  [
    "w-full",
    "px-3",
    "py-2",
    "border",
    "rounded",
    "focus:ring",
    "focus:border-blue-500",
    "border-gray-300",
  ],
  {
    variants: {
      error: {
        true: ["border-red-500"],
      },
    },
    defaultVariants: {
      error: false,
    },
  }
);

export type InputProps = ComponentProps<"input"> & {
  label?: string;
  error?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      name,
      id,
      label,
      value,
      onChange,
      error,
      placeholder,
      defaultValue,
      ...rest
    },
    ref
  ) => {
    return (
      <div className="w-full">
        {label && (
          <label
            className="block text-gray-700 text-sm font-bold mb-1"
            htmlFor={id}
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={input({ error: !!error })}
          type="text"
          name={name}
          id={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          defaultValue={defaultValue}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={`${id}-error-message`}
          {...rest}
        />
        {error && (
          <span
            id={`${id}-error-message`}
            className="text-red-500 text-xs mt-1"
          >
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
