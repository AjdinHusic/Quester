import React, {FC} from "react";
import {Button, Col, Input, Layout, Row, Space, Typography} from "antd";
import {LogoutOutlined, SearchOutlined} from "@ant-design/icons";
import {useSearchStore} from "../stores/useSearchStore";
import {useAuthStore} from "../stores/useAuthStore";

export interface AppHeaderProps {
}

const AppHeader: FC<AppHeaderProps> = ({}) => {
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

  const {search, setSearch} = useSearchStore();
  const {logOut} = useAuthStore();

  return (
    <Layout.Header style={headerStyle}>
      <Row align={"middle"} justify={"space-between"}>
        <Col>
          <Typography.Title
            level={4}
            style={{marginTop: 10, padding: 0, color: "#fff"}}
          >
            Quester
          </Typography.Title>
        </Col>
        <Col>
          <Input
            value={search}
            onChange={(x) => setSearch(x.target.value)}
            placeholder={"search"}
            prefix={<SearchOutlined/>}
          />
        </Col>
        <Col>
          <Button shape={"round"} onClick={logOut} type={"text"}>
            <LogoutOutlined/> Logout
          </Button>
        </Col>
      </Row>
    </Layout.Header>
  );
}

export default AppHeader;