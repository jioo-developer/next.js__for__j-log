import { sendPasswordResetEmail } from "firebase/auth";
import { authService } from "../../../../Firebase";
import { popuprHandler } from "@/app/handler/error/ErrorHandler";
import useUserQueryHook from "@/app/api_hooks/login/getUserHook";
import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import ResetPwPage from "@/app/pages/resetPw/page";
import { validateEmail } from "@/app/handler/commonHandler";
import { useRouter } from "next/navigation";

jest.mock("@/app/Firebase", () => ({
  authService: {},
}));

jest.mock("firebase/auth", () => ({
  sendPasswordResetEmail: jest.fn(),
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
    error: Error,
    isLoading: false,
  }),
}));

jest.mock("@/app/handler/error/ErrorHandler", () => ({
  popuprHandler: jest.fn(),
}));

jest.mock("@/app/api_hooks/login/LoginErrorHandler", () => ({
  LoginErrorHandler: jest.fn(),
}));

jest.mock("@/app/store/common", () => ({
  popupMessageStore: jest.fn().mockReturnValue({
    message: "",
    isClick: false,
    subscribe: jest.fn(),
  }),
}));

describe("비밀번호 찾기 로직 테스트", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    render(<ResetPwPage />);

    const { data } = useUserQueryHook();
    expect(data).toBe(null);
  });

  test("취소 버튼을 누를 시 로그인 페이지로 되돌아가는 지 테스트", () => {
    const confirmButton = screen.getByText("취소");
    fireEvent.click(confirmButton);
    expect(useRouter().push).toHaveBeenCalledWith("/pages/login");
  });

  test("비밀번호 찾기를 위한 이메일 전송에 성공 했는지 테스트", async () => {
    const popupTitle = screen.getByText(
      "비밀번호를 잊어버리셨나요?"
    ) as HTMLElement;

    expect(popupTitle).toBeInTheDocument();

    const input = screen.getByPlaceholderText(
      "이메일을 입력하세요."
    ) as HTMLInputElement;

    fireEvent.change(input, {
      target: { value: "test@example.com" },
    });

    const isEmail = validateEmail(input.value);
    expect(isEmail).toBe(true);

    const confirmButton = screen.getByText("확인");
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(sendPasswordResetEmail).toHaveBeenCalledWith(
        authService,
        "test@example.com"
      );
    });

    expect(popuprHandler).toHaveBeenCalledWith({
      message: "입력하신 메일로 비밀번호 안내드렸습니다",
    });
    expect(useRouter().push).toHaveBeenCalledWith("/pages/login");
  });

  test("비밀번호 찾기를 위한 이메일 전송에 실패 했는지 테스트", async () => {
    const error = "올바른 이메일 형식이 아닙니다.";

    const popupTitle = screen.getByText(
      "비밀번호를 잊어버리셨나요?"
    ) as HTMLElement;

    expect(popupTitle).toBeInTheDocument();

    const input = screen.getByPlaceholderText(
      "이메일을 입력하세요."
    ) as HTMLInputElement;

    fireEvent.change(input, {
      target: { value: "test" },
    });

    const isEmail = validateEmail(input.value);
    expect(isEmail).toBe(false);

    const confirmButton = screen.getByText("확인");
    fireEvent.click(confirmButton);

    expect(popuprHandler).toHaveBeenCalledWith({ message: error });
  });
});
