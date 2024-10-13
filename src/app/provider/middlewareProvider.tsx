"use client";
import { useEffect } from "react";
import useUserQueryHook from "../api_hooks/login/getUserHook";
import { popupInit, popuprHandler } from "../handler/error/ErrorHandler";
import { isSecondaryPw } from "../api_hooks/login/snsLogin/googleLogin";
import { childrenProps } from "../type_global/commonType";
import { User } from "firebase/auth";
import { authService } from "../Firebase";
import { usePathname, useRouter } from "next/navigation";

const MiddleWareProvider = ({ children }: childrenProps) => {
  const { data, refetch, isLoading } = useUserQueryHook();

  const router = {
    pathname: usePathname(),
    handler: useRouter(),
  };

  useEffect(() => {
    if (router.pathname === "/pages/login" || router.pathname === "/pages/main")
      popupInit();
  }, [router.pathname]);

  const exceptionPatmName = ["/", "/pages/login", "/pages/signup"];

  useEffect(() => {
    if (isLoading) {
      if (!exceptionPatmName.includes(router.pathname) && !data) {
        popuprHandler({ message: "회원정보를 불러 오는 중입니다." });
      }
    } else {
      if (!data) {
        router.handler.push("/pages/login");
      } else {
        isSecondaryPw((data as User).uid).then((result) => {
          // result = true면 통과
          if (!result) {
            router.handler.push("/pages/login");
            authService.signOut().then(() => {
              refetch();
            });
          }
        });
      }
    }
  }, [data, isLoading]);

  return <>{children}</>;
};

export default MiddleWareProvider;
