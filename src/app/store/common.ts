import create from "zustand";

export const popupMessageStore = create(() => ({
  message: "",
  type: "alert",
  state: () => {},
  isClick: false,
}));

export const globalRefetch = create(() => ({
  refetch: false,
}));
