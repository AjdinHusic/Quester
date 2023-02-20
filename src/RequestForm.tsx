import React, {
  createContext,
  FC,
  PropsWithChildren,
  ReactNode,
  useContext,
  useState,
} from "react";
import { Form, Input, Tag } from "antd";

export interface RequestFormState {
  [parameter: string]: { in: string; value: any };
}

interface RequestFormContext {
  formState: RequestFormState;

  setValue(name: string, value: any, inValue: string): void;
}

const RequestFormContext = createContext<RequestFormContext>({
  formState: {},
  setValue(name: string, value: any, inValue: string) {},
});

export interface RequestFormProps {
  onFinish: (state: RequestFormState) => void;
}

const RequestForm: FC<RequestFormProps & PropsWithChildren> = ({
  onFinish,
  children,
}) => {
  const [formState, setFormState] = useState<RequestFormState>({});

  const onSubmit = (values: any) => {
    onFinish(formState);
  };

  const setValue = (name: string, value: any, inValue: string) => {
    setFormState((x) => ({
      ...x,
      [name]: {
        value,
        in: inValue,
      },
    }));
  };

  return (
    <RequestFormContext.Provider value={{ formState, setValue }}>
      <Form layout={"vertical"} onFinish={onSubmit}>
        {children}
      </Form>
    </RequestFormContext.Provider>
  );
};

export interface RequestFormItemProps {
  name: string;
  inValue: string;
  label?: ReactNode;
}

export const RequestFormItem: FC<RequestFormItemProps & PropsWithChildren> = ({
  name,
  inValue,
  children,
  label,
}) => {
  const { formState, setValue } = useContext(RequestFormContext);

  label =
    label == undefined ? (
      <span>
        <Tag>{inValue}</Tag> {name}
      </span>
    ) : (
      label
    );

  return (
    <Form.Item name={name} label={label}>
      <Input
        name={name}
        placeholder={name}
        value={formState[name]?.value ?? ""}
        onChange={(e) => setValue(name, e.target.value, inValue)}
      />
    </Form.Item>
  );
};

export default RequestForm;
