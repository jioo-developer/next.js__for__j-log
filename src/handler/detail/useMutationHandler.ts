import { useMutation, useQueryClient } from "@tanstack/react-query";
import { doc, updateDoc } from "firebase/firestore";
import { popuprHandler } from "@/app/handler/error/ErrorHandler";
import { FirebaseData } from "../../service/detail/getDetailHook";
import { db } from "../../../Firebase";

type favoriteType = {
  email?: string;
  value: number;
  id: string;
};

const useFavoriteMutate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ value, id }: favoriteType) => {
      const ref = doc(db, "post", id);
      const newFavorite = value + 1;
      await updateDoc(ref, {
        favorite: newFavorite,
      });
      return newFavorite;
    },
    onSuccess: (result, { id }) => {
      queryClient.refetchQueries({
        queryKey: ["getPage", id],
      });
      queryClient.setQueryData<FirebaseData>(["getPage", id], (oldData) => {
        const oldValue = oldData as FirebaseData;
        return {
          ...oldValue,
          result,
        };
      });
    },
    onError: () => {
      popuprHandler({ message: "좋아요 반영이 되지 않았습니다." });
    },
  });
};

export default useFavoriteMutate;
