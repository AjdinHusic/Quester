import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import ApiList from "./ApiList";
import {
  App as MainApp,
  Button,
  Col,
  Input,
  Layout,
  Row,
  Space,
  Typography,
} from "antd";
import React from "react";
import "./index.css";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import LoginPage from "./LoginPage";
import { LogoutOutlined, SearchOutlined } from "@ant-design/icons";

const client = new QueryClient();

interface AuthStore {
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
      setToken: (token) => set({ token }),
      logOut: () => set({ token: null }),
    }),
    {
      name: "auth-store",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ token: state.token }),
    }
  )
);

interface SearchStore {
  search: string;
  setSearch: (search: string) => void;
}

export const useSearchStore = create<SearchStore>((set, get) => ({
  search: "",
  setSearch: (search: string) => set({ search }),
}));

function App() {
  const headerStyle: React.CSSProperties = {
    textAlign: "center",
    color: "#fff",
    height: 64,
    paddingInline: 50,
    lineHeight: "64px",
    backgroundColor: "#7dbcea",
    position: "sticky",
    top: 0,
    zIndex: 1,
    width: "100%",
  };

  const contentStyle: React.CSSProperties = {
    textAlign: "center",
    minHeight: "calc(100vh - 60px)",
  };

  const { isLoggedIn, logOut } = useAuthStore();
  const { search, setSearch } = useSearchStore();

  return (
    <MainApp>
      <QueryClientProvider client={client}>
        {isLoggedIn() ? (
          <Layout>
            <Layout.Header style={headerStyle} draggable={true}>
              <Row align={"middle"} justify={"space-between"}>
                <Space direction={"horizontal"} size={"large"}>
                  <Typography.Title
                    level={4}
                    style={{ marginTop: 10, padding: 0, color: "#fff" }}
                  >
                    Quester
                  </Typography.Title>
                  <div>
                    <Input
                      value={search}
                      onChange={(x) => setSearch(x.target.value)}
                      placeholder={"search"}
                      prefix={<SearchOutlined />}
                    />
                    {/*<span style={{ fontSize: 12 }}>*/}
                    {/*<b>{keyResults.length}</b> API results*/}
                    {/*</span>*/}
                  </div>
                </Space>
                <Col>
                  <Button shape={"round"} onClick={logOut}>
                    <LogoutOutlined /> Logout
                  </Button>
                </Col>
              </Row>
            </Layout.Header>
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
