"use client";

import { Category } from "@prisma/client";
import Modal from "./ModalLayout";
import { useEffect, useState } from "react";
import { useProductFilterStore } from "@/store/products";
import { useModalTransitionShow } from "@/store/modal";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
};

function CategorySelect({ isOpen, onClose, categories }: Readonly<Props>) {

  const { filter, setFilter } = useProductFilterStore();
  const { setShow } = useModalTransitionShow();
  const [ selectedCategories, setSelectedCategories ] = useState<string[]>([]);

  const handleSelectionClick = (value: string) => {
    if (selectedCategories.includes(value)) {
      setSelectedCategories(prev => prev.filter(category => category != value));
    } else {
      if (selectedCategories.length >= 5) return;
      setSelectedCategories([...selectedCategories, value]);
    }
  }

  const handleClose = () => {
    setShow(false);
    setTimeout(() => {
      setShow(true);
      onClose();
    }, 200);
  }

  const handleSelectReset = () => {
    setSelectedCategories([]);
    setFilter('category', []);
    handleClose();
  }

  const updateCategoryFilter = () => {
    setFilter('category', selectedCategories);
    handleClose();
  }

  useEffect(() => {
    setSelectedCategories([...filter.category]);
  }, [filter.category]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Select Categories" >
      <div>
        <p className="text-center text-blue-400">Select at most 5 categories</p>
        <div className="flex gap-2 flex-wrap my-6 sm:m-8 justify-center max-h-60 overflow-auto">
        { categories?.map((category) => (
          <button
            key={category.name}
            className={`px-4 md:px-6 py-2 text-black rounded-xl ${selectedCategories.includes(category.name) ? "bg-green-400" : "bg-zinc-400 hover:bg-sky-400"}`}
            onClick={() => { handleSelectionClick(category.name) }}
          >
            {category.name}
          </button>
          ))
        }
        </div>
        <div className="md:pb-4 md:pr-12 flex justify-end gap-2">
          <button
            className="px-4 md:px-6 py-2 bg-green-400 text-black hover:bg-green-600 rounded-xl"
            onClick={() => handleSelectReset()}
          >Show All</button>
          <button
            className="px-4 md:px-6 py-2 bg-red-400 text-black hover:bg-red-600 rounded-xl"
            onClick={() => handleClose()}
          >Cancel</button>
          <button
            className="px-4 md:px-6 py-2 bg-sky-400 text-black hover:bg-blue-600 rounded-xl"
            onClick={() => updateCategoryFilter()}
          >Apply</button>
        </div>
      </div>
    </Modal>
  );
}

export default CategorySelect;