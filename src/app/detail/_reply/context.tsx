"use client";
import React, {
  createContext,
  Dispatch,
  ReactNode,
  useContext,
  useState,
} from "react";
import { popupMessageStore } from "@/store/common";

type ContextProps = {
  comment: string;
  setComment: Dispatch<React.SetStateAction<string>>;
  commentTarget: string | number;
  setTarget: Dispatch<React.SetStateAction<string | number>>;
  msg: string;
  isClickValue: boolean;
  ChangeTargetHandler: (text: string, index: number) => void;
};

const initialContext = createContext<ContextProps>({
  comment: "",
  setComment: () => {},
  commentTarget: "",
  setTarget: () => {},
  msg: "",
  isClickValue: false,
  ChangeTargetHandler: () => {},
});

export const MyContextProvider = ({ children }: { children: ReactNode }) => {
  const [comment, setComment] = useState<string>("");
  const [commentTarget, setTarget] = useState<string | number>("");

  const msg = popupMessageStore().message;
  const isClickValue = popupMessageStore().isClick;

  const ChangeTargetHandler = (text: string, index: number) => {
    setComment(text);
    setTarget(index);
  };

  return (
    <initialContext.Provider
      value={{
        comment,
        setComment,
        commentTarget,
        setTarget,
        msg,
        isClickValue,
        ChangeTargetHandler,
      }}
    >
      {children}
    </initialContext.Provider>
  );
};

export const useReplyContext = () => {
  return useContext(initialContext);
};
