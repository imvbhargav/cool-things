"use client";

import { useLoginStore, useUserAuthStore } from "@/store/auth";
import Logout from "./LogoutButton";
import Modal from "./ModalLayout";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

function isBlank(str: string) {
  return !str.trim().length;
}

function Profile() {

  const updateButtonRef = useRef<HTMLButtonElement | null>(null);
  const infoRef = useRef<HTMLSpanElement>(null);
  const errorRef = useRef<HTMLSpanElement>(null);

  const loginRequired = useLoginStore(state => state.loginRequired);
  const toggleLoginRequired = useLoginStore(state => state.toggleLoginRequired);
  const { user, setUser } = useUserAuthStore();

  const [ userEdited, setUserEdited ] = useState({ id: user?.id, name: user?.name, address: user?.address, role: user?.role });

  useEffect(() => {
    setUserEdited({ id: user?.id, name: user?.name, address: user?.address, role: user?.role });
  }, [user, loginRequired]);

  // Helper function to set the error message.
  const setErrorMessage = (message: string) => {
    if (errorRef.current) {
      errorRef.current.innerText = message;
      setTimeout(() => {
        if (errorRef.current) {
          errorRef.current.innerText = "";
        }
      }, 5000);
    }
  }

  // Helper to toggle the update button.
  const toggleUpdateButton = (disable: boolean, text: string) => {
    if (updateButtonRef.current) {
      updateButtonRef.current.innerText = text;
      updateButtonRef.current.disabled = disable;
    }
  }

  // Validate if the details are valid.
  const invalidDetails = () => {

    // Validate if the name is blank.
    if (isBlank(userEdited?.name??"")) {
      setErrorMessage("Name can not be blank!");
      return true;
    }

    // Validate if the address is blank.
    if (isBlank(userEdited?.address??"") || userEdited?.address == 'TBA') {
      setErrorMessage("Address can not be blank!");
      return true;
    }

    // Validate if the name is same as current name.
    if (userEdited?.name == user?.name && userEdited?.address == user?.address) {
      setErrorMessage("Name and address both can not be same as current name and address!");
      return true;
    }

    return false;
  }

  // Handle user information change update.
  const handleSubmit = async () => {

    // Disable the update button with text showing process.
    toggleUpdateButton(true, "Updating...");

    // Validate name and address.
    if (invalidDetails()) {
      toggleUpdateButton(false, "Update");
      return;
    }

    // Send the POST request to the server to update the user information.
    const data = await fetch("/api/user/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: userEdited?.id,
        name: userEdited?.name,
        address: userEdited?.address,
        role: userEdited?.role,
      }),
    });

    // If server responds with some error
    if (!data.ok) {

      // Get the message sent by the server.
      const error = (await data.json()).message;

      // Enable the update button.
      toggleUpdateButton(false, "Update");

      // Show error for 5 seconds.
      setErrorMessage(error);

      return;
    }

    // Get the updated session.
    const sessionData = await fetch("/api/auth/session", { method: "GET" });
    const session = (await sessionData.json());

    // Set the updated session for the user store.
    setUser(session.user);

    // Disabled the button to increase a little friction.
    toggleUpdateButton(true, "Update");

    // Show the success message for 5 seconds.
    if (infoRef.current) {
      infoRef.current.innerText = "User information updated succesfully!";
      setTimeout(() => {
        if (infoRef.current)
          infoRef.current.innerText = "";
      }, 5000);
    }
  };

  return (
    <>
    { loginRequired && user != null
      ?
      <Modal isOpen={loginRequired} onClose={toggleLoginRequired} title="User Profile" width="sm:w-auto">
        <div className="flex flex-wrap gap-4 items-center bg-slate-900 p-2 sm:p-4 rounded-t-xl">
          <div className="rounded-full h-10 w-10 sm:h-14 sm:w-14 border-2 border-zinc-200 overflow-hidden">
            <Image
              src={user?.image??'/profile.png'}
              alt="Profile"
              width={35}
              height={35}
              style={{width: '100%', height: '100%', objectFit: 'contain', borderRadius: '100%'}}
            />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl">{user?.username}</h2>
            <p className="text-gray-400">{user?.email}</p>
          </div>
        </div>
        <div className="border-t-2 border-zinc-600 flex justify-between items-center sm:text-xl gap-4 bg-slate-950 p-4 ">
          <label htmlFor="name" className="w-20">Name</label>
          <div>
            <input
              className="bg-zinc-800 px-4 py-1 text-white w-full rounded-md focus:outline-none focus:border-none"
              autoComplete="off" id="name" value={userEdited.name??""} placeholder="Enter your name"
              onChange={(e) => {setUserEdited({...userEdited, name: e.target.value})}}
            />
          </div>
        </div>
        <div className="flex justify-between items-center sm:text-xl gap-4 bg-slate-950 p-4 pt-0">
          <label htmlFor="address" className="w-20">Address</label>
          <div>
            <input
              className="bg-zinc-800 px-4 py-1 text-white w-full rounded-md focus:outline-none focus:border-none" autoComplete="off" id="address" value={userEdited.address??""} placeholder="Enter your name" onChange={(e) => {setUserEdited({...userEdited, address: e.target.value})}}
            />
          </div>
        </div>
        <div className="bg-slate-950 rounded-b-xl p-4 flex justify-between gap-2 relative overflow-hidden">
          <span
            ref={infoRef}
            className="absolute left-0 bottom-0 bg-green-500 text-center text-sm sm:text-base w-full"
          ></span>
          <span
            ref={errorRef}
            className="absolute left-0 bottom-0 bg-red-500 text-center text-sm sm:text-base w-full"
          ></span>
          {user.role == 'SELLER' ?
            <a href="/seller"
              className="bg-blue-500 hover:bg-blue-800 py-1 px-4 sm:py-2 sm:px-8 rounded-lg disabled:bg-black border-2 border-blue-500 disabled:border-zinc-600 w-2/3 flex-1 text-center"
            >
              Dashboard
            </a>
          :
            <div className="flex items-center gap-2">
              <input
                type="checkbox" id="sellerchk" checked={userEdited.role == 'SELLER'}
                onChange={(e) => {
                  setUserEdited({...userEdited, role: e.target.checked ? 'SELLER' : 'USER'})
                }}
              />
              <label htmlFor="sellerchk">Become Seller?</label>
            </div>
          }
          <button
            className="bg-green-500 hover:bg-green-800 py-1 px-4 sm:py-2 sm:px-8 rounded-lg disabled:bg-black border-2 border-green-500 disabled:border-zinc-600 w-1/3 flex-1"
            onClick={() => handleSubmit()}
            ref={updateButtonRef}
          >
            Update
          </button>
        </div>
        <div className="flex items-center bg-red-800/50 justify-between rounded-xl p-2 text-center relative mt-4">
          <div className="hover:bg-red-800 bg-red-600 rounded-xl w-full flex-1">
            <Logout />
          </div>
        </div>
      </Modal>
      :
      <></>
    }
    </>
  );
}

export default Profile;