import useUserQueryHook from "@/app/api_hooks/login/getUserHook";
import useLoginHook from "@/app/api_hooks/login/setUserHook";
import { authService } from "@/app/Firebase";
import { useLogOut } from "@/app/handler/commonHandler";
import { popuprHandler } from "@/app/handler/error/ErrorHandler";
import LoginPage from "@/app/pages/login/page";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  fireEvent,
  render,
  waitFor,
  renderHook,
  act,
} from "@testing-library/react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { commonHandler, getElementsHandler } from "./utils";

jest.mock("@/app/Firebase", () => ({
  authService: {
    signOut: jest.fn(), // signOut 함수를 모킹
  },
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
    refetch: jest.fn(),
  }),
}));

jest.mock("@/app/api_hooks/login/setUserHook", () => jest.fn());

(useLoginHook as jest.Mock).mockReturnValue({
  mutate: jest.fn(),
});

jest.mock("@/app/handler/error/ErrorHandler", () => ({
  popuprHandler: jest.fn(),
}));

const queryClient = new QueryClient();

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

  test("입력 상태가 올바르게 업데이트 되는 지 테스트", () => {
    const { id, password } = getElementsHandler();

    fireEvent.change(id, { target: { value: "user@test.com" } });
    fireEvent.change(password, { target: { value: "password123" } });

    expect(id.value).toBe("user@test.com");
    expect(password.value).toBe("password123");
  });

  test("로그인 함수 호출에 성공하는 지 테스트", async () => {
    const { id, password, loginBtn } = getElementsHandler();
    fireEvent.change(id, { target: { value: "user@test.com" } });
    fireEvent.change(password, { target: { value: "password123" } });

    fireEvent.click(loginBtn);

    const mutation = useLoginHook();

    await waitFor(() => {
      expect(mutation.mutate).toHaveBeenCalledWith({
        id: "user@test.com",
        pw: "password123",
      });
    });
  });

  test("로그인에 성공 하면 동작하는 로직 테스트", async () => {
    (signInWithEmailAndPassword as jest.Mock).mockResolvedValue({
      user: { uid: "123" },
    });

    const refetchQueriesSpy = jest
      .spyOn(queryClient, "refetchQueries")
      .mockResolvedValue();

    const result = commonHandler(queryClient);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(refetchQueriesSpy).toHaveBeenCalledWith({
      queryKey: ["getuser"],
    });

    expect(useRouter().push).toHaveBeenCalledWith("/pages/main");

    refetchQueriesSpy.mockRestore();
  });

  test("로그인에 실패 하면 동작하는 로직을 테스트", async () => {
    (signInWithEmailAndPassword as jest.Mock).mockRejectedValue(
      new Error("auth/wrong-password")
    );

    const result = commonHandler(queryClient);

    await waitFor(() => {
      expect(result.current.isError).toBe(true);

      expect(popuprHandler).toHaveBeenCalledWith({
        message: "아이디 또는 비밀번호가 맞지 않습니다.",
      });
    });
  });
});

describe("로그아웃 로직 테스트", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // 각 테스트 전에 모든 모킹을 초기화
  });

  test("로그아웃 기능이 성공적으로 호출되는지 테스트", async () => {
    // useLogOut 훅을 테스트 환경에서 실행
    const { result } = renderHook(() => useLogOut(), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      ),
    });

    // logOut 함수 실행
    await act(async () => {
      await result.current();
    });

    expect(authService.signOut).toHaveBeenCalled();

    // refetch 함수가 호출되었는지 확인
    expect(useUserQueryHook().refetch).toHaveBeenCalled();

    // router.push가 로그인 페이지로 이동했는지 확인
    expect(useRouter().push).toHaveBeenCalledWith("/pages/login");
  });
});
