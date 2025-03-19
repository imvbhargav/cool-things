"use client";

import { useCartLengthStore } from "@/store/cart";
import NavBarAuthButton from "./NavBarAuthButton";
import Link from "next/link";
import Image from "next/image";

function Navbar({ active }: Readonly<{ active: string }>) {

  const cartlength = useCartLengthStore(state => state.length);

  return (
    <div className="sm:hidden w-full h-[100dvh] absolute flex flex-col gap-1 justify-center items-center z-50 pointer-events-none">
      <div className="flex items-center absolute bottom-0 w-full justify-between border-2 border-zinc-800 rounded-t-xl bg-zinc-800 pointer-events-auto px-2">
        <ul className="w-full list-none flex gap-2 items-center justify-between">
          <li className={`${active == "home" ? "bg-slate-700" : ""} p-2 rounded-xl w-[50px] flex-1`}>
            <div className="flex flex-col items-center">
              <Link
                href="/"><Image src={"/home.png"} alt="home" width={25} height={25}
                style={{width: '25px', height: '25px'}}
              />Home</Link>
            </div>
          </li>
          <li className={`${active == "cart" ? "bg-slate-700" : ""} p-2 rounded-xl w-[50px] relative flex-1`}>
            <a className="flex flex-col items-center" href="/cart">
            <Image src={"/cart.png"} alt="cart" width={25} height={25} />Cart{(cartlength??0) > 0 && <span className="text-green-500 absolute top-0 right-0 bg-black rounded-full px-2">{cartlength}</span>}
            </a>
          </li>
          <li className={`${active == "orders" ? "bg-slate-700" : ""} p-2 rounded-xl w-[50px] flex-1`}><a className="flex flex-col items-center" href="/orders"><Image src={"/orders.png"} alt="orders" width={25} height={25} />Orders</a></li>
          <li className=" flex-1"><NavBarAuthButton /></li>
        </ul>
      </div>
    </div>
  );
}

export default Navbar;