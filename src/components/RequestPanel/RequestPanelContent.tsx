import { FC } from "react";
import { HttpMethod } from "../../types/pathItem";
import { Verb } from "../../types/verb";
import { useAuthStore } from "../../App";
import { useComponentStore } from "../../ApiList";
import { useMutation } from "react-query";
import RequestForm, { RequestFormState } from "../../RequestForm";
import axios, { AxiosError } from "axios";
import HttpComponent from "../../HttpComponent";
import { Button, Divider } from "antd";
import ResponsePanel from "../../ResponsePanel";

export const RequestPanelContent: FC<{
  method: HttpMethod;
  path: string;
  verb: Verb;
}> = ({ method, path, verb }) => {
  const { token } = useAuthStore();
  const server = useComponentStore((state) => state.server);

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
    ["api-request", path, verb],
    (request: { values: RequestFormState }) => {
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
        method: verb,
        baseURL: server?.url,
        url: path,
        data: body,
        params: query,
        headers: {
          ...headers,
          Authorization: "Bearer " + token,
        },
      });
    }
  );

  const onFinish = async (values: RequestFormState) => {
    mutate({ values });
  };

  return (
    <>
      <RequestForm onFinish={(v) => onFinish(v)}>
        <HttpComponent method={method} />
        <Button type={"primary"} htmlType={"submit"} loading={isLoading}>
          Submit
        </Button>
      </RequestForm>
      {status === "success" || status === "error" ? (
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
    </>
  );
};
