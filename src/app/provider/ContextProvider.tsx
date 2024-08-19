import React from "react";
import { childrenProps } from "@/app/common/type/commonType";

const ContextProvider = ({ children }: childrenProps) => {
  return <div>{children}</div>;
};

export default ContextProvider;
