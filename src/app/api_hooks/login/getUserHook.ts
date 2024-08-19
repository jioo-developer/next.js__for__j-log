import { errorHandler } from "@/app/common/handler/error/ErrorHandler";
import { userData } from "@/app/common/type/commonType";
import { authService } from "@/app/Firebase";
import { QueryObserverResult, useQuery } from "@tanstack/react-query";
import { User } from "firebase/auth";

const getuser = (): Promise<User | Error> => {
  return new Promise((resolve, reject) => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        resolve(user);
      } else {
        reject(new Error("검색되는 유저 정보가 없습니다."));
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
  if (error) {
    errorHandler(error.message);
  }
  return { data, isLoading, error, refetch };
};
export default useUserQueryHook;
