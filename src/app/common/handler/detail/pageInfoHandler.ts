import { FirebaseData } from "@/app/api_hooks/detail/getDetailHooks";

export const createPageId = (array: FirebaseData[]) => {
  let newPageId = createId(20);
  if (isPageId(array, newPageId)) {
    newPageId = createId(20);
    return newPageId;
  } else {
    return newPageId;
  }
};

const createId = (num: number) => {
  const words = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let result = "";
  for (var i = 0; i < num; i++)
    result += words.charAt(Math.floor(Math.random() * words.length));
  return result;
};

const isPageId = (findArray: FirebaseData[], params: string) => {
  if (findArray.length > 0) {
    return findArray.some((item) => item.id === params);
  } else {
    return false;
  }
};
