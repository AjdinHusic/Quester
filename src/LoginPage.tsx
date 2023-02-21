import { FC } from "react";
import { Button, Form, Input, Layout, Row, Space, Typography } from "antd";
import { useMutation } from "react-query";
import axios, { AxiosError } from "axios";
import viteReact from "@vitejs/plugin-react";
import { UserOutlined } from "@ant-design/icons";
import ResponsePanel from "./ResponsePanel";
import { Simulate } from "react-dom/test-utils";
import error = Simulate.error;
import { useAuthStore } from "./App";
import { v4 as uuidv4 } from "uuid";

export interface LoginPageProps {}

const LoginPage: FC<LoginPageProps> = ({}) => {
  const { data, error, isLoading, isSuccess, isError, mutate } = useMutation(
    ["login"],
    ({ username, password }: { username: string; password: string }) => {
      return axios.post(
        import.meta.env.VITE_LOGIN_URL ?? "api/auth/login",
        {
          username,
          password,
        },
        {
          headers: {
            "X-Device-Id": uuidv4(),
          },
        }
      );
    },
    {
      onSuccess: (response) => {
        console.log({ response });
        setToken(response.data.token);
      },
    }
  );

  const { setToken } = useAuthStore();

  const onFinish = (values: any) => {
    mutate({
      username: values.username,
      password: values.password,
    });
  };

  return (
    <Layout style={{ height: "100vh" }}>
      <Form layout={"vertical"} onFinish={onFinish}>
        <Row justify={"center"} align={"middle"} style={{ height: "100%" }}>
          <Space
            direction={"vertical"}
            align={"center"}
            style={{
              width: "100%",
              height: "100vh",
              justifyContent: "center",
              marginTop: -60,
            }}
          >
            <Typography.Title>Welcome to Quester</Typography.Title>
            <Form.Item
              name={"username"}
              label={"Username"}
              validateStatus={
                isError
                  ? "error"
                  : isLoading
                  ? "validating"
                  : isSuccess
                  ? "success"
                  : undefined
              }
            >
              <Input suffix={<UserOutlined />} />
            </Form.Item>
            <Form.Item
              name={"password"}
              label={"Password"}
              validateStatus={
                isError
                  ? "error"
                  : isLoading
                  ? "validating"
                  : isSuccess
                  ? "success"
                  : undefined
              }
            >
              <Input.Password />
            </Form.Item>
            <Button loading={isLoading} htmlType={"submit"}>
              Login
            </Button>
            <ResponsePanel
              data={data}
              error={error as AxiosError}
              isError={isError}
              isSuccess={isSuccess}
            />
          </Space>
        </Row>
      </Form>
    </Layout>
  );
};

export default LoginPage;
