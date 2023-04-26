import {create} from "zustand";
import {createJSONStorage, persist} from "zustand/middleware";

export interface AuthStore {
  token?: string | null;
  isLoggedIn: () => boolean;
  setToken: (token: string | null) => void;
  logOut: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      token: null,
      isLoggedIn: () => get()?.token != null,
      setToken: (token) => set({token}),
      logOut: () => set({token: null}),
    }),
    {
      name: "auth-store",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({token: state.token}),
    }
  )
);