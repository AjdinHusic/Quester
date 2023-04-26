import {create} from "zustand";
import Components from "../types/components";
import Server from "../types/server";

export interface ComponentStore {
  components: Components;
  servers: Server[];
  server: Server | null;
  setComponents: (component: Components) => void;
  setServers: (servers: Server[]) => void;
  setServer: (server: Server) => void;
}

export const useComponentStore = create<ComponentStore>((set, get) => ({
  components: {},
  servers: [],
  server: null,
  setComponents: (components: Components) => {
    set({components});
  },
  setServers: (servers: Server[]) => set({servers}),
  setServer: (server: Server) => set({server}),
}));