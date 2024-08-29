import { authService, db } from "@/app/Firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { objType } from "../../../pages/login/snsLogin/sosialLogin";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { popuprHandler } from "@/app/common/handler/error/ErrorHandler";

export async function onGoogle() {
  const provider = new GoogleAuthProvider();
  const result = (await signInWithPopup(authService, provider)).user;
  // 구글 로그인 결과
  if (result) {
    const { userId, userName, service } = {
      userId: result.uid,
      userName: result.displayName as string,
      service: result.providerData[0].providerId,
    };
    return { userId, userName, service };
  } else {
    throw new Error("구글 로그인에 실패하였습니다");
  }
}

export async function isSecondaryPw(id: string) {
  const docRef = await doc(db, "nickname", id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    // 이미 문서가 있는 지 체크
    if (docSnap.data().service && docSnap.data().password) {
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
    onError: () => {
      popuprHandler({
        message: "2차비밀번호 설정 중 에러가 발생하였습니다",
      });
    },
  });
};
