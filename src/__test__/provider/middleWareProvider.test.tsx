import useUserQueryHook from "@/app/api_hooks/login/getUserHook";
import { isSecondaryPw } from "@/app/api_hooks/login/snsLogin/googleLogin";
import MainPage from "@/app/pages/main/page";
import MiddleWareProvider from "@/app/provider/middlewareProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, render, waitFor } from "@testing-library/react";
import { usePathname, useRouter } from "next/navigation";
import { popuprHandler } from "@/app/handler/error/ErrorHandler";
import { isPathHandler } from "@/app/handler/commonHandler";
import { authService } from "@/app/Firebase";

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
    refetch: jest.fn(),
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

jest.mock("@/app/handler/commonHandler", () => ({
  isPathHandler: jest.fn(),
}));

jest.mock("@/app/api_hooks/login/snsLogin/googleLogin", () => ({
  onGoogle: jest.fn(),
  isSecondaryPw: jest.fn(),
  useSecondaryHandler: jest.fn(),
}));

describe("SNS 계정 인 경우 2차 비밀번호 검증 테스트", () => {
  const queryClient = new QueryClient();

  beforeEach(() => {
    jest.clearAllMocks();

    render(
      <QueryClientProvider client={queryClient}>
        <MiddleWareProvider>
          <MainPage />
        </MiddleWareProvider>
      </QueryClientProvider>
    );
  });

  test("회원정보를 붏러오는 팝업 호출 테스트", async () => {
    (useUserQueryHook as jest.Mock).mockReturnValueOnce({
      data: null,
      error: null,
      isLoading: true,
    });

    (isPathHandler as jest.Mock).mockReturnValue(() => false);

    const isPathCheck = isPathHandler("/pages/main");
    const { data } = useUserQueryHook();

    if (!isPathCheck && !data) {
      expect(popuprHandler).toHaveBeenCalledWith({
        message: "회원정보를 불러오는 중입니다.",
      });
    }
  });

  test("유저 정보가 없을 시 pages/login으로 이동 테스트", () => {
    (usePathname as jest.Mock).mockReturnValueOnce("/pages/main");
    (useUserQueryHook as jest.Mock).mockReturnValueOnce({
      data: null,
      error: null,
      isLoading: false,
    });
    const { data } = useUserQueryHook();
    expect(data).toBeNull();

    expect(useRouter().push).toHaveBeenCalledWith("/pages/login");
  });

  test("유저 정보가 있고 2차 비밀번호 검증에 성공 했을 시 라우팅 유지", async () => {
    (usePathname as jest.Mock).mockReturnValueOnce("/pages/main");
    (useUserQueryHook as jest.Mock).mockReturnValue({
      data: { uid: "123", providerData: [{ providerId: "password" }] },
      error: null,
      isLoading: false,
      refetch: jest.fn(),
    });
    (isSecondaryPw as jest.Mock).mockResolvedValueOnce(true);

    const result = await isSecondaryPw("123");

    await waitFor(() => {
      expect(result).toBe(true);
    });

    const pathname = usePathname();
    expect(pathname).toBe("/pages/main");
  });

  test("검증에 실패 했을 시 로그인 페이지로 리다이렉트 되는지 확인", async () => {
    (useUserQueryHook as jest.Mock).mockReturnValue({
      data: { uid: "123", providerData: [{ providerId: "google" }] },
      error: null,
      isLoading: false,
      refetch: jest.fn(),
    });
    (usePathname as jest.Mock).mockReturnValueOnce("/pages/main");

    (isSecondaryPw as jest.Mock).mockResolvedValueOnce(false);

    (authService.signOut as jest.Mock).mockResolvedValueOnce(true);

    const result = await isSecondaryPw("123");
    await waitFor(() => {
      expect(result).toBe(false);
    });

    await waitFor(() => {
      if (!result) {
        useRouter().push("/pages/login");
        authService.signOut();
      }

      expect(useRouter().push).toHaveBeenCalledWith("/pages/login");
      expect(authService.signOut).toHaveBeenCalled();
    });
  });
});
