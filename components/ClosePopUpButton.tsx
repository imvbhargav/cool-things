"use client";

import { forwardRef, type ForwardedRef } from 'react';

type ClosePopUpButtonProps = {
  action: () => void;
}

const ClosePopUpButton = forwardRef(function ClosePopUpButton(
  props: ClosePopUpButtonProps,
  ref: ForwardedRef<HTMLButtonElement>
) {
  return (
    <button
      ref={ref}
      onClick={() => props.action()}
      className="absolute top-4 right-4 hover:bg-red-500 p-2 rounded-lg transition-colors"
      aria-label="Close login dialog"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  );
});

export default ClosePopUpButton;