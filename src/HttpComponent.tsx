import { Button, Divider, Dropdown, Form, Input, Space, Tag } from "antd";
import { FC, useState } from "react";
import { HttpMethod } from "./types/pathItem";
import { useComponentStore } from "./ApiList";
import { DownOutlined } from "@ant-design/icons";
import { RequestFormItem } from "./RequestForm";

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
        <Button block style={{ marginBottom: 10 }} icon={<DownOutlined />}>
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
  const parameters = method.parameters ?? [];

  return (
    <>
      <>
        <Button></Button>
      </>
      {parameters.map((param) => (
        <>
          <RequestFormItem name={param.name} inValue={param.in} />
        </>
      ))}
      <Divider />
      <HttpMethodSchemaSwitcher method={method} />
      <Divider />
    </>
  );
};

export default HttpComponent;
