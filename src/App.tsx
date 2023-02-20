import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import ApiList from "./ApiList";
import { App as MainApp, Layout } from "antd";
import React from "react";
import "./index.css";

const client = new QueryClient();

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
    //lineHeight: "120px",
  };

  return (
    <MainApp>
      <QueryClientProvider client={client}>
        <Layout>
          <Layout.Header style={headerStyle}>Quester</Layout.Header>
          <Layout.Content style={contentStyle}>
            <ApiList />
          </Layout.Content>
        </Layout>
      </QueryClientProvider>
    </MainApp>
  );
}

export default App;
