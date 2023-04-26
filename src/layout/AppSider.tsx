import React, {FC} from "react";
import {Button, Layout, Menu, Row, Tooltip} from "antd";
import {useHistoryStore} from "../stores/useHistoryStore";
import {CloseOutlined} from "@ant-design/icons";

export interface AppSiderProps {

}

const AppSider: FC<AppSiderProps> = ({}) => {
  const siderStyle: React.CSSProperties = {
    backgroundColor: "#85bfe8",
    height: "calc(100vh - 64px)",
    position: "fixed",
    bottom: 0,
    padding: 10,
  }
  const [history, clear] = useHistoryStore(state => [state.history, state.clear]);

  return (
    <Layout.Sider style={siderStyle} width={320}>
      <Row align={"middle"} justify={"space-between"}>
        <h3>Recent</h3>
        <Button type={"text"} onClick={clear}><CloseOutlined/></Button>
      </Row>

      <Menu
        style={{
          fontSize: 12,
          backgroundColor: "transparent",
        }}
        items={history.map((x, i) => ({
          key: i,
          label: <Tooltip title={x}>{x}</Tooltip>,

        }))}/>
    </Layout.Sider>
  );
}

export default AppSider;