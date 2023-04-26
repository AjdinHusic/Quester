import {QueryClient, QueryClientProvider} from "react-query";
import {App as MainApp,} from "antd";
import React from "react";
import "./index.css";
import LoginPage from "./LoginPage";
import {env} from "./utils/env";
import {useAuthStore} from "./stores/useAuthStore";
import AppLayout from "./layout/AppLayout";

const client = new QueryClient();

function App() {
  const {isLoggedIn} = useAuthStore();

  return (
    <MainApp>
      <QueryClientProvider client={client}>
        {isLoggedIn() || env("LOGIN_PATH", "") == "" ? (
          <AppLayout/>
        ) : (
          <LoginPage/>
        )}
      </QueryClientProvider>
    </MainApp>
  );
}

export default App;
