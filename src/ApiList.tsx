import { FC, useMemo, useState } from "react";
import axios from "axios";
import { useQuery } from "react-query";
import Swagger from "./types/swagger";
import PathCollapse from "./components/PathCollapse";
import { Button, Col, Collapse, Dropdown, Input, Row, Space } from "antd";
import { create } from "zustand";
import Components from "./types/components";
import Server from "./types/server";
import * as fuzzysort from "fuzzysort";
import {
  CaretDownOutlined,
  DownOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useSearchStore } from "./App";

interface ComponentStore {
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
    set({ components });
  },
  setServers: (servers: Server[]) => set({ servers }),
  setServer: (server: Server) => set({ server }),
}));

const ApiList: FC = () => {
  const [setComponents, setServers, servers, server, setServer] =
    useComponentStore((state) => [
      state.setComponents,
      state.setServers,
      state.servers,
      state.server,
      state.setServer,
    ]);
  const { data } = useQuery(
    ["swagger"],
    async () =>
      await axios.get<Swagger>(
        "https://localhost:5001/swagger/v1/swagger.json"
      ),
    {
      onSuccess: (response) => {
        setComponents(response.data.components ?? {});
        setServers(response.data.servers ?? []);
        setServer((response.data.servers ?? [])?.[0] ?? null);
      },
    }
  );

  const apis = data?.data.paths ?? {};
  const { search } = useSearchStore();

  const keyResults = useMemo<Array<[string, string | null]>>(() => {
    const keys = Object.keys(apis);
    if (search.trim() === "") return keys.map((key) => [key, null]);
    const results = fuzzysort.go(search, keys, {
      threshold: -1000,
    });

    return results
      .filter((x) => x.score > -1000)
      .map((x) => [x.target, fuzzysort.highlight(x)]);
  }, [apis, search]);

  return (
    <>
      <Row justify={"center"} align={"middle"}>
        <Col md={16} sm={24} lg={12} style={{ margin: 18 }}>
          <Row justify={"space-between"} align={"top"}>
            <Col>
              <Dropdown
                menu={{
                  items: servers.map((s) => ({
                    key: s.url,
                    label: s.url,
                    description: s.description,
                    onClick: () => setServer(s),
                  })),
                }}
              >
                <Button>
                  {server?.url ?? "Select server"} <CaretDownOutlined />
                </Button>
              </Dropdown>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row justify={"center"}>
        <Col md={16} sm={24} lg={12}>
          <Space
            direction={"vertical"}
            style={{ width: "100%" }}
            size={"large"}
          >
            {keyResults.map((key) => (
              <PathCollapse
                key={key[0]}
                highlightedPath={key[1]}
                path={key[0]}
                pathObject={apis[key[0]]}
              />
            ))}
          </Space>
        </Col>
      </Row>
    </>
  );
};

export default ApiList;
