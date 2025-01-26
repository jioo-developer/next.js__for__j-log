import { authService } from "../../../../Firebase";
import { popuprHandler } from "@/app/handler/error/ErrorHandler";
import deleteDB from "@/app/handler/quit/deleteDB";
import originDeleteHandler from "@/app/handler/quit/originquit";
import SocialDeleteHandler from "@/app/handler/quit/socialquit";
import isCredential from "@/app/handler/quit/userCredential/credentialHandler";
import QuitPage from "@/app/pages/member/quit/page";
import { popupMessageStore } from "@/store/common";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { User, deleteUser } from "firebase/auth";
import { useRouter } from "next/navigation";

jest.mock("@/app/Firebase", () => ({
  authService: {
    currentUser: expect.any(String),
  },
}));

jest.mock("firebase/auth", () => ({
  deleteUser: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
  }),
}));

jest.mock("@/app/handler/error/ErrorHandler", () => ({
  popuprHandler: jest.fn(),
  popupInit: jest.fn(),
}));

jest.mock("@/app/api_hooks/login/getUserHook", () => ({
  __esModule: true, // ES 모듈로 인식되도록 설정
  default: jest.fn().mockReturnValue({
    data: {
      uid: "123",
      email: "test@example.com",
    },
    error: null,
    isLoading: false,
  }),
}));

jest.mock("@/app/handler/quit/deleteDB", () => jest.fn());

jest.mock("@/app/handler/quit/socialquit", () => jest.fn());

jest.mock("@/app/handler/quit/originquit", () => jest.fn());

jest.mock("@/app/handler/quit/userCredential/credentialHandler", () =>
  jest.fn()
);

describe("회원탈퇴 로직 테스트", () => {
  const setQuitMock = jest.fn().mockReturnValue(true);
  const queryClient = new QueryClient();
  const user = expect.any(String);

  beforeEach(async () => {
    jest.clearAllMocks();

    render(
      <QueryClientProvider client={queryClient}>
        <QuitPage setQuit={setQuitMock} />
      </QueryClientProvider>
    );
  });

  test("isCredential이 'sosial'일 때 팝업 호출 테스트", async () => {
    (isCredential as jest.Mock).mockReturnValueOnce("sosial");

    const activeBtn = screen.getByText("확인");

    await act(async () => {
      fireEvent.click(activeBtn);
    });

    expect(popuprHandler).toHaveBeenCalledWith({
      message: "회원탈퇴에 사용 될 2차비밀번호를 입력 해주세요",
      type: "prompt",
      state: expect.any(Function),
    });
  });

  test("isCredential이 'origin'일 때 팝업 호출 테스트", async () => {
    (isCredential as jest.Mock).mockReturnValueOnce("origin");

    const activeBtn = screen.getByText("확인");

    await act(async () => {
      fireEvent.click(activeBtn);
    });

    expect(popuprHandler).toHaveBeenCalledWith({
      message: "로그인에 사용 되는 비밀번호를 입력 해주세요",
      type: "prompt",
      state: expect.any(Function),
    });
  });

  test("isSosial이 false 일 때 회원 탈퇴 성공 테스트", async () => {
    (isCredential as jest.Mock).mockReturnValueOnce("origin");
    const activeBtn = screen.getByText("확인");

    await act(async () => {
      fireEvent.click(activeBtn);
    });

    expect(popuprHandler).toHaveBeenCalledWith({
      message: "로그인에 사용 되는 비밀번호를 입력 해주세요",
      type: "prompt",
      state: expect.any(Function),
    });

    act(() => {
      popupMessageStore.setState({ isClick: true });
    });

    expect(deleteDB).toHaveBeenCalledWith(user);

    const Credential = await isCredential(user);

    if (Credential === "origin") {
      expect(originDeleteHandler).toHaveBeenCalled();
      await waitFor(() => {
        expect(deleteUser).toHaveBeenCalledWith(user);
        expect(useRouter().push).toHaveBeenCalledWith("/pages/login");
      });
    }
  });

  test("isSosial이 ture 일 때 회원 탈퇴 성공 테스트", async () => {
    (isCredential as jest.Mock).mockReturnValueOnce("sosial");

    const activeBtn = screen.getByText("확인");

    await act(async () => {
      fireEvent.click(activeBtn);
    });

    expect(popuprHandler).toHaveBeenCalledWith({
      message: "회원탈퇴에 사용 될 2차비밀번호를 입력 해주세요",
      type: "prompt",
      state: expect.any(Function),
    });

    act(() => {
      popupMessageStore.setState({ isClick: true });
    });

    expect(deleteDB).toHaveBeenCalledWith(user);

    const Credential = await isCredential(user);

    if (Credential === "sosial") {
      expect(SocialDeleteHandler).toHaveBeenCalled();
      await waitFor(() => {
        expect(deleteUser).toHaveBeenCalledWith(user);
        expect(useRouter().push).toHaveBeenCalledWith("/pages/login");
      });
    }
  });
  test("회원정보 삭제 실패 로직", async () => {
    const errorMsg = "회원 탈퇴에 실패하였습니다";
    (isCredential as jest.Mock).mockReturnValueOnce("sosial");

    (SocialDeleteHandler as jest.Mock).mockRejectedValue(new Error(errorMsg));

    const activeBtn = screen.getByText("확인");

    await act(async () => {
      fireEvent.click(activeBtn);
    });

    expect(popuprHandler).toHaveBeenCalledWith({
      message: "회원탈퇴에 사용 될 2차비밀번호를 입력 해주세요",
      type: "prompt",
      state: expect.any(Function),
    });

    act(() => {
      popupMessageStore.setState({ isClick: true });
    });

    expect(deleteDB).toHaveBeenCalledWith(user);

    const Credential = await isCredential(user);

    if (Credential === "sosial") {
      expect(SocialDeleteHandler).toHaveBeenCalled();

      await waitFor(() => {
        expect(popuprHandler).toHaveBeenCalledWith({
          message: errorMsg,
        });
      });
    }
  });
});
