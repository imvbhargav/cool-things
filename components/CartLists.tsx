"use client";

import { useCartStore, useCartTotalStore } from "@/store/cart";
import CartCard from "./CartCard";
import { usePaymenyModalStore } from "@/store/modal";
import { useOrderTypeStore } from "@/store/order";


function CartList() {

  const { total, clearTotal } = useCartTotalStore();
  const cart = useCartStore((state) => (state.items));
  const clearCart = useCartStore(state => state.clearCart);
  const setOrderType = useOrderTypeStore(state => state.setType);
  const togglePaymentModal = usePaymenyModalStore(state => state.togglePaymentModal);

  const clearFullCart = () => {
    clearTotal();
    if ((cart??[]).length != 0) clearCart();
  }

  const cartCheckout = () => {
    setOrderType(null, 'checkout');
    togglePaymentModal();
  }

  return (
    <div className="absolute right-0 bg-zinc-900 p-2 sm:pl-32 h-[100dvh] rounded-r-xl overflow-y-scroll no-scrollbar w-full pb-14 sm:pb-0 sm:pr-12">
      <button onClick={clearFullCart} disabled={cart == null || cart.length < 1} className="py-2 px-4 bg-red-800 rounded-xl hover:bg-red-600 disabled:bg-zinc-800">Clear Cart</button>
      <h1 className="text-4xl text-center py-5">Your cart is waiting for your attention!</h1>
      <div className="bg-zinc-800 p-5 flex flex-wrap gap-4 rounded-xl mb-5">
        <div className="flex-1 relative">
          {cart &&
            <>
            {cart.map((item) => (
              <CartCard key={item.id} cartItem={item} />
            ))}
            </>
          }
        </div>
        <div className="md:max-w-[360px] min-w-[240px] max-h-[280px] flex-1 rounded-md bg-slate-950 p-5 flex flex-col justify-between">
          <div>
            <p className="text-md sm:text-2xl flex justify-between text-right">Cart Value: <span className="text-green-600">&#8377;{parseFloat(total.toFixed(2))}</span></p>
            <p className="text-md sm:text-2xl flex justify-between text-right">Offer Discount: <span className="text-pink-500">- &#8377;{0}</span></p>
          </div>
          <div>
            <hr/>
            <p className="text-md sm:text-2xl flex justify-between text-right">Total: <span className="text-green-500">&#8377;{parseFloat(total.toFixed(2))}</span></p>
            <div className="mt-2 rounded-lg overflow-hidden text-xl">
              {cart &&
                <button
                className="bg-green-600 w-full py-2 sm:p-4 hover:bg-green-800 disabled:bg-zinc-900"
                type="button"
                disabled={cart.length < 1}
                onClick={() =>{
                  cartCheckout()}
                }>Checkout</button>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartList;