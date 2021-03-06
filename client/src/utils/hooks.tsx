import { useState } from 'react';

export interface IRegisterValues {
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
}

export interface ILoginValues {
  username: string;
  password: string;
}

export interface INewPostValues {
  body: string;
}

interface IOutput<T> {
  onChange: Function;
  onSubmit: Function;
  values: T;
}

type IValues = IRegisterValues | ILoginValues | INewPostValues;

export const useForm = <T extends IValues>(
  callback: Function,
  initialState: T
  //FIXME: this should returned values as registre or login based on input
): IOutput<T> => {
  const [values, setValues] = useState<T>(initialState);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e?.target?.name]: e?.target?.value });
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    callback();
  };

  return {
    onChange,
    onSubmit,
    values,
  };
};
