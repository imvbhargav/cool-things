import { useLoginStore, useUserAuthStore } from "@/store/auth";
import { useConfirmModalStore, usePaymenyModalStore, useReviewModalStore } from "@/store/modal";
import { useOrderTypeStore } from "@/store/order";
import { OrderItem, OrderStatus, Product } from "@prisma/client";

type OrderItemExtended = OrderItem & {
  product: Product;
}

function OrderButton({ status, order }: Readonly<{ status: OrderStatus, order: OrderItemExtended }>){

  const user = useUserAuthStore(state => state.user);
  const setOrderType = useOrderTypeStore(state => state.setType);
  const toggleLoginRequired = useLoginStore((state) => state.toggleLoginRequired);
  const togglePaymentModal = usePaymenyModalStore((state) => state.togglePaymentModal);
  const { setShowConfirm } = useConfirmModalStore();
  const { setShowReview } = useReviewModalStore();

  const buyItem = () => {
    if (order) {
      if (user?.id) {
        setOrderType(order.product, 'buy');
        togglePaymentModal();
      } else {
        toggleLoginRequired();
      }
    }
  }

  if (['PENDING', 'PROCESSING', 'SHIPPED'].includes(status)) {
    return (
      <button
        className="p-2 bg-red-700 hover:bg-red-900 text-white w-full flex-1"
        onClick={() => {setShowConfirm(true, order)}}
      >
        Cancel
      </button>
    );
  } else if (status == 'DELIVERED') {
    return (
      <>
        <button
          className="p-2 bg-green-700 hover:bg-green-900 text-white w-full flex-1"
          onClick={() => { buyItem() }}
        >
          Re-order
        </button>
        <button
          className="p-2 bg-blue-700 hover:bg-blue-900 text-white w-full flex-1"
          onClick={() => {setShowReview(true, order.product)}}
        >Review</button>
      </>
    );
  } else if (status == 'CANCELLED') {
    return (
      <button
        className="p-2 bg-green-700 hover:bg-green-900 text-white w-full flex-1"
        onClick={() => { buyItem() }}
      >
        Re-order
      </button>
    );
  }
}

export default OrderButton;