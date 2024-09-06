import React from "react";
import { childrenProps } from "@/app/type_global/commonType";

const ContextProvider = ({ children }: childrenProps) => {
  return <div>{children}</div>;
};

export default ContextProvider;
