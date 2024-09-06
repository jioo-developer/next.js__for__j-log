import usePostQueryHook from "@/app/api_hooks/main/getPosthooks";
import { pageInfoStore } from "@/app/store/common";
import { useParams } from "next/navigation";

export const createPageId = () => {
  let newPageId = createId(20);
  if (useIsPageId(newPageId)) {
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

const useIsPageId = (params: string) => {
  const { postData: findArray } = usePostQueryHook();
  if (findArray.length > 0) {
    return findArray.some((item) => item.id === params);
  } else {
    return false;
  }
};

export const useGetPageInfo = () => {
  const pageParams = useParams().id as string;
  const pageInfo = pageInfoStore().pgId;
  if (pageInfo === "") {
    pageInfoStore.setState({ pgId: pageParams });
  }
  return pageParams;
};
