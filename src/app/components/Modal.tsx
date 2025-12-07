import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ReactNode, useEffect, useRef } from "react";

type ModalProps = {
  isVisible: boolean;
  title?: string;
  hideHeader?: boolean;
  showCloseButton?: boolean;
  hasBackdropPadding?: boolean;
  modalClasses?: string;
  bodyClasses?: string;
  children: ReactNode;
  theme?: "light" | "dark";
  footer?: React.JSX.Element;
  onClose: () => void;
};

const Modal = ({
  isVisible,
  title,
  hideHeader = false,
  showCloseButton = true,
  hasBackdropPadding = true,
  children,
  modalClasses,
  bodyClasses,
  theme = "light",
  footer,
  onClose,
}: ModalProps) => {
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

  if (!isVisible) return <></>;

  return (
    <div
      className={`absolute top-0 left-0 h-full w-full flex justify-center items-center bg-gray-800/40 ${
        hasBackdropPadding ? "px-3" : ""
      }`}
      onClick={handleBackdropClick}
      ref={backdropRef}
    >
      <div
        className={`w-full ${
          theme === "light" ? "bg-gray-100" : "bg-gray-800"
        } rounded-lg flex flex-col relative overflow-hidden ${modalClasses}`}
      >
        {!hideHeader && (
          <section className="w-full flex justify-between p-5 pb-0">
            <h3
              className={`text-2xl ${
                theme === "light" ? "text-gray-800" : "text-gray-100"
              }`}
            >
              {title}
            </h3>
            {showCloseButton && (
              <button
                className={`w-10 h-10 cursor-pointer flex justify-center items-center rounded-full ${
                  theme === "light"
                    ? "text-gray-800 hover:bg-amber-400"
                    : "text-gray-100 hover:bg-amber-600"
                }`}
                onClick={onClose}
              >
                <FontAwesomeIcon icon={faXmark} size="lg" />
              </button>
            )}
          </section>
        )}

        <section className={`grow overflow-y-auto w-full ${bodyClasses}`}>
          {children}
        </section>

        {footer && (
          <section
            className={`w-full ${
              theme === "light"
                ? "bg-amber-400 border-gray-800"
                : "bg-amber-600 border-gray-200"
            } px-5 py-4 border-t`}
          >
            {footer}
          </section>
        )}
      </div>
    </div>
  );
};

export default Modal;
