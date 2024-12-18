import useUserQueryHook from "@/app/api_hooks/login/getUserHook";
import {
  isSecondaryPw,
  onGoogle,
  useSecondaryHandler,
} from "@/app/api_hooks/login/snsLogin/googleLogin";
import { popuprHandler } from "@/app/handler/error/ErrorHandler";
import SocialLoginPage from "@/app/pages/login/snsLogin/sosialLogin";
import { popupMessageStore } from "@/app/store/common";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  act,
  fireEvent,
  render,
  renderHook,
  screen,
  waitFor,
} from "@testing-library/react";
import { setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { create } from "zustand";

jest.mock("@/app/Firebase", () => ({
  authService: {},
}));

jest.mock("firebase/auth", () => ({
  signInWithPopup: jest.fn(),
  GoogleAuthProvider: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
}));

jest.mock("@/app/api_hooks/login/snsLogin/googleLogin", () => ({
  isSecondaryPw: jest.fn(),
  onGoogle: jest.fn(),
  useSecondaryHandler: jest.fn(),
}));

(useSecondaryHandler as jest.Mock).mockReturnValue({ mutate: jest.fn() });

jest.mock("firebase/firestore", () => ({
  getDoc: jest.fn(),
  setDoc: jest.fn().mockResolvedValue(true),
  doc: jest.fn().mockReturnValue({}),
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

jest.mock("@/app/handler/error/ErrorHandler", () => ({
  popuprHandler: jest.fn(),
  popupInit: jest.fn(),
}));

const queryClient = new QueryClient();

const mockUser = {
  userId: "123",
  userName: "Test User",
  providerData: "goggle.com",
};

describe("구글 로그인 시 계정 조회 테스트", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    render(
      <QueryClientProvider client={queryClient}>
        <SocialLoginPage />
      </QueryClientProvider>
    );
  });

  test("버튼 클릭 시 함수 호출 테스트", async () => {
    const googleButton = screen.getByText("구글로 시작하기");
    await act(() => {
      fireEvent.click(googleButton);
    });
    expect(onGoogle).toHaveBeenCalled();
  });

  test("계정 조회 성공 테스트", async () => {
    (onGoogle as jest.Mock).mockResolvedValue(mockUser);

    const googleButton = screen.getByText("구글로 시작하기");

    await act(() => {
      fireEvent.click(googleButton);
    });

    await waitFor(() => {
      expect(onGoogle()).resolves.toEqual(mockUser);
    });
  });

  test("계정 조회 실패 테스트", async () => {
    const errorMessage = "소셜 로그인 정보가 조회 되지 않습니다";

    (onGoogle as jest.Mock).mockRejectedValue(new Error(errorMessage));

    const googleButton = screen.getByText("구글로 시작하기");

    await act(() => {
      fireEvent.click(googleButton);
    });

    await expect(onGoogle()).rejects.toThrow(errorMessage);

    await waitFor(() => {
      expect(popuprHandler).toHaveBeenCalledWith({
        message: errorMessage,
      });
    });
  });
});

describe("2차 비밀번호 설정 검증 테스트", () => {
  const mockUser = {
    id: "123",
    name: "Test User",
    userId: "123",
    userName: "Test User",
    service: "google.com",
    pw: 12345,
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    render(
      <QueryClientProvider client={queryClient}>
        <SocialLoginPage />
      </QueryClientProvider>
    );

    (onGoogle as jest.Mock).mockResolvedValue(mockUser);
  });

  test("이미 2차 비밀번호 존재 시 라우팅 테스트", async () => {
    (isSecondaryPw as jest.Mock).mockReturnValue(true);
    const { refetch } = useUserQueryHook();

    const googleButton = screen.getByText("구글로 시작하기");

    await act(() => {
      fireEvent.click(googleButton);
    });

    expect(refetch).toHaveBeenCalled();
    expect(useRouter().push).toHaveBeenCalledWith("/pages/main");
  });

  test("2차 비밀번호 미설정 시 설정 mutate 호출 테스트", async () => {
    (isSecondaryPw as jest.Mock).mockReturnValue(false);

    const googleButton = screen.getByText("구글로 시작하기");

    await act(() => {
      fireEvent.click(googleButton);
    });

    await waitFor(() => {
      expect(popuprHandler).toHaveBeenCalledWith({
        message: "회원탈퇴에 사용 될 2차 비밀번호를 입력해주세요.",
        type: "prompt",
        state: expect.any(Function),
      });
    });

    act(() => {
      popupMessageStore.setState({ isClick: true });
    });

    await waitFor(() => {
      expect(popupMessageStore.getState().isClick).toBe(true);
    });

    const mutateHandler = useSecondaryHandler();

    mutateHandler.mutate(mockUser);

    await waitFor(() => {
      expect(mutateHandler.mutate).toHaveBeenCalledWith(mockUser);
    });
  });

  test("2차 비밀번호 생성 성공 테스트", async () => {
    const mutationHandler = jest.requireActual(
      "@/app/api_hooks/login/snsLogin/googleLogin"
    ).useSecondaryHandler;

    const { result } = renderHook(() => mutationHandler(), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      ),
    });

    await act(async () => {
      result.current.mutate(mockUser);
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    await waitFor(() => {
      expect(setDoc).toHaveBeenCalledWith(expect.any(Object), {
        id: mockUser.id,
        password: mockUser.pw,
        nickname: mockUser.name,
        service: mockUser.service,
      });

      expect(useRouter().push).toHaveBeenCalledWith("/pages/main");
    });
  });

  test("2차 비밀번호 생성 실패 테스트", async () => {
    const errorMsg = "입력된 값에 오류가 있습니다. 다시 시도 해주세요";

    (setDoc as jest.Mock).mockRejectedValue(new Error(errorMsg));
    const mutationHandler = jest.requireActual(
      "@/app/api_hooks/login/snsLogin/googleLogin"
    ).useSecondaryHandler;

    const { result } = renderHook(() => mutationHandler(), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      ),
    });

    try {
      await act(async () => {
        result.current.mutate(mockUser);
      });
    } catch {
      popuprHandler({
        message: errorMsg,
      });
    }

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(false);
    });

    await waitFor(() => {
      expect(popuprHandler).toHaveBeenCalledWith({
        message: errorMsg,
      });
    });
  });
});
