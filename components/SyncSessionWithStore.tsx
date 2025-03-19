"use client";

import { useEffect } from "react";
import { useUserAuthStore } from "@/store/auth";
import { Session } from "next-auth";
import { CartItem, Product } from "@prisma/client";
import { useCartLengthStore, useCartStore } from "@/store/cart";

type CartItemExtended = CartItem & {
  product: Product;
}

type SyncSessionWithStoreProps = {
  session: Session | null;
  userCart?: CartItemExtended[] | null;
};

function SyncSessionWithStore({ session, userCart = null }: Readonly<SyncSessionWithStoreProps>) {
  const setUser = useUserAuthStore((state) => state.setUser);
  const setCart = useCartStore((state) => state.setCart);
  const setCartLength = useCartLengthStore(state => state.setLength);

  useEffect(() => {
    if (session?.user) {
      setUser(session.user); // Update the store only when session.user is defined.
      setCartLength(userCart?.length??0);
      setCart(userCart??[]);
    } else {
      setUser(null);
    }
  }, [session?.user, userCart, setUser, setCartLength, setCart]);

  return null;
}

export default SyncSessionWithStore;