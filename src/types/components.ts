import Parameter from "./parameter";
import RequestBody from "./requestBody";
import Schema from "./schema";

export default interface Components {
  schemas?: { [schemaName: string]: Schema };
  responses?: { [responseName: string]: Response };
  parameters?: { [parameterName: string]: Parameter };
  //examples?: { [exampleName: string]: Example };
  requestBodies?: { [requestBodyName: string]: RequestBody };
  //headers?: { [headerName: string]: Header };
  //securitySchemes?: { [securitySchemeName: string]: SecurityScheme };
  //links?: { [linkName: string]: Link };
  //callbacks?: { [callbackName: string]: Callback };
}
