'use client'
import { FormEvent, useEffect, useState } from "react";
import "@/app/_asset/Sign.scss";
import { authService } from "@/app/Firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import userQueryHook from "./getUserHook";
function Sign() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const { data } = userQueryHook(); 

 function LoginLogic(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    signInWithEmailAndPassword(authService,id,password).then(()=>{}).catch((error)=>{
      const errorMessage = error.message;
      window.alert(errorMessage)
    })
  }


  return (
    <>
      <div className="sign_wrap">
        <h1 className="logo">
          <img src="/img/logo.svg" alt="" />
          <figcaption className="logo_title">J.log</figcaption>
        </h1>
        <form onSubmit={LoginLogic} className="sign-form">
          <input
            type="text"
            className="form-control"
            name="id"
            placeholder="아이디"
            required
            autoComplete="off"
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
          <input
            type="password"
            className="form-control"
            name="password"
            autoComplete="off"
            placeholder="비밀번호"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="btn" disabled={data ? true : false}>
            로그인
          </button>
        </form>
      </div>
    </>
  );
}

export default Sign;