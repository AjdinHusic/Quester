export default interface Parameter {
  name: string;
  in: string;
  description?: string;
  required: boolean;
  schema: {
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
}