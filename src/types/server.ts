export default interface Server {
  url: string;
  description?: string;
  variables?: {
    [variableName: string]: {
      default: string;
      enum?: Array<string>;
      description?: string;
    };
  };
}

