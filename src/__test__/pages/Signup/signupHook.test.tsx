import { LoginErrorHandler } from "@/app/api_hooks/login/LoginErrorHandler";
import { popuprHandler } from "@/app/handler/error/ErrorHandler";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

jest.mock("@/app/Firebase", () => ({
  authService: {},
}));

jest.mock("firebase/auth", () => ({
  createUserWithEmailAndPassword: jest.fn(),
  updateProfile: jest.fn(),
}));

jest.mock("firebase/firestore", () => ({
  setDoc: jest.fn(),
  // 뭔가를 return 하는 함수가 아님
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
  const queryClient = new QueryClient();
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("계정 생성 성공 테스트", async () => {
    (createUserWithEmailAndPassword as jest.Mock).mockResolvedValue({
      user: { uid: "123", displayName: "existingNickname" },
    });

    // 임시 계정 모킹
    const mutationHandler = jest.requireActual(
      "@/app/api_hooks/signup/signupHook"
    ).default;

    const { result } = renderHook(() => mutationHandler(), {
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
    // mutate 성공 했는 지 체크

    // expect.any(Object) : authService를 {} 로 모킹해서 object라고 넣음

    expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
      expect.any(Object),
      "test@example.com",
      "validPassword123"
    );

    // 계정 생성 후 기본 셋팅 검증
    expect(setDoc).toHaveBeenCalledWith(expect.any(Object), {
      id: "123",
      nickname: "existingNickname",
      service: "password",
    });

    // 계정 정보를 DB에 저장하는지 검증 (추후 회원탈퇴에 필요)

    expect(updateProfile).toHaveBeenCalledWith(
      expect.objectContaining({
        uid: "123",
      }),
      // USER 정보
      expect.objectContaining({
        displayName: "existingNickname",
        photoURL: "/img/default.svg",
      })
      // firebase 로그인이 아이디 & 비밀번호만으로 계정이 생성 되서 닉네임 추가를 수동으로 해줘야함
    );
    // 계정 생성 후 기본 셋팅 검증

    // 다 하고 라우팅 검증 과 환영 팝업 검증
    expect(useRouter().push).toHaveBeenCalledWith("/pages/main");
    expect(popuprHandler).toHaveBeenCalledWith({
      message: "회원가입을 환영합니다!",
    });
  });

  test("게정 생성 실패 테스트", async () => {
    const errorMessage = "회원가입 도중 에러가 발생하였습니다";

    (createUserWithEmailAndPassword as jest.Mock).mockRejectedValue(
      new Error(errorMessage)
    );

    (LoginErrorHandler as jest.Mock).mockReturnValue(null);

    // 임시 계정 모킹
    const mutationHandler = jest.requireActual(
      "@/app/api_hooks/signup/signupHook"
    ).default;

    const { result } = renderHook(() => mutationHandler(), {
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

    // 계정 생성 실패서 에러 팝업 출력 검증
    await waitFor(() => {
      expect(popuprHandler).toHaveBeenCalledWith({
        message: errorMessage,
      });
    });
  });
});
