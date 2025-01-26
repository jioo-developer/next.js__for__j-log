import { authService } from "../../../Firebase";
import { QueryObserverResult, useQuery } from "@tanstack/react-query";
import { User } from "firebase/auth";

// 로그인 호출 관련 hook

const getuser = (): Promise<User | null> => {
  return new Promise((resolve) => {
    authService.onAuthStateChanged((user) => {
      resolve(user);
    });
  });
};

const useUserQueryHook = () => {
  const { data, isLoading, refetch, error }: QueryObserverResult<User> =
    useQuery({
      queryKey: ["getuser"],
      queryFn: getuser,
      staleTime: 1 * 60 * 1000, // 1분
      notifyOnChangeProps: ["data"],
    });
  if (!data) {
    return { data: null, isLoading, refetch, error };
  } else {
    return { data, isLoading, refetch, error };
  }
};
export default useUserQueryHook;
