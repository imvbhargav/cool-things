"use client"

import { useLoginStore, useUserAuthStore } from "@/store/auth";
import { useCartStore } from "@/store/cart";
import { usePaymenyModalStore } from "@/store/modal";
import { useOrderTypeStore } from "@/store/order";
import { ButtonTypes } from "@/types/button";
import { Product } from "@prisma/client";

type CtaProps = {
  type: keyof ButtonTypes;
  item?: Product | null;
  disabled?: boolean;
}

function CtaButton({type, disabled = false, item = null}: Readonly<CtaProps>) {

  const cartItems = useCartStore((state) => state.items);

  const user = useUserAuthStore(state => state.user);
  const addItem = useCartStore((state) => state.addItem);
  const setOrderType = useOrderTypeStore(state => state.setType);
  const toggleLoginRequired = useLoginStore((state) => state.toggleLoginRequired);
  const togglePaymentModal = usePaymenyModalStore((state) => state.togglePaymentModal);

  const isItemInCart = () => {
    if (item) {
      if (type == "addToCart" && "id" in item) {
        return (cartItems??[]).find(i => i.productId === item.id ) !== undefined;
      }
    }
  }

  const addToCart = (item: Product) => {
    if (user) {
      addItem(item);
    }
    else {
      toggleLoginRequired();

    }
  }

  const buyItem = () => {
    if (item) {
      if (user?.id) {
        setOrderType(item, 'buy');
        togglePaymentModal();
      } else {
        toggleLoginRequired();
      }
    }
  }

  const buttonType: ButtonTypes = {
    addToCart: {
      color: "bg-indigo-800/40 hover:bg-indigo-600",
      text: isItemInCart() ? "In cart (+1)" : "Add to cart",
      action: addToCart,
    },
    buy: {
      color: "bg-green-800/40 hover:bg-green-600",
      text: "Buy",
      action: buyItem,
    }
  }

  return (
    <button className={`p-4 ${buttonType[type].color} w-full disabled:bg-zinc-800`} type="button" disabled={disabled}
    onClick={buttonType[type].action && item ? () => buttonType[type].action!(item) : undefined}
    >
      {buttonType[type].text}
    </button>
  );
}

export default CtaButton;