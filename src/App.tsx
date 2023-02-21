import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import ApiList from "./ApiList";
import { App as MainApp, Layout } from "antd";
import React from "react";
import "./index.css";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import LoginPage from "./LoginPage";

const client = new QueryClient();

interface AuthStore {
  token?: string | null;
  isLoggedIn: () => boolean;
  setToken: (token: string | null) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      token: null,
      isLoggedIn: () => get()?.token != null,
      setToken: (token) => set({ token }),
    }),
    {
      name: "auth-store",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ token: state.token }),
    }
  )
);

function App() {
  const headerStyle: React.CSSProperties = {
    textAlign: "center",
    color: "#fff",
    height: 64,
    paddingInline: 50,
    lineHeight: "64px",
    backgroundColor: "#7dbcea",
  };

  const contentStyle: React.CSSProperties = {
    textAlign: "center",
    minHeight: 120,
  };

  const { isLoggedIn, token } = useAuthStore();

  console.log({ token, isLoggedIn });
  return (
    <MainApp>
      <QueryClientProvider client={client}>
        {isLoggedIn() ? (
          <Layout>
            <Layout.Header style={headerStyle}>Quester</Layout.Header>
            <Layout.Content style={contentStyle}>
              <ApiList />
            </Layout.Content>
          </Layout>
        ) : (
          <LoginPage />
        )}
      </QueryClientProvider>
    </MainApp>
  );
}

export default App;
