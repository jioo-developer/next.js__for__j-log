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
  const { data, isLoading, error, refetch }: QueryObserverResult<User, Error> =
    useQuery({
      queryKey: ["getuser"],
      queryFn: getuser,
    });
  return { data, isLoading, error, refetch };
};
export default useUserQueryHook;
