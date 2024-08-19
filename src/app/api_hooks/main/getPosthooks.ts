import { QueryObserverResult, useQuery } from "@tanstack/react-query";
import { getPostData } from "./posthooks";
import { errorHandler } from "@/app/common/handler/error/ErrorHandler";

export type postProps = {
  user: string;
  pageId: string;
  profile: string;
  date: string;
  timestamp: { second: number; nanoseconds: number };
  title: string;
  fileName: string | string[];
  url: string[];
  favorite: number;
  text: string;
  writer: string;
  id: string;
};

const usePostQueryHook = () => {
  const {
    isLoading,
    data,
    error,
    refetch,
  }: QueryObserverResult<postProps[], Error> = useQuery({
    queryKey: ["getPost"],
    queryFn: getPostData,
  });
  const postData = data;
  const postRefetch = refetch;

  if (error) {
    errorHandler(error.message);
  }
  return { isLoading, postData, error, postRefetch };
};

export default usePostQueryHook;
