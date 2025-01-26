import { popupInit, popuprHandler } from "@/app/handler/error/ErrorHandler";
import {
  isSecondaryPw,
  onGoogle,
  useSecondaryHandler,
} from "@/app/api_hooks/login/snsLogin/googleLogin";
import { popupMessageStore } from "@/store/common";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useUserQueryHook from "@/app/api_hooks/login/getUserHook";

export type objType = {
  id: string;
  name: string;
  service: string;
  pw?: number;
};

const SocialLoginPage = () => {
  const [pw, setPw] = useState("");
  const [userObj, setObj] = useState<objType>({
    id: "",
    name: "",
    service: "",
  });

  const router = useRouter();

  const ispopupClick = popupMessageStore().isClick;

  const setSecondPw = useSecondaryHandler();

  const { refetch } = useUserQueryHook();

  useEffect(() => {
    if (ispopupClick) {
      popupInit();
      const newObj = { ...userObj };
      newObj.pw = parseInt(pw);
      setSecondPw.mutate(newObj);
    }
  }, [ispopupClick]);

  async function LoginHandler() {
    try {
      const googleUser = await onGoogle();
      // 구글로그인이 맞는지 검증
      const isUserSecondPw = await isSecondaryPw(googleUser.userId);
      // 초기 2차 비밀번호가 설정 되었는 지 검증
      if (!isUserSecondPw) {
        popuprHandler({
          message: "회원탈퇴에 사용 될 2차 비밀번호를 입력해주세요.",
          type: "prompt",
          state: setPw,
        });
        setObj({
          id: googleUser.userId,
          name: googleUser.userName,
          service: googleUser.service,
        });
      } else {
        refetch();
        router.push("/pages/main");
      }
    } catch (error) {
      popuprHandler({
        message: (error as Error).message,
      });
    }
  }

  return (
    <div className="sns_sign">
      <button className="sns-btn" name="google" onClick={LoginHandler}>
        <Image src="/img/google.svg" alt="구글 로그인" width={20} height={20} />
        <figcaption className="btn_title">구글로 시작하기</figcaption>
      </button>
      <button className="sns-btn" name="facebook">
        <Image
          src="/img/facebook.svg"
          alt="페이스북 로그인"
          width={20}
          height={20}
        />
        <figcaption className="btn_title">페이스북으로 시작하기</figcaption>
      </button>
    </div>
  );
};

export default SocialLoginPage;
