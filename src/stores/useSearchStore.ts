import {create} from "zustand";

export interface SearchStore {
  search: string;
  setSearch: (search: string) => void;
}

export const useSearchStore = create<SearchStore>((set, get) => ({
  search: "",
  setSearch: (search: string) => set({search}),
}));