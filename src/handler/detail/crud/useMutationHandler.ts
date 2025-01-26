import { FirebaseData } from "@/app/api_hooks/detail/getDetailHook";
import { db } from "../../../../Firebase";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { popuprHandler } from "../../error/ErrorHandler";

type propsType = {
  data: FirebaseData;
  pageId: string;
};

const useCreateMutation = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: async ({ data, pageId }: propsType) => {
      await setDoc(doc(db, "post", pageId), data);
      return { pageId };
    },
    onSuccess: (result) => {
      router.push(`/pages/detail/${result.pageId}`);
    },
    onError: () => {
      popuprHandler({ message: "게시글 작성 중 오류가 발생하였습니다" });
    },
  });
};

export default useCreateMutation;
