import { FC } from "react";
import { Card, Row, Space, Tag, Typography } from "antd";
import ReactJson from "react-json-view";
import { AxiosError, AxiosResponse } from "axios";

export interface ResponsePanelProps {
  uri?: string;
  isError?: boolean;
  isSuccess?: boolean;
  data?: AxiosResponse;
  error?: AxiosError;
}

//returns a string "type" of input object
export function isObj(obj: any) {
  return typeof obj === "object" || Array.isArray(obj);
}

const ResponsePanel: FC<ResponsePanelProps> = ({
  uri,
  isError,
  isSuccess,
  data,
  error,
}) => {
  const errorColor = "rgba(236,9,28,0.8)";
  const responseSrc = data?.data ?? error?.response?.data;

  return (
    <Card
      title={
        <Space direction={"vertical"} style={{ padding: 6 }}>
          <Row>
            <span style={{ marginRight: 4 }}>response</span>
            <Tag color={isError ? "red" : isSuccess ? "green" : undefined}>
              {data?.status ?? error?.response?.status ?? error?.message}
            </Tag>
          </Row>
          <Row>
            <Typography.Paragraph
              style={{
                fontSize: 11,
                color: "inherit",
              }}
            >
              {uri}
            </Typography.Paragraph>
          </Row>
        </Space>
      }
      headStyle={{
        color: isError ? errorColor : isSuccess ? "green" : undefined,
        borderBottomColor: isError
          ? errorColor
          : isSuccess
          ? "green"
          : undefined,
      }}
      style={{
        textAlign: "left",
        borderColor: isError ? errorColor : isSuccess ? "green" : undefined,
      }}
    >
      {responseSrc && isObj(responseSrc) ? (
        <ReactJson
          src={data?.data ?? error?.response?.data}
          style={{ overflow: "auto" }}
          collapseStringsAfterLength={60}
        />
      ) : (
        <>{responseSrc}</>
      )}
    </Card>
  );
};

export default ResponsePanel;
