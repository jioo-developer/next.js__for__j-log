import {
  popupInit,
  popuprHandler,
} from "@/app/common/handler/error/ErrorHandler";
import {
  isSecondaryPw,
  onGoogle,
  useSecondaryHandler,
} from "@/app/api_hooks/login/snsLogin/googleLogin";
import { popupMessageStore } from "@/app/store/common";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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

  const signupMutation = useSecondaryHandler();

  useEffect(() => {
    if (ispopupClick) {
      setSecondaryPw();
    }
  }, [ispopupClick]);

  async function LoginHandler() {
    try {
      const googleUser = await onGoogle();
      const isUserSecondPw = await isSecondaryPw(googleUser.userId);
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
        router.push("/pages/main");
      }
    } catch {
      popuprHandler({
        message: "로그인 정보가 조회 되지 않습니다",
      });
    }
  }

  async function setSecondaryPw() {
    const newObj = { ...userObj };
    newObj.pw = parseInt(pw);
    popupInit();
    await signupMutation.mutate(newObj);
  }

  return (
    <div className="sns_sign">
      <div className="blind"></div>
      <button className="sns-btn" name="google" onClick={LoginHandler}>
        <Image src="/img/google.svg" alt="구글 로그인" width={20} height={20} />
        <figcaption className="btn_title">구글로 시작하기</figcaption>
      </button>
      <button
        className="sns-btn"
        name="facebook"
        // onClick={onFacebook}
        // disabled={disabled}
      >
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
