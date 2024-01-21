import * as React from "react";

import { tv } from "tailwind-variants";

const cardStyles = tv({
  base: "rounded-lg border bg-card text-card-foreground shadow-sm",
});

export const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...delegated }, ref) => (
  <div ref={ref} className={cardStyles({ className })} {...delegated} />
));

Card.displayName = "Card";

const cardHeaderStyles = tv({
  base: "flex flex-col space-y-1.5 p-6",
});

export const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...delegated }, ref) => (
  <div ref={ref} className={cardHeaderStyles({ className })} {...delegated} />
));

CardHeader.displayName = "CardHeader";

const cardTitleStyles = tv({
  base: "text-2xl font-semibold leading-none tracking-tight",
});

export const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...delegated }, ref) => (
  <h3 ref={ref} className={cardTitleStyles({ className })} {...delegated} />
));

CardTitle.displayName = "CardTitle";

const cardDescriptionStyles = tv({
  base: "text-sm text-muted-foreground",
});

export const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...delegated }, ref) => (
  <p
    ref={ref}
    className={cardDescriptionStyles({ className })}
    {...delegated}
  />
));

CardDescription.displayName = "CardDescription";

const cardContentStyles = tv({
  base: "p-6 pt-0",
});

export const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...delegated }, ref) => (
  <div ref={ref} className={cardContentStyles({ className })} {...delegated} />
));

CardContent.displayName = "CardContent";

const cardFooterStyles = tv({
  base: "flex items-center p-6 pt-0",
});

export const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...delegated }, ref) => (
  <div ref={ref} className={cardFooterStyles({ className })} {...delegated} />
));

CardFooter.displayName = "CardFooter";
