"use client";

import { Product } from "@prisma/client";
import { useState } from "react";
import Modal from "./ModalLayout";

type UnlistProps = {
  isOpen: boolean;
  toggleUnlistReasons: (item: Product | null) => void;
  itemToUnlist: Product | null;
  updateMessage: (message: string | null) => void;
};

function UnlistProduct({isOpen, toggleUnlistReasons, itemToUnlist, updateMessage}: Readonly<UnlistProps>) {

  const [ reason, setReason ] = useState<string>("SI");

  const unlistProduct = async () => {
    if (!itemToUnlist) return;
    const data = await fetch("/api/seller/products/unlist", {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: itemToUnlist.id,
        reason
      }),
    });
    const { message } = await data.json();
    updateMessage(message);
    toggleUnlistReasons(null);
  };

  return (
    <Modal
      title="Unlist Product"
      isOpen={isOpen}
      onClose={() => toggleUnlistReasons(itemToUnlist)}
    >
      <div className="relative p-2">
        <div className="p-4 rounded-xl text-center">
          <h1 className="text-2xl">What is the reason for unlisting <span className="text-pink-400">{itemToUnlist?.name}</span>?</h1>
          <div className="flex items-center gap-4 mt-4 justify-center">
            <label htmlFor="cars" className="text-xl">Choose a reason:</label>
            <select id="cars" value={reason} onChange={(e) => setReason(e.target.value)}
              className="bg-black px-4 py-2 border-2 border-zinc-500 rounded-xl"
            >
              <option value="SI">Stock Issues</option>
              <option value="SP">Stopped productline</option>
              <option value="HO">Hold ordering</option>
              <option value="DL">Delete listing</option>
            </select>
            <button onClick={unlistProduct} className="bg-red-500 rounded-xl px-6 py-2">Confirm</button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default UnlistProduct;