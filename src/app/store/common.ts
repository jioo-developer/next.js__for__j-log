import create from "zustand";

export const popupMessageStore = create(() => ({
  message: "",
  type: "alert",
  state: () => {},
  isClick: false,
}));

export const pageInfoStore = create(() => ({
  pgId: "",
  editMode: false,
}));

export const searchStore = create(() => ({
  searchText: "",
}));
