import { authService } from "@/app/Firebase"
import { QueryObserverResult, useQuery } from "@tanstack/react-query"

export interface userData {
    displayName: string;
    email: string;
    photoURL: string;
    uid: string;
  }


const getuser = () => {
    return new Promise((resolve, reject) => {
        authService.onAuthStateChanged((user) => {
            if (user) {
                resolve(user)
            } else {
                reject(new Error("유저 정보가 없습니다."))
            }
        })
    })
}

const userQueryHook = () => {
    const { data, isLoading, isError, error,refetch}:QueryObserverResult<userData> = useQuery({
        queryKey: ['getuser'],
        queryFn: getuser,
      });
      return {data,isLoading,isError,error,refetch}
}
export default userQueryHook;
