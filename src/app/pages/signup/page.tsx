"use client";
import "@/app/_asset/auth.scss";
import { FormEvent, useState } from "react";
import { Input } from "@/stories/atoms/Input";
import { Button } from "@/stories/atoms/Button";
import Image from "next/image";
import Checker from "@/stories/atoms/Checker";
import { Popup } from "@/stories/atoms/Popup";
import { popupMessageStore } from "@/app/store/common";
import signupHandler from "@/app/common/handler/signupHandler";
import { useRouter } from "next/navigation";
import useUserQueryHook from "@/app/api_hooks/login/getUserHook";
import useNickQueryHook from "@/app/api_hooks/signup/getNicknamehooks";
import nicknameHandler from "@/app/common/handler/nickname/nicknameCheckHandler";
import { errorHandler } from "@/app/common/handler/error/ErrorHandler";

const authData = [
  { id: "auth", text: "회원가입및 운영약관 동의", important: true },
  { id: "data", text: "개인정보 수집 및 동의", important: true },
  { id: "location", text: "위치정보 이용약관 동의", important: false },
];

const SignupPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [disable, setDisable] = useState(false);

  const msg = popupMessageStore();
  const router = useRouter();

  const { nicknameData } = useNickQueryHook();
  const { isLoading, refetch } = useUserQueryHook();

  function isNickName(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (nicknameHandler({ nicknameData, nickname })) {
      errorHandler("이미 사용중인 닉네임 입니다");
      setNickname("");
    } else {
      createAccount(email, password, nickname);
    }
  }

  async function createAccount(
    email: string,
    password: string,
    nickname: string
  ) {
    const signupResult = await signupHandler(email, password, nickname);
    if (signupResult) {
      refetch();
      router.push("/pages/main");
      errorHandler("회원가입을 환영합니다!");
    }
  }

  return (
    <div className="Auth_wrap">
      <div className="title_area">
        <button onClick={() => router.push("/")}>
          <Image
            src="/img/backbtn.svg"
            className="close"
            width={30}
            height={30}
            alt=""
          />
        </button>
        <p>회원가입</p>
      </div>
      <form className="auth-form" onSubmit={(e) => isNickName(e)}>
        <p className="id_title">
          이메일&nbsp;<span>*</span>
        </p>
        <Input
          type="id"
          width={375}
          height={45}
          fontSize={16}
          setstate={setEmail}
        />
        <p className="warning">
          ※ 실제 사용하시는 이메일을 사용하셔야 비밀번호를 찾으실 수 있습니다.
        </p>
        <p className="id_title">
          비밀번호&nbsp;<span>*</span>
        </p>
        <Input
          type="password"
          width={375}
          height={45}
          fontSize={16}
          setstate={setPassword}
        />
        <p className="id_title">
          닉네임 &nbsp;<span>*</span>
        </p>
        <Input
          type="text"
          width={375}
          height={45}
          fontSize={16}
          setstate={setNickname}
        />
        <Checker allcheck items={authData} setState={setDisable} />
        {!isLoading && (
          <Button
            width={"full"}
            theme="primary"
            disable={disable}
            className={disable ? "un_btn" : "btn"}
          >
            회원가입
          </Button>
        )}
      </form>
      {msg.message !== "" && <Popup rightAlign top />}
    </div>
  );
};

export default SignupPage;
