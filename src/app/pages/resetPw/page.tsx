"use client";
import "@/app/_asset/Sign.scss";
import { authService } from "@/app/Firebase";
import { LoginErrorHandler } from "@/app/api_hooks/login/LoginErrorHandler";
import { sendPasswordResetEmail } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { popuprHandler } from "@/app/common/handler/error/ErrorHandler";
import { popupMessageStore } from "@/app/store/common";
import useUserQueryHook from "@/app/api_hooks/login/getUserHook";

const ResetPwPage = () => {
  const [findPw, setFindPw] = useState("");

  const { data } = useUserQueryHook();

  const isPopupClick = popupMessageStore().isClick;
  const msg = popupMessageStore().message;

  const router = useRouter();

  function routerHandler() {
    router.push("/pages/login");
  }

  useEffect(() => {
    if (!data) {
      popuprHandler({
        message: "비밀번호를 잊어버리셨나요?",
        type: "prompt",
        state: setFindPw,
      });
    }
  }, []);

  useEffect(() => {
    if (isPopupClick) {
      resetHandler();
    }
  }, [isPopupClick]);

  useEffect(() => {
    popupMessageStore.subscribe((state, prevState) => {
      const target = "비밀번호를 잊어버리셨나요?";
      if (prevState.message === target && state.message === "") {
        routerHandler();
      }
    });
  }, [msg]);

  const resetHandler = async () => {
    try {
      await sendPasswordResetEmail(authService, findPw);
      popuprHandler({ message: "입력하신 메일로 비밀번호 안내드렸습니다" });
      routerHandler();
    } catch (error) {
      const errorMessage = LoginErrorHandler((error as Error).message);
      if (errorMessage) {
        popuprHandler({ message: errorMessage });
      } else {
        popuprHandler({ message: "회원가입 도중 에러가 발생하였습니다" });
      }
    }
  };
};

export default ResetPwPage;
