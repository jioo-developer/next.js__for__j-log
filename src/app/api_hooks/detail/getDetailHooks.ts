import { doc, getDoc } from "firebase/firestore";
import { db } from "@/app/Firebase";
import { QueryObserverResult, useQuery } from "@tanstack/react-query";
import { popuprHandler } from "@/app/common/handler/error/ErrorHandler";

export type FirebaseData = {
  url: string[];
  title: string;
  writer: string;
  profile: string;
  pageId: string;
  user: string;
  timeStamp: {
    seconds: number;
    nanoseconds: number;
  };
  text: string;
  fileName: string[];
  date: string;
  favorite: number;
};

async function getDetailHandler(pageId: string) {
  try {
    const docRef = doc(db, "post", pageId);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return snapshot.data();
    } else {
      throw new Error("페이지 정보를 불러오는 중 오류가 발생했습니다.");
    }
  } catch (error) {
    throw new Error("페이지 정보를 불러오는 중 오류가 발생했습니다.");
  }
}

const useDetailQueryHook = (pageId: string) => {
  const { data, isLoading, error }: QueryObserverResult<FirebaseData, Error> =
    useQuery({
      queryKey: ["getPage", pageId],
      queryFn: async (queryKey) => {
        const keyParams = queryKey.queryKey[1] as string;
        return await getDetailHandler(keyParams);
      },
      staleTime: 1 * 60 * 1000, // 1분
      notifyOnChangeProps: ["data"],

      enabled: !!pageId,
      initialData: {},
    });
  const pageData = data;
  if (error) {
    popuprHandler({ message: error.message });
    window.location.href = "/";
  }
  return { pageData, isLoading, error };
};
export default useDetailQueryHook;
