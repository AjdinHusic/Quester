import Server from "./server";

export default interface Response {
  description: string;
  headers?: {
    [headerName: string]: {
  description?: string;
  schema: {
    type: string;
    format?: string;
  };
};
};
  content?: {
    [mediaType: string]: {
  schema?: {
    type: string;
    format?: string;
    items?: {
      type: string;
      format?: string;
    };
    properties?: {
      [propertyName: string]: {
    type: string;
    format?: string;
  };
};
  additionalProperties?: boolean | {
    type: string;
    format?: string;
  };
};
};
};
  links?: {
    [linkName: string]: {
  operationId?: string;
  parameters?: {
    [parameterName: string]: any;
};
  requestBody?: any;
  description?: string;
  server?: Server;
};
};
};


export interface Responses {
  [statusCode: string]: {
    description: string;
    headers?: {
      [headerName: string]: {
        description?: string;
        schema: {
          type: string;
          format?: string;
        };
      };
    };
    content?: {
      [mediaType: string]: {
        schema?: {
          type: string;
          format?: string;
          items?: {
            type: string;
            format?: string;
          };
          properties?: {
            [propertyName: string]: {
              type: string;
              format?: string;
            };
          };
          additionalProperties?: boolean | {
            type: string;
            format?: string;
          };
        };
      };
    };
  }
}