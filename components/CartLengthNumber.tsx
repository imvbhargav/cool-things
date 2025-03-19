import { useCartLengthStore } from "@/store/cart";

function CartLengthNumber() {

  const cartLength = useCartLengthStore(state => state.length)??0;
  return (
    <>
    { cartLength > 0 &&
      <p className="absolute top-0 left-0 bg-slate-950 px-2 text-green-500 font-black rounded-full text-base ">
        { cartLength }
      </p>
    }
    </>
  );
}

export default CartLengthNumber;