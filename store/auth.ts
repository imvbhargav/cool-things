import { UserRole } from "@prisma/client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type LoginRequired = {
  loginRequired: boolean;
  toggleLoginRequired: () => void;
}

type Auth = {
  isLoggedIn: boolean;
  toggleLoggedIn: () => void;
}

const useLoginStore = create<LoginRequired>()((set) => ({
  loginRequired: false,
  toggleLoginRequired: () => set((state) => ({ loginRequired: !state.loginRequired })),
}));

const useAuthStore = create<Auth>()((set) => ({
  isLoggedIn: false,
  toggleLoggedIn: () => set((state) => ({ isLoggedIn: !state.isLoggedIn })),
}))

export type User = {
  id: string;
  name: string;
  email: string;
  image: string;
  username?: string;
  address: string;
  role: UserRole;
}

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
}

const useUserAuthStore = create(
  persist<AuthState>(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
    }),
    {
      name: "user-session",
    }
  )
);


export { useLoginStore, useAuthStore, useUserAuthStore };