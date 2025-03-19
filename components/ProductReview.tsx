import Modal from "./ModalLayout";

function ProductReview() {
  return (
    <Modal isOpen={false} title="Product Review" onClose={() => {}}  >
      <h2>Leave a review</h2>
      <input placeholder="Enter your review..." />
    </Modal>
  );
}

export default ProductReview;