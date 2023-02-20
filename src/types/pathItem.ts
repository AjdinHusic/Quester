import Parameter from "./parameter";
import RequestBody from "./requestBody";
import { Responses } from "./response";
import Server from "./server";

export interface HttpMethod {
  tags?: Array<string>;
  summary?: string;
  description?: string;
  operationId?: string;
  parameters?: Array<Parameter>;
  requestBody?: RequestBody;
  responses: Responses;
  deprecated?: boolean;
  security?: Array<{
    [securityScheme: string]: Array<string>;
  }>;
  servers?: Array<Server>;
}

export interface PathObject {
  summary?: string;
  description?: string;
  parameters?: Array<Parameter>;
  get?: HttpMethod;
  post?: HttpMethod;
  put?: HttpMethod;
  delete?: HttpMethod;
  // other HTTP methods as needed
}

export default interface PathItem {
  [path: string]: PathObject
}