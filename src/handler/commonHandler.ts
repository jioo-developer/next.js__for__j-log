import { usePathname, useRouter } from "next/navigation";
import { authService } from "../../Firebase";
import { QueryClient } from "@tanstack/react-query";
import useUserQueryHook from "../api_hooks/login/getUserHook";

// 시간 함수
const time = new Date();
export const timeData = {
  year: time.getFullYear(),
  month: time.getMonth() + 1,
  day: time.getDate(),
};

// 쿠키 셋팅 함수
export function cookieHandler(name: string) {
  const time = new Date();
  const result = new Date(
    time.getFullYear(),
    time.getMonth(),
    time.getDate(),
    23,
    59,
    59
  );
  result.setMilliseconds(999);
  result.setHours(result.getHours() + 9);
  document.cookie = `${name}-Cookie=${encodeURIComponent("done")}; expires=${result.toUTCString()};`;
}

// 공백을 허용하지 않는 이메일 검증 정규식
export const validateEmail = (email: string) => {
  const regex =
    /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/;
  // 이메일에 공백이 있는지 확인하고 공백이 없고, 정규식이 일치하면 true 반환
  return !/\s/.test(email) && regex.test(email);
};

export function useLogOut() {
  const router = useRouter();
  const queryClient = new QueryClient();
  const { refetch } = useUserQueryHook();

  // 로그아웃 기능을 제공하는 함수
  return async function () {
    await authService.signOut();
    refetch();
    queryClient.clear();
    router.push("/pages/login");
  };
}

export function isPathHandler(pathname: string) {
  return function () {
    const isShowPathname = ["/", "/pages/login", "/pages/signup"];
    return isShowPathname.includes(pathname);
  };
}

export const convertPrice = (price: number): string => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
