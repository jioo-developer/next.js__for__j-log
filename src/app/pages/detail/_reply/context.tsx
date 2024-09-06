"use client";
import React, {
  createContext,
  Dispatch,
  ReactNode,
  useContext,
  useState,
} from "react";
import { popupMessageStore } from "@/app/store/common";

type contextProps = {
  comment: string;
  setComment: Dispatch<React.SetStateAction<string>>;
  commentTarget: string | number;
  setTarget: Dispatch<React.SetStateAction<string | number>>;
  msg: string;
  isClickValue: boolean;
  ChangeTargetHandler: (text: string, index: number) => void;
};

const initialContext = createContext<contextProps>({
  comment: "",
  setComment: () => {},
  commentTarget: "",
  setTarget: () => {},
  msg: "",
  isClickValue: false,
  ChangeTargetHandler: () => {},
});

export const MyContextProvider = (children: ReactNode) => {
  const [comment, setComment] = useState("");
  const [commentTarget, setTarget] = useState<string | number>("");

  const msg = popupMessageStore().message;
  const isClickValue = popupMessageStore().isClick;

  function ChangeTargetHandler(text: string, index: number) {
    setComment(text);
    setTarget(index);
  }

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
