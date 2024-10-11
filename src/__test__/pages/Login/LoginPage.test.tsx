import useUserQueryHook from "@/app/api_hooks/login/getUserHook";
import useLoginHook from "@/app/api_hooks/login/setUserHook";
import { popuprHandler } from "@/app/handler/error/ErrorHandler";
import LoginPage from "@/app/pages/login/page";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  fireEvent,
  render,
  waitFor,
  screen,
  renderHook,
  act,
} from "@testing-library/react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";

jest.mock("@/app/Firebase", () => ({
  authService: {},
}));

jest.mock("firebase/auth", () => ({
  signInWithEmailAndPassword: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
  }),
}));

jest.mock("@/app/api_hooks/login/getUserHook", () => ({
  __esModule: true, // ES 모듈로 인식되도록 설정
  default: jest.fn().mockReturnValue({
    data: null, // 모의 데이터 반환
    error: null,
    isLoading: false,
  }),
}));

jest.mock("@/app/api_hooks/login/setUserHook", () => jest.fn());

jest.mock("@/app/handler/error/ErrorHandler", () => ({
  popuprHandler: jest.fn(),
}));

const getElementsHandler = () => {
  const id = screen.getByPlaceholderText(
    "아이디를 입력하세요."
  ) as HTMLInputElement;
  const password = screen.getByPlaceholderText(
    "비밀번호를 8자리 이상 입력하세요."
  ) as HTMLInputElement;
  const loginBtn = screen.getByText("로그인");
  const resetBtn = screen.getByText("비밀번호 변경&찾기");
  const signupBtn = screen.getByText("회원가입");

  return { id, password, loginBtn, resetBtn, signupBtn };
};

describe("로그인 페이지 테스트", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <LoginPage />
      </QueryClientProvider>
    );

    const { data } = useUserQueryHook();
    expect(data).toBe(null);
  });

  test("입력 상태가 올바르게 업데이트 되는 지 확인합니다.", () => {
    const { id, password } = getElementsHandler();

    fireEvent.change(id, { target: { value: "user@test.com" } });
    fireEvent.change(password, { target: { value: "password123" } });

    expect(id.value).toBe("user@test.com");
    expect(password.value).toBe("password123");
  });

  test("로그인 함수 호출에 성공하는 지 테스트 합니다.", async () => {
    (useLoginHook as jest.Mock).mockReturnValue({
      mutate: jest.fn(),
    });

    const { id, password, loginBtn } = getElementsHandler();
    fireEvent.change(id, { target: { value: "user@test.com" } });
    fireEvent.change(password, { target: { value: "password123" } });

    fireEvent.click(loginBtn);

    await waitFor(() => {
      expect(useLoginHook().mutate).toHaveBeenCalledWith({
        id: "user@test.com",
        pw: "password123",
      });
    });
  });

  test("로그인에 성공 하면 동작하는 로직을 테스트 합니다.", async () => {
    const LoginHook = jest.requireActual(
      "@/app/api_hooks/login/setUserHook"
    ).default;

    (signInWithEmailAndPassword as jest.Mock).mockResolvedValue({
      user: { uid: "123" },
    });

    const queryClient = new QueryClient();

    const refetchQueriesSpy = jest
      .spyOn(queryClient, "refetchQueries")
      .mockResolvedValue();

    const { result } = renderHook(() => LoginHook(), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      ),
    });

    act(() => {
      result.current.mutate({
        id: "test@example.com",
        pw: "password123",
      });
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(refetchQueriesSpy).toHaveBeenCalledWith({
      queryKey: ["getuser"],
    });

    expect(useRouter().push).toHaveBeenCalledWith("/pages/main");

    refetchQueriesSpy.mockRestore();
  });

  test("로그인에 실패 하면 동작하는 로직을 테스트 합니다.", async () => {
    const LoginHook = jest.requireActual(
      "@/app/api_hooks/login/setUserHook"
    ).default;

    (signInWithEmailAndPassword as jest.Mock).mockRejectedValue(
      new Error("auth/wrong-password")
    );

    const queryClient = new QueryClient();

    const { result } = renderHook(() => LoginHook(), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      ),
    });

    act(() => {
      result.current.mutate({
        id: "wronguser@example.com",
        pw: "wrongpassword",
      });
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(popuprHandler).toHaveBeenCalledWith({
      message: "아이디 또는 비밀번호가 맞지 않습니다.",
    });
  });
});
