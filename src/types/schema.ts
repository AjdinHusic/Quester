export interface PropertySchema {
  type: string;
  format: string;
}

export default interface Schema {
  type: string;
  properties: { [propertyKey: string]: PropertySchema };
  additionalProperties: boolean;
}
