"use client";

import Image from "next/image";
import CartLengthNumber from "./CartLengthNumber";

function ListItem({icon, title, to, active = false}: Readonly<{icon: string, title: string, to: string, active: boolean}>) {

  return (
    <li className={`text-2xl mb-4 flex gap-6 items-center hover:bg-zinc-800 rounded-xl transition-all duration-300 ${active ? 'bg-slate-800 hover:bg-slate-800 pointer-events-none' : 'bg-transparent'}`}>
      <a href={to} className="relative flex gap-6 items-center w-full pl-2 p-4">
        <Image src={icon} alt={title} width={35} height={35} />
        { (title.toLowerCase() == 'cart') && <CartLengthNumber /> }
        <p className="pl-1">{title}</p>
      </a>
    </li>
  );
}

export default ListItem;