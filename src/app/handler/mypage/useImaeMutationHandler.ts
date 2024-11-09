import { updateProfile, User } from "firebase/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { popuprHandler } from "@/app/handler/error/ErrorHandler";

type propsType = {
  user: User;
  imgurl: string;
};

function useImageChanger() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ user, imgurl }: propsType) => {
      await updateProfile(user, { photoURL: imgurl });
      return imgurl;
    },
    onSuccess: async (imgurl) => {
      await queryClient.refetchQueries({
        queryKey: ["getuser"], // 리페칭할 쿼리의 키를 지정
      });
      queryClient.setQueryData<User>(["getuser"], (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          photoURL: imgurl,
        };
      });
    },
    onError: () => {
      popuprHandler({ message: "프로필 변경에 실패하였습니다." });
    },
  });
}

export default useImageChanger;
