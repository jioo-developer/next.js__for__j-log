import { popuprHandler } from "@/app/common/handler/error/ErrorHandler";
import { QueryObserverResult, useQuery } from "@tanstack/react-query";
import { getDetailHandler } from "./DetailHooks";

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

const useDetailQueryHook = (pageId: string) => {
  const {
    data,
    isLoading,
    error,
    refetch,
  }: QueryObserverResult<FirebaseData, Error> = useQuery({
    queryKey: ["getDetail", pageId],
    queryFn: async (queryKey) => {
      const keyParams = queryKey.queryKey[1] as string;
      return await getDetailHandler(keyParams);
    },
    enabled: !!pageId,
  });
  if (error) {
    popuprHandler({ message: "페이지 정보를 찾을 수 없습니다." });
  }
  const pageData = data as FirebaseData;
  const pageRefetch = refetch;
  return { pageData, isLoading, error, pageRefetch };
};
export default useDetailQueryHook;
