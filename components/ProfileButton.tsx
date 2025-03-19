"use client";

import { useLoginStore, useUserAuthStore } from "@/store/auth";
import { useModalTransitionShow } from "@/store/modal";
import Image from "next/image";

function truncateString(str: string, maxLength: number) {
  if (str.length > maxLength) {
    return str.slice(0, maxLength) + '...';
  }
  return str;
}

function ProfileButton({showText = true}: Readonly<{showText?: boolean}>) {

  const { setShow } = useModalTransitionShow();
  const { loginRequired, toggleLoginRequired: toggleLogin } = useLoginStore();
  const user = useUserAuthStore(state => state.user);

  const handleClose = () => {
    if (!loginRequired) {
      toggleLogin()
      return;
    };
    setShow(false);
    setTimeout(() => {
      setShow(true);
      toggleLogin();
    }, 200);
  }

  return (
    <button className={`transition-all duration-300  hover:bg-blue-200 text-blue-600 rounded-xl flex items-center w-full ${showText ? "text-2xl pl-2 p-4 gap-6" : "flex-col items-center w-[50px] p-2"}`} onClick={() => handleClose()} disabled={user == null}>
      <Image
        src={user?.image??"/profile.png"} alt="Profile"
        width={showText ? 35 : 25} height={showText ? 35 : 25}
        style={{borderRadius: '100%'}}
      />
      <span className={`pl-1 ${showText ? "text-md" : "text-base"}`}>{showText ? truncateString(user?.username??"User", 15) : "Profile"}</span>
    </button>
  );
}

export default ProfileButton;