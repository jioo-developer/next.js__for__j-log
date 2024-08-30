import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  DocumentData,
  DocumentReference,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { popuprHandler } from "@/app/common/handler/error/ErrorHandler";
import cookieHandler from "@/app/common/handler/cookieHandler";
import { FirebaseData } from "./getDetailHooks";

type propsType = {
  email: string;
  pageData: FirebaseData;
  ref: DocumentReference<DocumentData, DocumentData>;
  id: string;
};

const useFavoriteMutate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ email, pageData, ref }: propsType) => {
      const newFavorite = pageData.favorite + 1;
      await setDoc(
        ref,
        {
          favorite: newFavorite,
        },
        { merge: true }
      );
      return newFavorite;
    },
    onSuccess: (result, { email, id }) => {
      cookieHandler(email);
      queryClient.refetchQueries({
        queryKey: ["getPage", id],
      });
      queryClient.setQueryData<FirebaseData>(["getPage"], (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          favorite: result,
        };
      });
    },
    onError: () => {
      popuprHandler({ message: "좋아요 반영이 되지 않았습니다." });
    },
  });
};

export default useFavoriteMutate;
