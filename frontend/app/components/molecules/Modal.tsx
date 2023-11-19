import { cva } from "class-variance-authority";
import type { ComponentProps } from "react";

const modal = cva([
  "fixed",
  "inset-0",
  "flex",
  "items-center",
  "justify-center",
  "z-50",
  "pointer-events-none",
  "bg-opacity-50",
]);

export type ModalProps = ComponentProps<"div"> & {
  isOpen: boolean;
  onOutsideClick?: () => void;
};

export function Modal({ children, isOpen, onOutsideClick }: ModalProps) {
  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 overflow-y-auto bg-gray-600 bg-opacity-80"
        onClick={onOutsideClick}
      ></div>
      <div className={modal()}>
        <div className="bg-white pointer-events-auto rounded-lg shadow-lg w-96">
          {children}
        </div>
      </div>
    </>
  );
}

export type ModalHeaderProps = ComponentProps<"div">;

const ModalHeader = ({ children }: ModalHeaderProps) => {
  return <div className="p-4 text-xl font-bold border-b pb-2">{children}</div>;
};

export type ModalBodyProps = ComponentProps<"div">;

const ModalBody = ({ children, className, ...delegated }: ModalBodyProps) => {
  return (
    <div className={`p-4 border-b w-full ${className}`} {...delegated}>
      {children}
    </div>
  );
};

export type ModalFooterProps = ComponentProps<"div">;

const ModalFooter = ({ children }: ModalFooterProps) => {
  return <div className="flex pt-2 pb-3 px-6 justify-end">{children}</div>;
};

Modal.Header = ModalHeader;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;
