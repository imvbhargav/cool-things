"use client";

import { signIn } from 'next-auth/react';
import { useLoginStore, useUserAuthStore } from "@/store/auth";
import { useRef } from 'react';
import Modal from './ModalLayout';
import Image from 'next/image';

export default function Login() {
  const loginRequired = useLoginStore(state => state.loginRequired);
  const toggleLogin = useLoginStore(state => state.toggleLoginRequired);
  const user = useUserAuthStore(state => state.user);

  const loginButtonRef = useRef<HTMLButtonElement>(null);

  const handleLogin = () => {
    signIn('google', {
      callbackUrl: window.location.href
    });
  };

  if (!loginRequired || user != null) return null;

  return (
    <Modal isOpen={loginRequired} onClose={toggleLogin} title="Login">
      <div className='flex flex-col items-center gap-4'>
        <h2 className='text-2xl text-center'>
          Welcome to CoolThings, a store on the internet where you can find the coolest things available on the web.
          Login to access Cart, Orders and Buy some CoolThings.
        </h2>
        <button
          ref={loginButtonRef}
          className='bg-sky-300 hover:bg-blue-400 text-zinc-900 p-4 rounded-xl text-xl flex gap-2 justify-center items-center scale-90 hover:scale-100 transition-all duration-150'
          onClick={handleLogin}
        >
          <Image
            width={25} height={25}
            src={"./google.svg"} alt='Google'
          />
          <span>Login with Google</span>
        </button>
      </div>
    </Modal>
  );
}