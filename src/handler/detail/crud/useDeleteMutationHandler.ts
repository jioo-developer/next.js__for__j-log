import { QueryClient, useMutation } from "@tanstack/react-query";
import { popuprHandler } from "@/app/handler/error/ErrorHandler";
import pageDelete from "../pageDeleteHanlder";
import { FirebaseData } from "@/app/api_hooks/detail/getDetailHook";
import { useRouter } from "next/navigation";

const usePageDeleteHandler = () => {
  const router = useRouter();
  const queryClient = new QueryClient();
  return useMutation({
    mutationFn: async (pageData: FirebaseData) => {
      await pageDelete(pageData);
    },
    onSuccess: async () => {
      router.push("/pages/main");
      await queryClient.refetchQueries({
        queryKey: ["getPost"], // 리페칭할 쿼리의 키를 지정
      });
    },
    onError: () => {
      popuprHandler({ message: "페이지 삭제 도중 문제가 생겼습니다" });
    },
  });
};

export default usePageDeleteHandler;
