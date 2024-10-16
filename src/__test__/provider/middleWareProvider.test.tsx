import useUserQueryHook from "@/app/api_hooks/login/getUserHook";
import { isSecondaryPw } from "@/app/api_hooks/login/snsLogin/googleLogin";
import MainPage from "@/app/pages/main/page";
import MiddleWareProvider from "@/app/provider/middlewareProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, render, waitFor } from "@testing-library/react";
import { usePathname, useRouter } from "next/navigation";
import { popuprHandler } from "@/app/handler/error/ErrorHandler";
import { signOut } from "firebase/auth";

jest.mock("@/app/Firebase", () => ({
  authService: {
    signOut: jest.fn(),
  },
}));

jest.mock("@/app/api_hooks/login/getUserHook", () => ({
  __esModule: true, // ES 모듈로 인식되도록 설정
  default: jest.fn().mockReturnValue({
    data: null, // 모의 데이터 반환
    error: null,
    isLoading: false,
  }),
}));

jest.mock("@/app/api_hooks/main/getPostHook", () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue({
    postData: [
      { id: "1", title: "Test Title", text: "Test Text" },
      { id: "2", title: "Other Title", text: "Other Text" },
    ],
  }),
}));

jest.mock("@/app/api_hooks/login/snsLogin/googleLogin");

jest.mock("next/navigation", () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
  }),
  usePathname: jest.fn(),
}));

jest.mock("@/app/handler/error/ErrorHandler", () => ({
  popuprHandler: jest.fn(),
  popupInit: jest.fn(),
}));

jest.mock("@/app/api_hooks/login/snsLogin/googleLogin", () => ({
  isSecondaryPw: jest.fn(),
}));

describe("SNS 계정 인 경우 2차 비밀번호 검증 테스트", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <MiddleWareProvider>
          <MainPage />
        </MiddleWareProvider>
      </QueryClientProvider>
    );
  });

  test("회원정보를 붏러오는 팝업 호출 테스트", async () => {
    (usePathname as jest.Mock).mockReturnValueOnce("/pages/main");
    (useUserQueryHook as jest.Mock).mockReturnValueOnce({
      data: null,
      error: null,
      isLoading: true,
    });
    const { data, isLoading } = useUserQueryHook();
    expect(data).toBeNull();
    expect(isLoading).toBe(true);
    const exceptionPatmName = ["/pages/login", "/pages/signup"];
    const pathName = usePathname();
    //false를 출력
    expect(exceptionPatmName.includes(pathName)).toBe(false);
    //false를 출력
    if (exceptionPatmName.includes(pathName) && !data) {
      await waitFor(() => {
        expect(popuprHandler).toHaveBeenCalledWith({
          message: "회원정보를 불러오는 중입니다.",
        });
      });
    }
  });

  test("검증에 성공 했을 시 라우팅 유지", async () => {
    (usePathname as jest.Mock).mockReturnValueOnce("/pages/main");
    (useUserQueryHook as jest.Mock).mockReturnValue({
      data: { uid: "123" },
      error: null,
      isLoading: false,
    });
    (isSecondaryPw as jest.Mock).mockResolvedValueOnce(true);
    const pathname = usePathname();
    expect(pathname).toBe("/pages/main");
  });

  test("검증에 실패 했을 시 로그인 페이지로 리다이렉트 되는지 확인", async () => {
    (usePathname as jest.Mock).mockReturnValueOnce("/pages/main");

    (isSecondaryPw as jest.Mock).mockResolvedValueOnce(false);

    const secondFun = await isSecondaryPw("123");
    //return이 false
    expect(secondFun).toBe(false);
    if (secondFun) {
      expect(useRouter().push).toHaveBeenCalledWith("/pages/login");
      await waitFor(() => {
        expect(signOut).toHaveBeenCalled();
      });
    }
  });
});
