import { authService, db } from "../../../Firebase";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { doc, updateDoc } from "firebase/firestore";
import { popupInit, popuprHandler } from "@/app/handler/error/ErrorHandler";
import { User } from "firebase/auth";

type propsType = {
  cash: number;
  item: number;
};

const useCashMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ cash, item }: propsType) => {
      const user = authService.currentUser as User;
      const Ref = doc(db, "cash", user.uid as string);

      await updateDoc(Ref, {
        cash: cash,
        item: item,
      });
      const result = { cash, item };
      return result;
    },
    onSuccess: (result) => {
      queryClient.setQueryData<propsType[]>(["getCash"], (oldData) => {
        if (!oldData) {
          return oldData;
        } else {
          return [result];
        }
      });
      popuprHandler({ message: "구매가 완료 되었습니다" });
    },
    onError: () => {
      popuprHandler({ message: "구매 중 오류가 발생하였습니다" });
    },
  });
};

export default useCashMutation;
