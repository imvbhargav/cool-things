"use client";

import { useEffect, useRef, ReactNode, useCallback } from "react";
import { createPortal } from "react-dom";
import ClosePopUpButton from "./ClosePopUpButton";
import { useModalTransitionShow } from "@/store/modal";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  width?: string;
  children: ReactNode;
}

export default function Modal({ isOpen, onClose, title, width = "sm:w-1/2", children }: ModalProps) {
  const hasOpened = useRef(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const { show, setShow } = useModalTransitionShow();

  const handleClose = useCallback(() => {
    setShow(false);
    setTimeout(() => {
      setShow(true);
      onClose();
    }, 200);
  }, [setShow, onClose])

  useEffect(() => {
    if (!isOpen) return;
    const previousActiveElement = document.activeElement as HTMLElement;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }

      if (event.key === "Tab") {
        if (!modalRef.current) return;

        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
          "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])"
        );

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    if (isOpen && closeButtonRef.current && !hasOpened.current) {
      hasOpened.current = true;
      closeButtonRef.current.focus();
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (previousActiveElement instanceof HTMLElement) {
        previousActiveElement.focus();
      }
    };
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className={`fixed flex flex-col justify-center items-center w-screen h-screen top-0 left-0 z-20 p-2 sm:p-5 ${show ? 'open_blur' : 'close_blur'}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={handleClose}
    >
      <div
        className={`relative w-full ${width} max-w-5xl bg-zinc-900 border-4 border-slate-800 rounded-xl p-4 pb-8 z-50 ${show ? 'open' : 'close'}`}
        ref={modalRef}
        onClick={e => e.stopPropagation()}
      >
        <ClosePopUpButton ref={closeButtonRef} action={handleClose} />
        {title && (
          <h1 id="modal-title" className="text-2xl sm:text-4xl text-center font-bold border-b-2 border-zinc-800 pb-4">
            {title}
          </h1>
        )}
        <div className="pt-8">{children}</div>
      </div>
    </div>,
    document.body
  );
}