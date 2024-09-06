"use client";
import "@/app/_asset/Sign.scss";
import { authService } from "@/app/Firebase";
import { LoginErrorHandler } from "@/app/api_hooks/login/LoginErrorHandler";
import { sendPasswordResetEmail } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { popuprHandler } from "@/app/handler/error/ErrorHandler";
import { popupMessageStore } from "@/app/store/common";
import useUserQueryHook from "@/app/api_hooks/login/getUserHook";

const ResetPwPage = () => {
  const [findPw, setFindPw] = useState("");

  const { data } = useUserQueryHook();

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
  }, [data]);

  // 팝업 취소 시 login 페이지로 라우팅
  const msg = popupMessageStore().message;

  useEffect(() => {
    popupMessageStore.subscribe((state, prevState) => {
      const target = "비밀번호를 잊어버리셨나요?";
      if (prevState.message === target && state.message === "") {
        routerHandler();
      }
    });
  }, [msg]);

  // 팝업 취소 시 login 페이지로 라우팅

  // 팝업 확인 누를 시 비밀번호 찾기 로직 실행

  const isPopupClick = popupMessageStore().isClick;

  useEffect(() => {
    if (isPopupClick) {
      resetHandler();
    }
  }, [isPopupClick]);

  // 팝업 확인 누를 시 비밀번호 찾기 로직 실행

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
