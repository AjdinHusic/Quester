import { FC } from "react";
import {
  Button,
  Col,
  Collapse,
  Divider,
  Dropdown,
  Form,
  Input,
  Tag,
} from "antd";
import { HttpMethod, PathObject } from "./types/pathItem";
import HttpComponent from "./HttpComponent";
import { useComponentStore } from "./ApiList";
import { useMutation } from "react-query";
import axios, { AxiosError } from "axios";
import ResponsePanel from "./ResponsePanel";
import RequestForm, { RequestFormState } from "./RequestForm";
import { useAuthStore } from "./App";

export interface PathComponentProps {
  path: string;
  highlightedPath?: string | null;
  pathObject: PathObject;
}

const PathComponent: FC<PathComponentProps> = ({
  pathObject,
  path,
  highlightedPath,
}) => {
  const { token } = useAuthStore();
  const {
    isLoading,
    isError,
    isSuccess,
    mutate,
    data,
    error,
    status,
    variables,
  } = useMutation(
    ["api-request"],
    (request: {
      method: "get" | "post" | "put" | "delete";
      path: string;
      values: RequestFormState;
    }) => {
      console.log(request.values);
      const headers = Object.entries(request.values)
        .filter(([key, value]) => value.in === "header")
        .reduce<Record<string, any>>((acc, curr) => {
          acc[curr[0]] = curr[1].value;
          return acc;
        }, {});
      console.log({ headers });
      const body = Object.entries(request.values)
        .filter(([key, value]) => value.in === "body")
        .reduce<Record<string, any>>((acc, curr) => {
          acc[curr[0]] = curr[1].value;
          return acc;
        }, {});
      console.log({ body });
      const query = Object.entries(request.values)
        .filter(([key, value]) => value.in === "query")
        .reduce<Record<string, any>>((acc, curr) => {
          acc[curr[0]] = curr[1].value;
          return acc;
        }, {});
      console.log({ query });

      return axios.request({
        method: request.method,
        baseURL: server?.url,
        url: request.path,
        data: body,
        params: query,
        headers: {
          ...headers,
          Authorization: "Bearer " + token,
        },
      });
    }
  );
  const server = useComponentStore((state) => state.server);
  console.log({ isLoading });

  const onFinish = async (
    method: "get" | "post" | "put" | "delete",
    path: string,
    values: RequestFormState
  ) => {
    mutate({ method, path, values });
  };

  return (
    <Collapse style={{ width: "100%" }}>
      {pathObject.get == null ? null : (
        <Collapse.Panel
          key={path + "_get"}
          header={
            <div style={{ textAlign: "left", fontWeight: 400 }}>
              <Tag color={"green"}>GET</Tag>
              <span
                dangerouslySetInnerHTML={{ __html: highlightedPath ?? path }}
              />
            </div>
          }
        >
          <RequestForm onFinish={(v) => onFinish("get", path, v)}>
            <HttpComponent method={pathObject.get} />
            <Button type={"primary"} htmlType={"submit"} loading={isLoading}>
              Submit
            </Button>
          </RequestForm>
          {(status === "success" || status === "error") &&
          variables?.method === "get" ? (
            <>
              <Divider />
              <ResponsePanel
                isError={isError}
                isSuccess={isSuccess}
                data={data}
                error={error as AxiosError}
              />
            </>
          ) : null}
        </Collapse.Panel>
      )}
      {pathObject.post == null ? null : (
        <Collapse.Panel
          key={path + "_post"}
          header={
            <div style={{ textAlign: "left", fontWeight: 400 }}>
              <Tag color={"blue"}>POST</Tag>
              <span
                dangerouslySetInnerHTML={{ __html: highlightedPath ?? path }}
              />
            </div>
          }
        >
          <RequestForm onFinish={(v) => onFinish("post", path, v)}>
            <HttpComponent method={pathObject.post} />
            <Button type={"primary"} htmlType={"submit"} loading={isLoading}>
              submit
            </Button>
          </RequestForm>
          {(status === "success" || status === "error") &&
          variables?.method === "post" ? (
            <>
              <Divider />
              <ResponsePanel
                isError={isError}
                isSuccess={isSuccess}
                data={data}
                error={error as AxiosError}
              />
            </>
          ) : null}
        </Collapse.Panel>
      )}

      {pathObject.put == null ? null : (
        <Collapse.Panel
          key={path + "_put"}
          header={
            <div style={{ textAlign: "left", fontWeight: 400 }}>
              <Tag color={"yellow"}>PUT</Tag>
              <span
                dangerouslySetInnerHTML={{ __html: highlightedPath ?? path }}
              />
            </div>
          }
        >
          <RequestForm onFinish={(v) => onFinish("put", path, v)}>
            <HttpComponent method={pathObject.put} />
            <Button type={"primary"} htmlType={"submit"} loading={isLoading}>
              submit
            </Button>
          </RequestForm>
          {(status === "success" || status === "error") &&
          variables?.method === "put" ? (
            <>
              <Divider />
              <ResponsePanel
                isError={isError}
                isSuccess={isSuccess}
                data={data}
                error={error as AxiosError}
              />
            </>
          ) : null}
        </Collapse.Panel>
      )}

      {pathObject.delete == null ? null : (
        <Collapse.Panel
          key={path + "_delete"}
          header={
            <div style={{ textAlign: "left", fontWeight: 400 }}>
              <Tag color={"red"}>DELETE</Tag>
              <span
                dangerouslySetInnerHTML={{ __html: highlightedPath ?? path }}
              />
            </div>
          }
        >
          <RequestForm onFinish={(v) => onFinish("delete", path, v)}>
            <HttpComponent method={pathObject.delete} />
            <Button type={"primary"} htmlType={"submit"} loading={isLoading}>
              Submit
            </Button>
          </RequestForm>
          {(status === "success" || status === "error") &&
          variables?.method === "delete" ? (
            <>
              <Divider />
              <ResponsePanel
                isError={isError}
                isSuccess={isSuccess}
                data={data}
                error={error as AxiosError}
              />
            </>
          ) : null}
        </Collapse.Panel>
      )}
    </Collapse>
  );
};

export default PathComponent;
