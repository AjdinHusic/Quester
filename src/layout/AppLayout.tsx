import React, {FC} from "react";
import AppHeader from "./AppHeader";
import {Layout} from "antd";
import AppSider from "./AppSider";
import ApiList from "../ApiList";

const AppLayout: FC = () => {
  const contentStyle: React.CSSProperties = {
    textAlign: "center",
    minHeight: "calc(100vh - 60px)",
  };

  return (
    <Layout>
      <AppHeader/>
      <Layout>
        <AppSider/>
        <Layout.Content style={contentStyle}>
          <ApiList/>
        </Layout.Content>
      </Layout>
    </Layout>
  );
}

export default AppLayout;