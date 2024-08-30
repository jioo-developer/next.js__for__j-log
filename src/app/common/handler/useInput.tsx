import { ChangeEvent, useState } from "react";

export const useInput = (initialValue: string | number) => {
  const [value, setValue] = useState(initialValue);
  const valueChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };
  return { value, valueChangeHandler };
};
