"use client";
import { popupMessageStore } from "@/app/store/common";
import { Popup } from "@/stories/atoms/Popup";
import ConfirmPopup from "@/stories/modules/Confirm/ConfirmPopup";
import PromptPopup from "@/stories/modules/Prompt/PromptPopup";
import { Dispatch, SetStateAction } from "react";

type popupPropsType = {
  message: string;
  type?: string;
  state?: (
    params?: any
  ) => void | Dispatch<SetStateAction<string | number>> | undefined;
};

export function popupInit() {
  popupMessageStore.setState({ message: "", isClick: false });
}

const isSetState = (
  state: any
): state is Dispatch<SetStateAction<string | number>> => {
  return typeof state === "function";
};

export const popuprHandler = ({ message, type, state }: popupPropsType) => {
  if (!type || type === "alert") {
    popupMessageStore.setState({
      message,
      type: "alert",
    });
  } else if (type === "confirm") {
    popupMessageStore.setState({
      message,
      type,
    });
  } else if (type === "prompt") {
    if (isSetState(state)) {
      popupMessageStore.setState({
        message,
        state: state,
        type,
      });
    }
  }
};

export const ReturnPopup = () => {
  const popupMsg = popupMessageStore();
  const popupType = popupMsg.type;
  if (popupMsg.message !== "") {
    if (popupType === "alert") {
      return <Popup />;
    } else if (popupType === "confirm") {
      return <ConfirmPopup />;
    } else if (popupType === "prompt") {
      return <PromptPopup />;
    }
  }
};
