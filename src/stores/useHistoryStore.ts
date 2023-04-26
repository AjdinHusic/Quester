import {create} from "zustand";
import {createJSONStorage, persist} from "zustand/middleware";

export interface UseHistoryStore {
  history: string[];
  addHistoryItem: (item: string) => void;
  clear: () => void;
}

export const useHistoryStore = create<UseHistoryStore>()(
  persist(
    (set, get) => ({
      history: [],
      addHistoryItem: (item: string) => set({history: [...get().history, item]}),
      clear: () => set({history: []})
    }),
    {
      name: "history-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({token: state.history}),
    }
  )
);