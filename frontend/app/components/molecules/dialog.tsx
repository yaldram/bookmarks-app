import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { tv } from "tailwind-variants";
import { X } from "lucide-react";

export const Dialog = DialogPrimitive.Root;

export const DialogTrigger = DialogPrimitive.Trigger;

export const DialogPortal = DialogPrimitive.Portal;

export const DialogClose = DialogPrimitive.Close;

const dialogOverlayStyles = tv({
  base: "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
});

export const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...delegated }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={dialogOverlayStyles({ className })}
    {...delegated}
  />
));

DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const dialogContentStyles = tv({
  base: "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
});

export const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...delegated }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={dialogContentStyles({ className })}
      {...delegated}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
));

DialogContent.displayName = DialogPrimitive.Content.displayName;

const dialogHeaderStyles = tv({
  base: "flex flex-col space-y-1.5 text-center sm:text-left",
});

export const DialogHeader = ({
  className,
  ...delegated
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={dialogHeaderStyles({ className })} {...delegated} />
);

DialogHeader.displayName = "DialogHeader";

const dialogFooterStyles = tv({
  base: "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
});

export const DialogFooter = ({
  className,
  ...delegated
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={dialogFooterStyles({ className })} {...delegated} />
);

DialogFooter.displayName = "DialogFooter";

const dialogTitleStyles = tv({
  base: "text-lg font-semibold leading-none tracking-tight",
});

export const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...delegated }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={dialogTitleStyles({ className })}
    {...delegated}
  />
));

DialogTitle.displayName = DialogPrimitive.Title.displayName;

const dialogDescriptionStyles = tv({
  base: "text-sm text-muted-foreground",
});

export const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...delegated }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={dialogDescriptionStyles({ className })}
    {...delegated}
  />
));

DialogDescription.displayName = DialogPrimitive.Description.displayName;
