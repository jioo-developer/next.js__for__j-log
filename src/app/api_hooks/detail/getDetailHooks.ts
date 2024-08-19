import { errorHandler } from "@/app/common/handler/error/ErrorHandler";
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
    queryFn: (queryKey) => {
      const keyParams = queryKey.queryKey[1] as string;
      getDetailHandler(keyParams);
    },
  });
  if (error) {
    errorHandler(error.message);
  }
  const postData = data;
  const postRefetch = refetch;
  return { postData, isLoading, error, postRefetch };
};
export default useDetailQueryHook;
