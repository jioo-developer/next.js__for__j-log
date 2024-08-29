import { authService } from "@/app/Firebase";
import { QueryObserverResult, useQuery } from "@tanstack/react-query";
import { User } from "firebase/auth";

const getuser = (): Promise<User> => {
  return new Promise((resolve, reject) => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        resolve(user);
      } else {
        reject(null);
      }
    });
  });
};

const useUserQueryHook = () => {
  const { data, isLoading, refetch, error }: QueryObserverResult<User, Error> =
    useQuery({
      queryKey: ["getuser"],
      queryFn: getuser,
      staleTime: 1 * 60 * 1000, // 1분
      notifyOnChangeProps: ["data"],
    });
  return { data, isLoading, refetch, error };
};
export default useUserQueryHook;
