"use client";
import { useEffect } from "react";
import useUserQueryHook from "../api_hooks/login/getUserHook";
import { popupInit, popuprHandler } from "../handler/error/ErrorHandler";
import { isSecondaryPw } from "../api_hooks/login/snsLogin/googleLogin";
import { childrenProps } from "../type_global/commonType";
import { User } from "firebase/auth";
import { authService } from "../Firebase";
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
      if (!result) {
        router.handler.push("/pages/login");
        authService.signOut().then(() => {
          refetch();
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
    } else {
      popupInit();
      if (!data) {
        router.handler.push("/pages/login");
      } else {
        isSecondaryHandler();
      }
    }
  }, [data, isLoading]);

  return <>{children}</>;
};

export default MiddleWareProvider;
