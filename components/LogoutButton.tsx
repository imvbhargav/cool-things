import { signOut } from "next-auth/react";

function Logout() {
  return (
    <button
      className="px-4 py-2 w-full"
      onClick={() => signOut()}
    >
      Logout
    </button>
  );
}

export default Logout;