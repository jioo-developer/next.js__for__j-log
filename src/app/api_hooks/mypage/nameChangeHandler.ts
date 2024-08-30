import { deleteField, doc, setDoc, updateDoc } from "firebase/firestore";
import { authService, db } from "@/app/Firebase";
import { updateProfile, User } from "firebase/auth";
import { changeHanlderType, userData } from "@/app/common/type/commonType";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { popuprHandler } from "../../common/handler/error/ErrorHandler";

function useNameChanger() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ data, nickname }: changeHanlderType) => {
      const user = data as userData;
      const userNameRef = doc(db, "nickname", user.uid as string);

      await updateDoc(userNameRef, {
        nickname: deleteField(),
      });

      await setDoc(
        userNameRef,
        {
          nickname: nickname,
        },
        { merge: true }
      );

      await updateProfile(authService.currentUser as User, {
        displayName: nickname,
      });

      return nickname;
      // 여기서 return 되는 nickname이 onSuccess의 params로 들어감
    },
    onSuccess: async (nickname) => {
      await queryClient.refetchQueries({
        queryKey: ["getuser"], // 리페칭할 쿼리의 키를 지정
      });
      queryClient.setQueryData<User>(["getuser"], (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          displayName: nickname,
        };
      });
    },
    onError: () => {
      popuprHandler({ message: "닉네임을 변경에 실패하였습니다." });
    },
  });
}

export default useNameChanger;
