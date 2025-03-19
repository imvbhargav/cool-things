"use client";

import ProfileButton from './ProfileButton';
import LoginButton from './LoginButton';
import { useUserAuthStore } from '@/store/auth';

function SideBarAuthButton() {

  const user = useUserAuthStore(state => state.user);

  return (
    <>
      {user == null
        ? <LoginButton showText={true} />
        : <ProfileButton showText={true} />
      }
    </>
  );
}

export default SideBarAuthButton;