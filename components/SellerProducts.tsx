"use client";

import { Product } from "@prisma/client";
import { useState } from "react";
import UnlistProduct from "./UnlistProduct";
import Image from "next/image";

function SellerProducts({items, newProduct, editItem}: Readonly<{items: Product[], newProduct: boolean, editItem: (item: Product) => void}>) {

  const [ showUnlistReasons, setShowUnlistReasons ] = useState<boolean>(false);
  const [ itemToUnlist, setItemToUnlist ] = useState<Product | null>(null);
  const [ message, setMessage ] = useState<string | null>(null);

  const toggleUnlistReasons = (item: Product | null) => {
    if (item) setItemToUnlist(item);
    setShowUnlistReasons(!showUnlistReasons);
  }

  const updateMessage = (message: string | null) => {
    setMessage(message);
    setTimeout(()=> {
      setMessage(null);
    }, 3000);
  };

  return (
    <>
      {message &&
        <p className="px-4 py-1 absolute top-2 right-2 rounded-xl bg-red-500 flex">{message }</p>
      }
      {showUnlistReasons &&
        <UnlistProduct isOpen={showUnlistReasons} toggleUnlistReasons={toggleUnlistReasons} itemToUnlist={itemToUnlist} updateMessage={updateMessage} />
      }
      <div className={`flex-1 flex flex-col bg-black p-2 md:p-4 ${(showUnlistReasons || newProduct) && "overflow-hidden"}`}>
        <h1 className="text-4xl text-center">All listed products</h1>
        <div className="grid grid-cols-12 p-2 md:p-5 bg-black gap-2 overflow-y-scroll no-scrollbar relative">
        {items.map((item) => (
          <div key={item.id} className="col-span-12 lg:col-span-3 bg-zinc-900 rounded-xl p-2 flex flex-col justify-between">
            { item?.image
              ? <div className="w-full aspect-video object-cover bg-zinc-800 rounded-xl overflow-hidden flex justify-center">
                  <Image
                    src={item.image} alt={item.name}
                    width={240} height={120}
                    style={{objectFit: 'contain', width: '100%', height: '100%'}}
                  />
                </div>
              : <div className="w-full aspect-video object-contain bg-black rounded-xl flex justify-center items-center"><span>No Image</span></div>
            }
            <div className="p-5">
              <span className="text-xs text-pink-500">{item.cateName}</span>
              <h1 className="text-2xl">{item.name}</h1>
              <h1 className="text-2xl text-green-800">&#8377;{Number(item.price)}</h1>
            </div>
            <div className="text-2xl w-full flex justify-between gap-1 pt-2">
              <button className="border-2 border-red-500 bg-red-500/20 hover:bg-red-500 rounded-l-xl flex-1 py-1 transition-colors duration-300" onClick={() => toggleUnlistReasons(item)}>Unlist</button>
              <button className="border-2 border-blue-500 bg-blue-500/20 hover:bg-blue-500 rounded-r-xl flex-1 py-1 transition-colors duration-300" onClick={() => editItem(item)}>Edit</button>
            </div>
          </div>
        ))}
        </div>
      </div>
    </>
  );
}

export default SellerProducts;