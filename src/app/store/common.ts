import create from "zustand";

export const popupMessageStore = create(() => ({
  message: "",
}));

export const globalRefetch = create(() => ({
  refetch: false,
}));
