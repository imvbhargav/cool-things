"use client";

import { useEffect, useState } from "react";
import Modal from "./ModalLayout";
import { useCartStore, useCartTotalStore } from "@/store/cart";
import { usePaymenyModalStore } from "@/store/modal";
import { useLoginStore, useUserAuthStore } from "@/store/auth";
import { useOrderStore, useOrderTypeStore } from "@/store/order";
import Image from "next/image";

function AcceptPayment() {

  const [ processing, setProcessing ] = useState(false);
  const [ quantity, setQuantity ] = useState(1);

  const { isPaymentModalOpen, togglePaymentModal } = usePaymenyModalStore();
  const toggleLoginRequired = useLoginStore(state => state.toggleLoginRequired);
  const addOrder = useOrderStore(state => state.addOrders);
  const orderType = useOrderTypeStore(state => state.order);
  const checkout = useCartStore(state => state.checkout);
  const user = useUserAuthStore(state => state.user);
  const total = useCartTotalStore(state => state.total);

  const offerApplicable = ((orderType?.item?.offer??0) > 0);
  const offerApplied =  (quantity >= (orderType.item?.minQty??0))
                        ? `Offer Applied (${orderType.item?.offer}% off)`
                        : `Order ${orderType.item?.minQty} and get ${orderType.item?.offer}% off`;

  const handleQuantity = (action: 'inc' | 'desc') => {
    if (action == 'inc') {
      if (quantity > 8) return;
      setQuantity(prev => prev + 1);
    } else if (action == 'desc') {
      if (quantity < 2) return;
      setQuantity(prev => prev - 1);
    }
  }

  const handleProfileClick = () => {
    togglePaymentModal();
    toggleLoginRequired();
  }

  const confirmPayment = () => {
    if (orderType.type == 'checkout') {
      checkout();
    } else if (orderType.type == 'buy' && orderType.item) {
      addOrder(orderType.item, quantity);
    }
    setProcessing(true);
  }

  const calculateDiscountedCost = () => {
    if (!orderType?.item) return 0;
    const totalCost = parseFloat((quantity * (orderType.item?.price??0)).toFixed(2));
    console.log(totalCost, (totalCost * (orderType.item.offer / 100)));
    const discountedCost =  quantity >= orderType.item.minQty
                            ? totalCost - (totalCost * (orderType.item.offer / 100))
                            : totalCost;

    return (parseFloat(discountedCost.toFixed(2)));
  }

  useEffect(() => {
    setQuantity(1);
  }, [isPaymentModalOpen]);

  return (
    <>
      { (isPaymentModalOpen && !['', ' ', 'TBA'].includes(user?.address??''))
        ?
        <Modal isOpen={isPaymentModalOpen} onClose={togglePaymentModal} title={"Checkout"} width={'sm:w-auto'}>
          <div className="p-4 bg-slate-900 mb-2 rounded-xl border-2 border-zinc-800">
              <p className="text-center">{processing ? 'Processing your order...' : 'Confirm your purchase'}</p>
              <div className="p-2 bg-zinc-950 rounded-xl flex flex-col items-center">
                <div className="w-full max-w-64 aspect-video overflow-hidden rounded-md object-contain flex justify-center bg-zinc-800 sm:min-w-60">
                  <Image
                    width={240} height={120}
                    src={orderType?.item?.image??"/cart.png"}
                    alt={""}
                    style={{objectFit: "contain", width: '100%', height: '100%'}}
                  />
                </div>
                {orderType.type == 'checkout'
                ?
                <div className="w-full py-2 flex justify-between">
                  <p>Cart checkout</p>
                  <p className="text-green-500 font-bold">&#8377;{parseFloat(total.toFixed(2))}</p>
                </div>
                :
                <div className="w-full max-w-60 py-2">
                  <p className="text-blue-500 font-bold pb-2">{orderType.item?.name}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2 bg-zinc-800 border-2 border-zinc-600 rounded-md">
                      <button
                        className="rounded-sm bg-slate-600 px-2 text-red-400 font-bold"
                        onClick={() => handleQuantity('desc')}
                      >&darr;</button>
                      <p className="font-bold">{ quantity }</p>
                      <button
                        className="rounded-sm bg-slate-600 px-2 text-green-400 font-bold"
                        onClick={() => handleQuantity('inc')}
                      >&uarr;</button>
                    </div>
                    <p className="text-green-500 font-bold">
                      &#8377;{calculateDiscountedCost()}
                    </p>
                  </div>
                  <p className="text-center text-sm bg-zinc-800 mt-2 rounded-md py-2">
                    { offerApplicable
                      ? offerApplied
                      : 'No offer available'
                    }
                  </p>
                </div>}
              </div>
              <div className="flex justify-center gap-2 mt-2">
                <button
                  className="bg-green-600 py-2 px-4 rounded-2xl hover:bg-green-800 disabled:bg-zinc-800"
                  onClick={() => confirmPayment()}
                  disabled={processing}
                >{orderType.item ? "Confirm Purchase" : "Confirm Checkout"}</button>
              </div>
          </div>
        </Modal>
        :
        <Modal isOpen={isPaymentModalOpen} onClose={togglePaymentModal} title={"Address not set"}>
          <p className="text-center text-red-500 text-2xl">Please set a valid address in your profile.</p>
          <div className="p-4 flex justify-center">
            <button
              className="px-8 py-2 bg-blue-500 hover:bg-blue-800 text-xl rounded-xl"
              onClick={handleProfileClick}
            >
              Go to profile
            </button>
          </div>
        </Modal>
      }
    </>
  );
}

export default AcceptPayment;