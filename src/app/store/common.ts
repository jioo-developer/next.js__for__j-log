import create from "zustand";

export const popupMessageStore = create(() => ({
  message: "",
  type: "alert",
  clickFunc: () => {},
}));

export const globalRefetch = create(() => ({
  refetch: false,
}));
