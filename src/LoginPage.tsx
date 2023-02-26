import { FC } from "react";
import { Button, Form, Input, Layout, Row, Space, Typography } from "antd";
import { useMutation } from "react-query";
import axios, { AxiosError } from "axios";
import { UserOutlined } from "@ant-design/icons";
import ResponsePanel from "./ResponsePanel";
import { useAuthStore } from "./App";
import { v4 as uuidv4 } from "uuid";
import { env } from "./utils/env";

export interface LoginPageProps {}

const LoginPage: FC<LoginPageProps> = ({}) => {
  const { data, error, isLoading, isSuccess, isError, mutate } = useMutation(
    ["login"],
    ({ username, password }: { username: string; password: string }) => {
      return axios.post(
        env("LOGIN_PATH", "api/auth/login"),
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
            {isSuccess || isError ? (
              <ResponsePanel
                data={data}
                error={error as AxiosError}
                isError={isError}
                isSuccess={isSuccess}
              />
            ) : null}
          </Space>
        </Row>
      </Form>
    </Layout>
  );
};

export default LoginPage;
