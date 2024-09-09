"use client";
import "@/app/_asset/auth.scss";
import { FormEvent, useState } from "react";
import { Input } from "@/stories/atoms/Input";
import { Button } from "@/stories/atoms/Button";
import Image from "next/image";
import Checker from "@/stories/atoms/Checker";
import { useRouter } from "next/navigation";
import { popuprHandler } from "@/app/handler/error/ErrorHandler";
import useNameQueryHook from "@/app/api_hooks/common/getnameHook";
import useSignupHandler from "@/app/api_hooks/signup/signupHook";

const authData = [
  { id: "auth", text: "회원가입및 운영약관 동의", important: true },
  { id: "data", text: "개인정보 수집 및 동의", important: true },
  { id: "location", text: "위치정보 이용약관 동의", important: false },
];

const SignupPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [disable, setDisable] = useState(true);

  const router = useRouter();

  const { nicknameData, error, isLoading } = useNameQueryHook();

  const crateAccount = useSignupHandler();

  function accountHandler() {
    if (!error && nicknameData) {
      const isNamecheck = nicknameData.includes(nickname);
      if (isNamecheck) {
        popuprHandler({ message: "이미 사용중인 닉네임 입니다" });
      } else {
        crateAccount.mutate({
          email: email,
          password: password,
          nickname: nickname,
        });
      }
    }
  }

  return (
    <div className="Auth_wrap">
      <div className="title_area">
        <button onClick={() => router.push("/pages/login")}>
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
      <form
        className="auth-form"
        onSubmit={(e) => {
          e.preventDefault();
          accountHandler();
        }}
      >
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
        <Button
          width={"full"}
          theme="primary"
          className={disable ? "un_btn" : "btn"}
        >
          회원가입
        </Button>
      </form>
    </div>
  );
};

export default SignupPage;
