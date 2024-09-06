"use client";
import "@/app/_asset/Sign.scss";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/stories/atoms/Button";
import { Input } from "@/stories/atoms/Input";
import SocialLogin from "./snsLogin/sosialLogin";
import Image from "next/image";
import useLoginHook from "@/app/api_hooks/login/setUserHook";

const LoginPage = () => {
  const [id, setId] = useState("");
  const [pw, setpw] = useState("");

  const router = useRouter();

  const loginMutation = useLoginHook();
  // 컴포넌트나 커스텀 훅의 내부에서만 호출

  function LoginHandler() {
    // mutation을 여기서 불러오면 안됨
    loginMutation.mutate({ id: id, pw: pw });
  }

  return (
    <div className="sign_wrap">
      <h1 className="logo">
        <Image src="/img/logo.svg" alt="로고" width={300} height={115} />
        <figcaption className="logo_title">J.log</figcaption>
      </h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          LoginHandler();
        }}
        className="sign-form"
      >
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
