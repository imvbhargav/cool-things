import React from 'react';

type SalesTabButtonProps = {
  label: string;
  isActive: boolean;
  onClick: () => void;
};

const SalesTabButton = ({ label, isActive, onClick }: SalesTabButtonProps) => {
  return (
    <button
      className={`py-2 px-4 w-full flex-1 rounded-xl border-2 border-zinc-800 transition-all
        ${isActive ? 'bg-zinc-800' : 'bg-black'}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export default SalesTabButton;