import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface AuthState {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  logout: () => void;
  affiliation: string;
  setAffiliation: (value: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      affiliation: "",
      setIsLoggedIn: (value) => set({ isLoggedIn: value }),
      setAffiliation: (value) => set({ affiliation: value }),
      logout: () => set({ isLoggedIn: false }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
