import { LoginErrorHandler } from "@/app/api_hooks/login/LoginErrorHandler";
import useSignupHandler from "@/app/api_hooks/signup/signupHook";
import { popuprHandler } from "@/app/handler/error/ErrorHandler";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { setDoc } from "firebase/firestore";

jest.mock("@/app/Firebase", () => ({
  authService: {},
}));

jest.mock("firebase/auth", () => ({
  createUserWithEmailAndPassword: jest.fn(),
  updateProfile: jest.fn().mockResolvedValue(true),
}));

jest.mock("firebase/firestore", () => ({
  setDoc: jest.fn().mockResolvedValue(true),
  doc: jest.fn().mockReturnValue({}),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
  }),
}));

jest.mock("@/app/handler/error/ErrorHandler", () => ({
  popuprHandler: jest.fn(),
}));

jest.mock("@/app/api_hooks/login/LoginErrorHandler", () => ({
  LoginErrorHandler: jest.fn(),
}));

describe("회원가입 페이지 로직 테스트", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("계정 생성이 성공 했는지 확인합니다.", async () => {
    (createUserWithEmailAndPassword as jest.Mock).mockResolvedValue({
      user: { uid: "123", displayName: "existingNickname" },
    });

    const queryClient = new QueryClient();
    const { result } = renderHook(() => useSignupHandler(), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      ),
    });

    act(() => {
      result.current.mutate({
        email: "test@example.com",
        password: "validPassword123",
        nickname: "existingNickname",
      });
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
      expect.any(Object), // authService 객체
      "test@example.com",
      "validPassword123"
    );

    expect(setDoc).toHaveBeenCalledWith(expect.any(Object), {
      id: "123",
      nickname: "existingNickname",
      service: "password",
    });
    expect(updateProfile).toHaveBeenCalledWith(
      expect.objectContaining({
        uid: "123", // 혹은 user 객체의 필드를 정확히 입력
      }),
      expect.objectContaining({
        displayName: "existingNickname",
      })
    );

    const mockRouter = require("next/navigation").useRouter();
    expect(mockRouter.push).toHaveBeenCalledWith("/pages/main");
  });

  test("게정 생성이 실패 했을 때를 테스트 합니다.", async () => {
    const errorMessage = "회원가입 도중 에러가 발생하였습니다";

    (createUserWithEmailAndPassword as jest.Mock).mockRejectedValue(
      new Error(errorMessage)
    );

    (LoginErrorHandler as jest.Mock).mockReturnValue(null);

    const queryClient = new QueryClient();
    const { result } = renderHook(() => useSignupHandler(), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      ),
    });

    act(() => {
      result.current.mutate({
        email: "test@example.com",
        password: "validPassword123",
        nickname: "existingNickname",
      });
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(false);
    });

    await waitFor(() => {
      expect(LoginErrorHandler).toHaveBeenCalledWith(errorMessage);
      expect(popuprHandler).toHaveBeenCalledWith({
        message: errorMessage,
      });
    });
  });
});
