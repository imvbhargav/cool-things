"use client";

import { useCartInteraction, useCartStore, useCartTotalStore } from "@/store/cart";
import { useCallback, useEffect, useState } from "react";
//import ClosePopUpButton from "./ClosePopUpButton";
import { CartItem, Product } from "@prisma/client";
import Image from "next/image";

type CartItemExtended = CartItem & {
  product: Product;
}

export default function CartCard({cartItem}: Readonly<{cartItem: CartItemExtended}>) {

  const setTotal = useCartTotalStore(state => state.setTotal);
  const cartInteraction = useCartInteraction(state => state.paused);

  const [ quantity, setQuantity ] = useState<number>(cartItem.quantity);
  const [ subTotal, setSubTotal ] = useState<number>(0);

  const calculateSubTotal = useCallback(() => {
    if (!cartItem.product) return 0;
    const newSubTotal = parseFloat((quantity * (cartItem.product?.price??cartItem.price)).toFixed(2));
    const offerSubTotal = quantity >= (cartItem.product?.minQty??10)
                          ? parseFloat((newSubTotal - newSubTotal * ((cartItem.product?.offer??0)/100)).toFixed(2))
                          : newSubTotal;
    return offerSubTotal;
  }, [cartItem.product, cartItem.price, quantity])


  const { addItem, removeItem } = useCartStore();

  useEffect(() => {
    const newSubTotal = calculateSubTotal();
    setSubTotal(newSubTotal);
  }, [quantity, calculateSubTotal]);

  useEffect(() => {
    setTotal(subTotal, 'add');
  }, [subTotal, setTotal]);

  const addQuantity = () => {
    if (cartItem.product && quantity < cartItem.product.stock) {
      addItem(cartItem.product);
      setTotal(subTotal, 'sub');
      setQuantity(prevQuantity => prevQuantity + 1);
    }
  }

  const removeCartItem = () => {
    if (cartItem.product && quantity <= 1) {
      removeItem(cartItem, true);
    } else {
      removeItem(cartItem, false);
      setQuantity(prevQuantity => prevQuantity - 1);
    }
    setTotal(subTotal, 'sub');
  }

  return (
    <>
    { cartItem
      ?
      <div className="flex flex-col md:flex-row bg-slate-800 rounded-md p-2 mb-4 relative border-2 border-zinc-600">
        <div className="w-full max-w-72 min-w-40 rounded-xl aspect-video flex-1 object-contain bg-zinc-800 overflow-hidden flex justify-center">
          { cartItem.product.image &&
            <Image
              src={cartItem.product.image}
              alt={cartItem.product.name}
              width={240}
              height={120}
              style={{objectFit: "contain", width: '100%', height: '100%'}}
            />
          }
        </div>
        <div className="min-w-[240px] p-0 mt-4 md:mt-0 md:pl-4 flex-1 flex flex-col justify-between">
          <div className="pl-2 mb-2">
            <h2 className="text-xl md:text-3xl"><a className="hover:text-blue-500" href={`/product/${cartItem.product.id}`}>{cartItem.product?.name}</a></h2>
            <p><span className="text-pink-500">Offer on product:</span> {cartItem.product?.offer ? `${cartItem.product.offer}% off` : "No offers on this product"}</p>
            <p><span className="text-blue-500">Min. Qty for offer:</span> {cartItem.product?.minQty}</p>
          </div>
          <div className="sm:text-2xl bg-slate-950 p-2 rounded-md flex flex-wrap gap-2">
            <span>&#8377;{cartItem.price}</span>
            <span>*</span>
            <div className="flex gap-2 bg-zinc-800 rounded-md border-2 border-zinc-600 overflow-hidden">
              <button
                onClick={removeCartItem}
                className="px-2 bg-slate-600 text-red-500 rounded-sm disabled:bg-black text-sm font-black"
                disabled={cartInteraction}
              >
                &darr;
              </button>{quantity}
              <button
                onClick={addQuantity}
                className="px-2 bg-slate-600 text-green-500 rounded-sm disabled:bg-black text-sm font-black"
                disabled={cartInteraction}
              >
                &uarr;
              </button>
            </div>
            <div className="text-green-600 flex flex-wrap">
                <p className="px-1">= &#8377;{parseFloat((quantity * cartItem.product.price).toFixed(2))}</p>
                {quantity >= cartItem.product.minQty
                  ?
                  <p className="text-pink-500 px-1">
                    {" -"} &#8377;{parseFloat(((quantity * cartItem.product.price) - subTotal).toFixed(2))} {" "}
                  </p>
                  :
                  <></>
                }
                <p className="px-1">= &#8377;{subTotal}</p>
            </div>
          </div>
        </div>
      </div>
      :
      <></>
    }
    </>
  );
}