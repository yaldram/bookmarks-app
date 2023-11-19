import { type ComponentProps } from "react";
import { type VariantProps, cva } from "class-variance-authority";

const button = cva(
  [
    "font-bold",
    "flex",
    "items-center",
    "justify-center",
    "py-2",
    "px-4",
    "rounded",
    "text-white",
  ],
  {
    variants: {
      variant: {
        info: ["bg-blue-500", "hover:bg-blue-700"],
        error: ["bg-red-500", "hover:bg-red-700"],
      },
    },
    defaultVariants: {
      variant: "info",
    },
  }
);

type ButtonProps = ComponentProps<"button"> & VariantProps<typeof button>;

export function Button(props: ButtonProps) {
  const { variant, className, ...delegated } = props;

  const buttonStyles = button({ variant, className });

  return <button className={buttonStyles} {...delegated} />;
}

export type ButtonLinkProps = ComponentProps<"a"> & VariantProps<typeof button>;

export function ButtonLink(props: ButtonLinkProps) {
  const { variant, href, className, children, ...delegated } = props;

  const buttonStyles = button({ variant, className });

  return (
    <a href={href} className={buttonStyles} {...delegated}>
      {children}
    </a>
  );
}
