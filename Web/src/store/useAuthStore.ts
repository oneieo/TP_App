import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "firebase/auth";

interface AuthState {
  isLoggedIn: boolean;
  affiliation: string | null;
  firebaseUser: User | null;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  setAffiliation: (affiliation: string) => void;
  setFirebaseUser: (user: User | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      affiliation: null,
      firebaseUser: null,
      setIsLoggedIn: (isLoggedIn) => set({ isLoggedIn }),
      setAffiliation: (affiliation) => set({ affiliation }),
      setFirebaseUser: (user) => set({ firebaseUser: user }),
      logout: () =>
        set({
          isLoggedIn: false,
          affiliation: null,
          firebaseUser: null,
        }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        isLoggedIn: state.isLoggedIn,
        affiliation: state.affiliation,
      }),
    }
  )
);
