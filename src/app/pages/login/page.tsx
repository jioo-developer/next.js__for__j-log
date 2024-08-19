"use client";
import "@/app/_asset/Sign.scss";
import { FormEvent, useState } from "react";
import { authService } from "@/app/Firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import useUserQueryHook from "@/app/api_hooks/login/getUserHook";
import { useRouter } from "next/navigation";
import { Button } from "@/stories/atoms/Button";
import { Input } from "@/stories/atoms/Input";
import SocialLogin from "./snsLogin/sosialLogin";
import Image from "next/image";
import { LoginErrorHandler } from "@/app/api_hooks/login/LoginErrorHandler";
import { errorHandler } from "@/app/common/handler/error/ErrorHandler";

const LoginPage = () => {
  const { data, refetch } = useUserQueryHook();
  const router = useRouter();

  const [id, setId] = useState("");
  const [pw, setpw] = useState("");

  function LoginHandler(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    signInWithEmailAndPassword(authService, id, pw)
      .then(() => {
        refetch();
        router.push("/");
      })
      .catch((error) => {
        const errorMessage = LoginErrorHandler(error.message);
        errorHandler(errorMessage);
      });
  }

  if (data) {
    router.push("/");
  }

  return (
    <div className="sign_wrap">
      <h1 className="logo">
        <Image src="/img/logo.svg" alt="로고" width={300} height={115} />
        <figcaption className="logo_title">J.log</figcaption>
      </h1>
      <form onSubmit={LoginHandler} className="sign-form">
        <Input
          type="id"
          width={375}
          height={45}
          fontSize={14}
          setstate={setId}
        />
        <Input
          type="password"
          width={375}
          height={45}
          fontSize={14}
          setstate={setpw}
        />
        <Button width={375} height={45} fontSize={18} theme="primary">
          로그인
        </Button>
      </form>
      {/* 소셜 로그인 */}
      <SocialLogin />
      {/* 비밀번호 찾기 및 회원가입 */}
      <div className="assistance">
        <Button
          className="pw_reset ass_btn noShadow"
          width={120}
          onClick={() => router.push("/pages/resetPw")}
        >
          비밀번호 변경&amp;찾기
        </Button>
        <Button
          className="ass_auth ass_btn noShadow text-right"
          onClick={() => router.push("/pages/signup")}
        >
          회원가입
        </Button>
      </div>
    </div>
  );
};

export default LoginPage;
