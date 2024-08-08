import React from "react";
import { childrenProps } from "../utill/type/commonType";

const ContextProvider = ({ children }: childrenProps) => {
  return <div>{children}</div>;
};

export default ContextProvider;
