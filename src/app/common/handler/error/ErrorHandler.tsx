"use client";
import { popupMessageStore } from "@/app/store/common";
import { Popup } from "@/stories/atoms/Popup";

export const errorHandler = (params: string) => {
  popupMessageStore.setState({ message: params });
};

export const ReturnPopup = () => {
  const ErrorMsg = popupMessageStore();

  return <>{ErrorMsg.message !== "" && <Popup />}</>;
};
