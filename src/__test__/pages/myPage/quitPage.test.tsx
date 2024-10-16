import { popuprHandler } from "@/app/handler/error/ErrorHandler";
import { deleteUserDB } from "@/app/handler/quit/deleteDB";
import originDeleteHandler from "@/app/handler/quit/originquit";
import SocialDeleteHandler from "@/app/handler/quit/socialquit";
import { isCredential } from "@/app/handler/quit/userCredential/credentialHandler";
import QuitPage from "@/app/pages/member/quit/page";
import { popupMessageStore } from "@/app/store/common";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { User } from "firebase/auth";
import { create } from "zustand";

jest.mock("@/app/Firebase", () => ({
  authService: {},
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
  }),
}));

jest.mock("@/app/handler/error/ErrorHandler", () => ({
  popuprHandler: jest.fn(),
}));

jest.mock("@/app/api_hooks/login/getUserHook", () => ({
  __esModule: true, // ES 모듈로 인식되도록 설정
  default: jest.fn().mockReturnValue({
    data: null, // 모의 데이터 반환
    error: null,
    isLoading: false,
  }),
}));

jest.mock("@/app/handler/quit/deleteDB", () => ({
  deleteUserDB: jest.fn(),
}));

jest.mock("@/app/handler/quit/socialquit", () => jest.fn());

jest.mock("@/app/handler/quit/originquit", () => jest.fn());

jest.mock("@/app/handler/quit/userCredential/credentialHandler", () => ({
  isCredential: jest.fn(),
}));

describe("회원탈퇴 로직 테스트", () => {
  const setQuitMock = jest.fn();
  const mockUser = {
    uid: "123",
    email: "test@example.com",
  } as unknown as User;

  const quitPw = "password123";

  beforeEach(async () => {
    jest.clearAllMocks();
    const queryClient = new QueryClient();

    await act(async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <QuitPage user={mockUser} setQuit={setQuitMock} />
        </QueryClientProvider>
      );
    });
  });
  test("isCredential이 'sosial'일 때 팝업 호출 테스트", async () => {
    (isCredential as jest.Mock).mockResolvedValue("sosial");

    const activeBtn = screen.getByText("확인");
    await act(async () => {
      fireEvent.click(activeBtn);
    });
    expect(popuprHandler).toHaveBeenCalledWith({
      message: "회원탈퇴에 사용 될 2차비밀번호를 입력해주세요",
      type: "prompt",
      state: expect.any(Function),
    });
  });

  test("isCredential이 'origin'일 때  테스트", async () => {
    (isCredential as jest.Mock).mockResolvedValue("origin");
    const activeBtn = screen.getByText("확인");
    await act(async () => {
      fireEvent.click(activeBtn);
    });
    // deleteHandler가 호출되었는지 확인 (origin 계정)
    expect(deleteUserDB).toHaveBeenCalled();
    expect(originDeleteHandler).toHaveBeenCalledWith({
      data: mockUser,
      password: "", // 실제 비밀번호는 테스트에서 필요하지 않으므로 빈 문자열로 설정
    });
  });

  test("isSosial이 ture일 때 SosialDeleteHandler 호출 테스트", async () => {
    (isCredential as jest.Mock).mockResolvedValue("sosial");

    const activeBtn = screen.getByText("확인");
    await act(async () => {
      fireEvent.click(activeBtn);
    });

    expect(popuprHandler).toHaveBeenCalledWith({
      message: "회원탈퇴에 사용 될 2차비밀번호를 입력해주세요",
      type: "prompt",
      state: expect.any(Function),
    });

    act(() => {
      popupMessageStore.setState({ isClick: true });
    });
    expect(deleteUserDB).toHaveBeenCalled();
    expect(SocialDeleteHandler).toHaveBeenCalled();
  });

  test("isSosial이 false일 때 originDeleteHandler 호출 테스트", async () => {
    (isCredential as jest.Mock).mockResolvedValue("origin");

    const activeBtn = screen.getByText("확인");
    await act(async () => {
      fireEvent.click(activeBtn);
    });

    expect(originDeleteHandler).toHaveBeenCalledWith({
      data: mockUser,
      password: "",
    });
  });

  test("회원탈퇴 중 에러가 발생하면 popuprHandler 호출 테스트", async () => {
    (deleteUserDB as jest.Mock).mockImplementation(() => {
      throw new Error("Error during delete");
    });

    const activeBtn = screen.getByText("확인");
    await act(async () => {
      fireEvent.click(activeBtn);
    });

    expect(popuprHandler).toHaveBeenCalledWith({
      message: "회원탈퇴 도중 에러가 발생하였습니다",
    });
  });
});
