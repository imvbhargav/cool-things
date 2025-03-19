"use client";

import { useCallback, useEffect, useState } from "react";
import Modal from "./ModalLayout";
import { useReviewModalStore } from "@/store/modal";

function ReviewModal() {

  const starLength = Array.from({length: 5}, (_, i) => i + 1);

  const [ rate, setRate ] = useState(1);
  const [ hover, setHover ] = useState(0);
  const [ review, setReview ] = useState("");
  const [ loading, setLoading ] = useState(false);

  const { showReview, itemToReview, setShowReview } = useReviewModalStore();

  const handleSubmit = async () => {
    const response = await fetch('api/order/rating/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        productId: itemToReview?.id,
        rating: rate,
        review
      })
    });

    if (!response.ok) {
      console.log("Some error occured while adding review");
      return;
    }

    await response.json();
  }

  const getReview = useCallback(async () => {
    const response = await fetch(`api/order/rating/get/${itemToReview?.id}`);
    if (!response.ok) {
      console.log("Some error occured while fetching review");
      return;
    }

    const data = await response.json();
    setRate(data?.data?.rating??1);
    setReview(data?.data?.content??"");
    setLoading(false);
  }, [setRate, setReview, setLoading, itemToReview?.id])

  useEffect(() => {
    setRate(1);
    setReview("");
    setLoading(true);
    if (!itemToReview) return;
    getReview();
  }, [itemToReview, getReview, setRate, setReview]);

  const handleClose = useCallback(() => {
    setShowReview(false, null)
  }, [setShowReview]);

  return (
    <Modal key={itemToReview?.id} isOpen={showReview} onClose={handleClose} title={"Leave a review"}>
      <div className="flex flex-col text-center">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="w-full md:w-auto text-blue-600 md:bg-zinc-800 p-2 rounded-md md:border border-zinc-600">{ itemToReview?.name }</p>
          <div className="text-center p-2">
            { starLength.map((i) => (
              <button
                key={i}
                onClick={() => setRate(i)}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(0)}
                disabled={loading}
                className="disabled:opacity-20"
              >
                <svg
                  viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"
                  stroke="white" strokeWidth="2"
                  fill={i <= rate ? 'oklch(0.666 0.179 58.318)' : 'transparent'}
                  className={`w-10 h-10 md:w-9 md:h-9 ${(i <= hover && i > rate) ? 'fill-amber-600/25' : ""}`}
                >
                  <polygon points="50,5 61,35 95,35 67,55 78,85 50,65 22,85 33,55 5,35 39,35" />
                </svg>
              </button>
            ))
            }
          </div>
        </div>
        <textarea
        className="resize-none bg-black text-white p-2 rounded-md outline-none border border-zinc-600"
        rows={10} placeholder={loading ? "Loading previous review..." :"Enter review here..."} value={loading ? "" : review} onChange={(e) => setReview(e.target.value)} disabled={loading} autoComplete="off"></textarea>
      </div>
      <div className="flex justify-end mt-2">
        <button
          className="bg-black border border-slate-600 hover:bg-slate-600 px-6 py-2 rounded-md"
            onClick={() => handleSubmit()}
        >Submit</button>
      </div>
    </Modal>
  );
}

export default ReviewModal;