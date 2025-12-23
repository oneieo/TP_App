import { create } from "zustand";
import type { PartnerStore } from "../types/partnerStoreType";
interface PartnerStoreState {
  stores: PartnerStore[];
  selectedStore: PartnerStore | null;
  loading: boolean;
  error: string | null;

  setStores: (stores: PartnerStore[]) => void;
  setSelectedStore: (store: PartnerStore | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearStores: () => void;
}

export const usePartnerStore = create<PartnerStoreState>((set) => ({
  stores: [],
  selectedStore: null,
  loading: false,
  error: null,

  setStores: (stores) => set({ stores }),
  setSelectedStore: (store) => set({ selectedStore: store }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearStores: () =>
    set({
      stores: [],
      selectedStore: null,
      error: null,
    }),
}));
