import {FC, useMemo} from "react";
import axios from "axios";
import {useQuery} from "react-query";
import Swagger from "./types/swagger";
import PathCollapse from "./components/PathCollapse";
import {Button, Col, Dropdown, Row, Space} from "antd";
import * as fuzzysort from "fuzzysort";
import {CaretDownOutlined,} from "@ant-design/icons";
import {env} from "./utils/env";
import {useSearchStore} from "./stores/useSearchStore";
import {useComponentStore} from "./stores/useComponentsStore";

const ApiList: FC = () => {
  const [setComponents, setServers, servers, server, setServer] =
    useComponentStore((state) => [
      state.setComponents,
      state.setServers,
      state.servers,
      state.server,
      state.setServer,
    ]);
  const {data} = useQuery(
    ["swagger"],
    async () =>
      await axios.get<Swagger>(env("SWAGGER_URL", "/swagger/v1/swagger.json")),
    {
      onSuccess: (response) => {
        setComponents(response.data.components ?? {});
        setServers(response.data.servers ?? []);
        setServer((response.data.servers ?? [])?.[0] ?? null);
      },
    }
  );

  const apis = data?.data.paths ?? {};
  const {search} = useSearchStore();

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
        <Col md={16} sm={24} lg={12} style={{margin: 18}}>
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
                  {server?.url ?? "Select server"} <CaretDownOutlined/>
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
            style={{width: "100%"}}
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
