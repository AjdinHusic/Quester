import PathItem from "./pathItem";
import Info from "./info";
import Server from "./server";
import Components from "./components";

export default interface Swagger {
  openapi: string;
  info: Info;
  servers?: Array<Server>;
  paths: PathItem;
  components?: Components;
  security?: Array<{
    [securityScheme: string]: Array<string>;
  }>;
  //tags?: Array<Tag>;
  //externalDocs?: ExternalDocumentation;
}