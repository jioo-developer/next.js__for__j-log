import { authService } from "../../../Firebase";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signInWithEmailAndPassword } from "firebase/auth";
import { LoginErrorHandler } from "./LoginErrorHandler";
import { popuprHandler } from "@/app/handler/error/ErrorHandler";
import { useRouter } from "next/navigation";

type propsType = {
  id: string;
  pw: string;
};
// 로그인 실행 관련 로직
const useLoginHook = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, pw }: propsType) => {
      return await signInWithEmailAndPassword(authService, id, pw);
    },
    onSuccess: async (user) => {
      await queryClient.refetchQueries({
        queryKey: ["getuser"],
      });
      router.push("/pages/main");
    },
    onError: (error) => {
      const errorMessage = LoginErrorHandler(error.message);
      if (errorMessage) {
        popuprHandler({ message: errorMessage });
      } else {
        popuprHandler({ message: "로그인 도중 에러가 발생했습니다" });
      }
    },
  });
};

export default useLoginHook;
