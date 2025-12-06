import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef } from "react";

type ConfirmDialogProps = {
  isVisible: boolean;
  showCloseButton?: boolean;
  title?: string;
  message: string;
  description?: string;
  onClose: () => void;
  onConfirm?: () => void;
  onCancel?: () => void;
};

const ConfirmDialog = ({
  isVisible,
  showCloseButton = true,
  title,
  message,
  description,
  onClose,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => {
  const backdropRef = useRef<HTMLDivElement>(null);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === backdropRef.current) {
      onClose();
    }
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isVisible, onClose]);

  if (!isVisible) {
    return <></>;
  }

  return (
    <div
      className="absolute top-0 left-0 h-full w-full flex justify-center items-center bg-transparent px-3"
      onClick={handleBackdropClick}
      ref={backdropRef}
    >
      <div
        className={`min-w-full md:min-w-1/2 w-max bg-gray-800 rounded-lg flex flex-col gap-5 relative overflow-hidden shadow-xl shadow-gray-800 p-5`}
      >
        <section className="flex items-center justify-between gap-4">
          <p className="grow text-xl md:text-2xl font-semibold">{title}</p>
          {showCloseButton && (
            <button
              className="w-10 h-10 cursor-pointer flex justify-center items-center rounded-full text-gray-100 hover:bg-amber-400 hover:text-gray-800"
              onClick={onClose}
            >
              <FontAwesomeIcon icon={faXmark} size="lg" />
            </button>
          )}
        </section>

        <section className="flex flex-col gap-4 px-2 md:px-5">
            <p className="text-center text-xl text-amber-400">{message}</p>
            <p className="text-center text-sm md:text-base text-gray-300">{description}</p>
        </section>

        
        <section className="w-full flex justify-between pt-4">
            <button
              type="button"
              className="col-start-4 cursor-pointer border-2 border-gray-400 text-gray-400 hover:bg-amber-400 hover:text-gray-800 hover:border-amber-500 transition-colors duration-200 ease-in-out px-8 py-2 rounded-md"
              onClick={onCancel ?? onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className="col-start-4 cursor-pointer border-2 border-amber-500 text-amber-500 hover:bg-amber-400 hover:text-gray-800 transition-colors duration-200 ease-in-out px-8 py-2 rounded-md"
              onClick={onConfirm}
            >
              Confirm
            </button>
        </section>
      </div>
    </div>
  );
};

export default ConfirmDialog;
