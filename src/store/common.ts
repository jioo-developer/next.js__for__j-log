import { create } from "zustand";

export const popupMessageStore = create(() => ({
  message: "",
  type: "alert",
  state: () => {},
  isClick: false,
}));

export const pageInfoStore = create(() => ({
  pgId: "",
  editMode: false,
  fromAction: "",
}));

export const searchStore = create(() => ({
  searchText: "",
}));
