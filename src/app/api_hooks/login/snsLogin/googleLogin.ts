import { authService, db } from "@/app/Firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { objType } from "@/app/pages/login/snsLogin/sosialLogin";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { popuprHandler } from "@/app/handler/error/ErrorHandler";

export async function onGoogle() {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(authService, provider);
    // 구글 로그인 결과
    return {
      userId: result.user.uid,
      userName: result.user.displayName as string,
      service: result.user.providerData[0].providerId,
    };
  } catch {
    throw new Error("소셜 로그인 정보가 조회 되지 않습니다");
  }
}

export async function isSecondaryPw(id: string) {
  const docRef = await doc(db, "nickname", id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    // 이미 문서가 있는 지 체크
    if (docSnap.data().service !== "password" && docSnap.data().password) {
      return true;
      // 문서 안에 service 타입과 패스워드가 있는지 체크
    } else {
      return false;
      // 문서 안에 service 타입과 패스워드가 있는지 체크
    }
    // 이미 문서가 있는 지 체크
  } else {
    return false;
  }
}

export const useSecondaryHandler = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: objType) => {

      const isFalsy = Object.values(params).some((item) => {
        return !item;
      });

      if (isFalsy) {
        throw new Error("2차비밀번호 설정 중 에러가 발생하였습니다");
      }
      
      await setDoc(doc(db, "nickname", params.id), {
        id: params.id,
        password: params.pw,
        nickname: params.name,
        service: params.service,
        // 닉네임을 넣는 이유는 해당 uid가 어떤 유저의 것인지 알기 위함
        // 만약 nickname이 null 일 때 uid를 대신 넣어주기
      });
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: ["getuser"],
      });
      router.push("/pages/main");
    },
    onError: (error) => {
      popuprHandler({
        message: error.message,
      });
    },
  });
};
