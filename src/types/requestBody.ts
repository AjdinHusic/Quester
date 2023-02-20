export default interface RequestBody {
  description?: string;
  content: {
    [mediaType: string]: {
      schema: {
        $ref: string;
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
        additionalProperties?:
          | boolean
          | {
              type: string;
              format?: string;
            };
      };
    };
  };
}
