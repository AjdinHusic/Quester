import {FC} from "react";
import {HttpMethod} from "../../types/pathItem";
import {Verb} from "../../types/verb";
import {useMutation} from "react-query";
import RequestForm, {RequestFormState} from "../../RequestForm";
import axios, {AxiosError} from "axios";
import HttpComponent from "../../HttpComponent";
import {Button, Divider} from "antd";
import ResponsePanel from "./ResponsePanel";
import {useAuthStore} from "../../stores/useAuthStore";
import {useComponentStore} from "../../stores/useComponentsStore";
import {useHistoryStore} from "../../stores/useHistoryStore";

export const RequestPanelContent: FC<{
  method: HttpMethod;
  path: string;
  verb: Verb;
}> = ({method, path, verb}) => {
  const {token} = useAuthStore();
  const server = useComponentStore((state) => state.server);

  const addHistoryItem = useHistoryStore(state => state.addHistoryItem);

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
      console.log({headers});
      const body = Object.entries(request.values)
        .filter(([key, value]) => value.in === "body")
        .reduce<Record<string, any>>((acc, curr) => {
          acc[curr[0]] = curr[1].value;
          return acc;
        }, {});
      console.log({body});
      const query = Object.entries(request.values)
        .filter(([key, value]) => value.in === "query")
        .reduce<Record<string, any>>((acc, curr) => {
          acc[curr[0]] = curr[1].value;
          return acc;
        }, {});
      const pathParams = Object.entries(request.values)
        .filter(([key, value]) => value.in === "path")
        .reduce<Record<string, any>>((acc, curr) => {
          acc[curr[0]] = curr[1].value;
          return acc;
        }, {});

      const url = path.replaceAll(/{(.*?)}/g, (r, a) => a in pathParams ? pathParams[a] : r)

      return axios.request({
        method: verb,
        baseURL: server?.url,
        url,
        data: body,
        params: query,
        headers: {
          ...headers,
          Authorization: "Bearer " + token,
        },
      });
    }, {
      onSettled(response, error) {
        const config = response?.config ?? (error as AxiosError)?.config;
        const uri = axios.getUri(config);
        if (uri)
          addHistoryItem(uri);
      }
    }
  );

  const config = data?.config ?? (error as AxiosError)?.config;
  const uri = axios.getUri(config);

  const onFinish = async (values: RequestFormState) => {
    mutate({values});
  };

  return (
    <>
      <RequestForm onFinish={(v) => onFinish(v)}>
        <HttpComponent method={method}/>
        <Button type={"primary"} htmlType={"submit"} loading={isLoading}>
          Submit
        </Button>
      </RequestForm>
      {status === "success" || status === "error" ? (
        <>
          <Divider/>
          <ResponsePanel
            uri={uri}
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
