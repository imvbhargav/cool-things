"use client";

import { useUserAuthStore } from "@/store/auth";
import LoginButton from "./LoginButton";
import ProfileButton from "./ProfileButton";

function NavBarAuthButton() {

  const user = useUserAuthStore(state => state.user);

  return (
    <>
    { user == null
      ?
      <LoginButton showText={false} />
      :
      <ProfileButton showText={false} />
    }
    </>
  );
}

export default NavBarAuthButton;