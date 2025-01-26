import { authService, db } from "../../../Firebase";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { popuprHandler } from "@/app/handler/error/ErrorHandler";
import { LoginErrorHandler } from "@/app/api_hooks/login/LoginErrorHandler";

type propsType = {
  email: string;
  password: string;
  nickname: string;
};

// 회원가입 계정 생성 로직

const useSignupHandler = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ email, password, nickname }: propsType) => {
      // 회원생성로직
      const createUser = await createUserWithEmailAndPassword(
        authService,
        email,
        password
      );
      // 회원생성로직

      const user = createUser.user;

      // Firestore에 닉네임 저장
      await setDoc(doc(db, "nickname", user.uid), {
        id: user.uid,
        nickname: nickname,
        service: "password",
      });

      // 사용자 프로필 업데이트
      await updateProfile(user, {
        displayName: nickname,
        photoURL: "/img/default.svg",
      });
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: ["getuser"],
      });
      router.push("/pages/main");
      popuprHandler({ message: "회원가입을 환영합니다!" });
    },
    onError: (error) => {
      const errorMessage = LoginErrorHandler((error as Error).message);
      if (errorMessage) {
        popuprHandler({ message: errorMessage });
      } else {
        popuprHandler({ message: "회원가입 도중 에러가 발생하였습니다" });
      }
    },
  });

  return mutation;
};

export default useSignupHandler;
