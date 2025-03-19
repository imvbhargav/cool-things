"use client";

import { useLoginStore, useUserAuthStore } from "@/store/auth";
import Image from "next/image";

function LoginButton({showText = true}: Readonly<{showText?: boolean}>) {

  const toggleLogin = useLoginStore(state => state.toggleLoginRequired);
  const user = useUserAuthStore(state => state.user);

  return (
    <button onClick={toggleLogin} className={`transition-all duration-300  hover:bg-green-200 text-green-600 rounded-xl flex items-center w-full ${showText ? "text-2xl pl-2 p-4 gap-6" : "flex-col items-center w-[50px] p-2"}`} disabled={user != null}>
      <Image src="/login.png" alt="Logout" width={showText ? 35 : 25} height={showText ? 35 : 25} />
      <span className={`pl-1 ${showText ? "text-md" : "text-sm"}`}>Login</span>
    </button>
  );
}

export default LoginButton;