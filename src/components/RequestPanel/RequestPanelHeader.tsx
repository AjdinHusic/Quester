import { FC } from "react";
import { Verb } from "../../types/verb";
import { Tag } from "antd";

export const RequestPanelHeader: FC<{
  verb: Verb;
  path: string;
  highlightedPath: string;
}> = ({ verb, path, highlightedPath }) => {
  const color = {
    get: "green",
    post: "blue",
    put: "yellow",
    patch: "orange",
    delete: "red",
  }[verb];

  return (
    <div style={{ textAlign: "left", fontWeight: 400 }}>
      <Tag color={color} style={{ textTransform: "uppercase" }}>
        {verb}
      </Tag>
      <span dangerouslySetInnerHTML={{ __html: highlightedPath ?? path }} />
    </div>
  );
};
