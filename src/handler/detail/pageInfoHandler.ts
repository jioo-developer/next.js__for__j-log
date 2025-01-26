import usePostQueryHook from "@/app/api_hooks/main/getPostHook";
import { pageInfoStore } from "@/store/common";
import { useParams } from "next/navigation";

export const useCreateId = () => {
  const { postData } = usePostQueryHook();
  let newPageId = createId(20);
  if (postData) {
    const IsPageId = postData.some((item) => item.id === newPageId);
    if (IsPageId) {
      newPageId = createId(20);
      return newPageId;
    } else {
      return newPageId;
    }
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

export const useGetPageInfo = () => {
  const pageParams = useParams().id as string;
  const pageInfo = pageInfoStore().pgId;
  if (pageInfo === "") {
    pageInfoStore.setState({ pgId: pageParams });
  }
  return pageParams;
};
