"use client";

import { useLoadingStore } from "@/store/loading";
import { useProductFilterStore } from "@/store/products";
import { Category } from "@prisma/client";
import { useState } from "react";
import CategorySelect from "./CategorySelect";

function ControlBar({ categories }: Readonly<{categories: Category[]}>) {

  const category = useProductFilterStore(state => state.filter).category;

  const [ showCategories, setShowCategories ] = useState(false);

  const { filter, setFilter } = useProductFilterStore();
  const { loading } = useLoadingStore();

  const toggleSorting = () => {
    const newSort = filter.sort == 'asc' ? 'desc' : 'asc';
    setFilter('sort', newSort);
  };

  const handleHideCategories = () => {
    setShowCategories(!showCategories);
  }

  return (
    <>
      { showCategories &&
        <CategorySelect
          isOpen={showCategories}
          onClose={handleHideCategories}
          categories={categories}
        />
      }
      <div className="rounded-t-xl bg-slate-800">
        <div className="flex justify-between gap-4 py-2 px-4 text-base sm:text-xl md:text-2xl">
          <div className="flex flex-col"><span className="text-base text-zinc-400">Category:</span>
            <button
              className="bg-transparent outline-none border-none text-md disabled:text-zinc-600"
              onClick={() => handleHideCategories()}
            >
              { (category && category.length > 0) ? `Selected (${category.length})` : "All" }
            </button>
          </div>
          <button
            className="disabled:text-zinc-600 flex flex-col"
            disabled={loading}
            onClick={() => toggleSorting()}
          >
            <span className="text-base text-zinc-400">Sort:</span> <span className="text-md">Price { filter.sort == 'asc' ? <>(&uarr;)</> : <>(&darr;)</> }</span>
          </button>
        </div>
        <div className="h-5 rounded-t-xl bg-zinc-950 w-full"></div>
      </div>
    </>
  );
}

export default ControlBar;