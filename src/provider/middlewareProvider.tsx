"use client";
import { useEffect } from "react";
import useUserQueryHook from "../api_hooks/login/getUserHook";
import { popupInit, popuprHandler } from "../handler/error/ErrorHandler";
import { isSecondaryPw } from "../api_hooks/login/snsLogin/googleLogin";
import { childrenProps } from "../type/commonType";
import { User } from "firebase/auth";
import { authService } from "../app/Firebase";
import { usePathname, useRouter } from "next/navigation";
import { isPathHandler } from "../handler/commonHandler";

const MiddleWareProvider = ({ children }: childrenProps) => {
  const { data, refetch, isLoading } = useUserQueryHook();

  const router = {
    pathname: usePathname(),
    handler: useRouter(),
  };

  const isSecondaryHandler = () => {
    const handler = async () => {
      const result = await isSecondaryPw((data as User).uid);
      // 2차 비밀번호 설정 검증 함수
      if (!result) {
        router.handler.push("/pages/login");
        // 검증에 실패 했을 시 로그인 페이지로 이동
        authService.signOut().then(() => {
          refetch();
          // 이동 후 로그아웃 & refetch
        });
      }
    };
    return handler();
  };

  useEffect(() => {
    if (isLoading) {
      if (!isPathHandler(router.pathname) && !data) {
        popuprHandler({ message: "회원정보를 불러 오는 중입니다." });
      }
      // 유저 정보를 불러 올 시 팝업 노출
    } else {
      popupInit();
      // 팝업 CLOSE
      if (!data) {
        router.handler.push("/pages/login");
        // 유저 정보가 없을 시 로그인 페ㅣ이지로 이동
      } else {
        const providerId = data.providerData[0].providerId;
        if (providerId !== "password") {
          isSecondaryHandler();
        }
        // 소셜 로그인시 최초 2차 비밀번호 생성 검증 함수로 이동
      }
    }
  }, [data, isLoading]);

  return <>{children}</>;
};

export default MiddleWareProvider;
