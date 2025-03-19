"use client";

import { useConfirmModalStore, useModalTransitionShow } from "@/store/modal";
import { useOrderStore } from "@/store/order";
import Modal from "./ModalLayout";

function formatDate(date: Date) {
  const formattedDate = new Intl.DateTimeFormat('en-GB', {
    weekday: 'short', // Short weekday (e.g., Tue)
    day: '2-digit',   // Day as 2 digits (e.g., 28)
    month: 'short',   // Short month name (e.g., Jan)
    year: 'numeric',  // Full year (e.g., 2025)
    timeZone: 'UTC',  // Ensure UTC is used
  }).format(date);

  return formattedDate;
}

function ConfirmModal({title}: Readonly<{title: string }>) {

  const { showConfirm, itemToCancel: order, setShowConfirm } = useConfirmModalStore();
  const { setShow } = useModalTransitionShow();
  const cancelOrder = useOrderStore(state => state.cancelOrder);

  const handleClose = () => {
    setShow(false);
    setTimeout(() => {
      setShow(true);
      setShowConfirm(false);
    }, 200);
  }

  const handleCancel = () => {
    if (order?.id) cancelOrder(order?.id);
    handleClose();
  }

  return (
    <Modal title={title} isOpen={showConfirm} onClose={() => {setShowConfirm(false)}} >
      <div className="text-center">
        <p>Are you sure you want to cancel?</p>
        <p>
          <span className="text-blue-600">{order?.product.name} </span>
          <span> ordered on </span>
          <span className="text-pink-600"> {order?.createdAt ? formatDate(order.createdAt) : ""}</span>
        </p>
        <button
          className="bg-red-600 rounded-md px-4 py-2 hover:bg-red-800 mt-4"
          onClick={() => {handleCancel()}}
        >Yes</button>
        <button
          className="bg-green-600 rounded-md px-4 py-2 hover:bg-green-800 mt-4 ml-2"
          onClick={() => {handleClose()}}
        >No</button>
      </div>
    </Modal>
  );
}

export default ConfirmModal;