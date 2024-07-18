'use client'
import { FormEvent, useState } from "react";
import "@/app/_asset/Sign.scss";
import { authService } from "@/app/Firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import userQueryHook from "../../_hooks/_login/getUserHook";
import { useRouter } from "next/navigation";
import { Button } from "@/stories/atoms/Button";
import { Input } from "@/stories/atoms/Input";
import SocialLogin from "./sosialLogin";
function LoginPage() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const { refetch } = userQueryHook(); 
  const router = useRouter();

 function LoginHandler(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    signInWithEmailAndPassword(authService,id,password).then(()=>{
      refetch()
      router.push('/')
    }).catch((error)=>{
      const errorMessage = error.message;
      window.alert(errorMessage)
    })
  }

  return (
      <div className="sign_wrap">
        <h1 className="logo">
          <img src="/img/logo.svg" alt="" />
          <figcaption className="logo_title">J.log</figcaption>
        </h1>
        <form onSubmit={LoginHandler} className="sign-form">
          <Input type="id" setState={setId} width={375} height={45} fontSize={18} />
          <Input type="password" setState={setPassword} width={375} height={45} fontSize={18} />
          <Button width={375} height={45} fontSize={18} theme="primary">로그인</Button>
        </form>
        {/* 소셜 로그인 */}
        <SocialLogin />
        {/* 비밀번호 찾기 및 회원가입 */}
        <div className="assistance">
            <button className="pw_reset ass_btn">비밀번호 변경&amp;찾기</button>
            <button className="ass_auth ass_btn">회원가입</button>
          </div>
      </div>
  );
}

export default LoginPage;