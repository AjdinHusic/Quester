import { FC } from "react";
import { Collapse } from "antd";
import { PathObject } from "../types/pathItem";
import { RequestPanelContent } from "./RequestPanel/RequestPanelContent";
import { RequestPanelHeader } from "./RequestPanel/RequestPanelHeader";
import { Verb } from "../types/verb";

export interface PathComponentProps {
  path: string;
  highlightedPath?: string | null;
  pathObject: PathObject;
}

const PathCollapse: FC<PathComponentProps> = ({
  pathObject,
  path,
  highlightedPath,
}) => {
  return (
    <Collapse style={{ width: "100%" }}>
      {(["get", "post", "put", "patch", "delete"] as Verb[]).map((verb) =>
        verb in pathObject && pathObject[verb] !== undefined ? (
          <Collapse.Panel
            key={`${path}_${verb}`}
            header={
              <RequestPanelHeader
                verb={verb}
                path={path}
                highlightedPath={highlightedPath}
              />
            }
          >
            <RequestPanelContent
              verb={verb}
              method={pathObject[verb]!}
              path={path}
            />
          </Collapse.Panel>
        ) : null
      )}
    </Collapse>
  );
};

export default PathCollapse;
