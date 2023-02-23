import { Button, Divider, Dropdown, Form, Input, Row, Space } from "antd";
import React, { FC, useState } from "react";
import { HttpMethod } from "./types/pathItem";
import { useComponentStore } from "./ApiList";
import {
  CaretDownOutlined,
  MinusOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { RequestFormItem } from "./RequestForm";
import Parameter from "./types/parameter";

export interface HttpComponentProps {
  method: HttpMethod;
}

export interface HttpMethodSchemaSwitcherProps {
  method: HttpMethod;
}

const HttpMethodSchemaSwitcher: FC<HttpMethodSchemaSwitcherProps> = ({
  method,
}) => {
  const components = useComponentStore((state) => state.components);

  const contentTypes = Object.keys(method.requestBody?.content ?? {});
  const [contentType, setContentType] = useState<string | null>(
    contentTypes[0] ?? null
  );

  const objectSchema =
    method.requestBody?.content[contentType ?? ""]?.schema?.["$ref"] ?? null;
  console.log(objectSchema);

  const schemaName = objectSchema
    ?.replace("#/components/schemas", "")
    .replace("/", "");
  const schema = components.schemas?.[schemaName ?? ""] ?? null;

  const properties = Object.keys(schema?.properties ?? {});

  if (!properties.length) return null;

  return (
    <>
      <Dropdown
        menu={{
          items: contentTypes.map((c) => ({
            key: c,
            label: c,
            onClick: () => setContentType(c),
          })),
        }}
        placement={"bottomRight"}
        arrow
      >
        <Button
          type={"dashed"}
          block
          style={{ marginBottom: 10 }}
          icon={<CaretDownOutlined />}
        >
          {contentType}
        </Button>
      </Dropdown>

      {properties.map((property) => (
        <RequestFormItem key={property} name={property} inValue={"body"} />
      ))}
    </>
  );
};

const HttpComponent: FC<HttpComponentProps> = ({ method }) => {
  const [additionalParams, setAdditionalParams] = useState<Parameter[]>([]);
  const parameters = (method.parameters ?? []).concat(additionalParams);

  const [property, setProperty] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [addIn, setAddIn] = useState<"body" | "query" | "header">("body");
  const inPropertyTypes: Array<"body" | "query" | "header"> = [
    "body",
    "query",
    "header",
  ];

  const onAddParameter = () => {
    setAdditionalParams([
      ...additionalParams,
      {
        name: property,
        in: addIn,
        required: false,
        schema: {
          type: "string",
        },
      },
    ]);
  };

  return (
    <>
      {isAdding ? (
        <>
          <Row justify={"space-between"}>
            <Space direction={"horizontal"} align={"start"}>
              <Button type={"primary"} onClick={onAddParameter}>
                <PlusOutlined /> Add
              </Button>
              <Form.Item>
                <Input
                  placeholder={"property"}
                  allowClear
                  value={property}
                  onChange={(x) => setProperty(x.target.value)}
                />
              </Form.Item>
              <Dropdown
                menu={{
                  items: inPropertyTypes.map((inPart) => ({
                    key: inPart,
                    label: inPart,
                    onClick: () => setAddIn(inPart),
                  })),
                }}
              >
                <Button>
                  <Space>
                    {addIn ?? "in"} <CaretDownOutlined />
                  </Space>
                </Button>
              </Dropdown>
            </Space>

            <Button shape={"round"} onClick={(x) => setIsAdding(false)}>
              <MinusOutlined />
              Cancel
            </Button>
          </Row>
        </>
      ) : (
        <Row justify={"end"}>
          <Button shape={"round"} onClick={(x) => setIsAdding(true)}>
            <PlusOutlined />
            Property
          </Button>
        </Row>
      )}
      <Divider />
      {parameters.map((param) => (
        <>
          <RequestFormItem
            key={param.name}
            name={param.name}
            inValue={param.in}
          />
        </>
      ))}
      <Divider />
      <HttpMethodSchemaSwitcher method={method} />
      <Divider />
    </>
  );
};

export default HttpComponent;
