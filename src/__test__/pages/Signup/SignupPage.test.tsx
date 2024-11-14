import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import useSignupHandler from "@/app/api_hooks/signup/signupHook";
import { popuprHandler } from "@/app/handler/error/ErrorHandler";
import SignupPage from "@/app/pages/signup/page";
import { commonElement, isSubmitActive } from "./utils";
import useUserQueryHook from "@/app/api_hooks/login/getUserHook";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// 공용 목 함수

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

// 공용 목 함수

jest.mock("@/app/api_hooks/login/getUserHook", () => ({
  __esModule: true, // ES 모듈로 인식되도록 설정
  default: jest.fn().mockReturnValue({
    data: null, // 모의 데이터 반환
    error: null,
    isLoading: false,
  }),
}));

jest.mock("@/app/api_hooks/common/getnameHook", () => ({
  __esModule: true, // ES 모듈로 인식되도록 설정
  default: jest.fn().mockReturnValue({
    nicknameData: ["사용중인닉네임"], // 모의 데이터 반환
    error: null,
    isLoading: false,
  }),
}));

jest.mock("@/app/api_hooks/signup/signupHook", () => jest.fn());

(useSignupHandler as jest.Mock).mockReturnValue({
  mutate: jest.fn(),
});

describe("회원가입 페이지 테스트", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <SignupPage />
      </QueryClientProvider>
    );
    const { data } = useUserQueryHook();
    expect(data).toBe(null);
  });

  test("초기 랜더링 시 회원가입 버튼 및 체크 박스가 비 활성화 되어 있는 지 테스트", () => {
    const signupButton = screen.getByRole("button", { name: "회원가입" });

    const { checkbox, privateCheckbox } = commonElement();

    const isCheckbox = (checkbox.previousElementSibling as HTMLInputElement)
      .checked;

    expect(isCheckbox).toBe(false);

    const isPrivateCheckbox = (
      privateCheckbox.previousElementSibling as HTMLInputElement
    ).checked;

    expect(isPrivateCheckbox).toBe(false);

    expect(signupButton).toBeDisabled();
  });

  test("입력 상태가 올바르게 업데이트 되는 지 테스트", () => {
    const { emailInput, pwInput, nicknameInput } = commonElement();

    fireEvent.change(emailInput, { target: { value: "user@test.com" } });
    fireEvent.change(pwInput, { target: { value: "password123" } });
    fireEvent.change(nicknameInput, { target: { value: "nickname" } });

    expect(emailInput.value).toBe("user@test.com");
    expect(pwInput.value).toBe("password123");
    expect(nicknameInput.value).toBe("nickname");
  });

  test("필수 체크박스 활성화 되어 있는 지 테스트", () => {
    expect(isSubmitActive()).toBe(true);
  });

  test("올바르지 않은 이메일 형식일 때 에러 메시지 노출 테스트", async () => {
    const { emailInput, signupForm } = commonElement();

    fireEvent.change(emailInput, {
      target: { value: "invalidEmail" },
    });

    expect(isSubmitActive()).toBe(true);

    expect(signupForm).toBeInTheDocument();

    fireEvent.submit(signupForm);

    expect(popuprHandler).toHaveBeenCalledWith({
      message: "올바른 이메일 형식이 아닙니다.",
    });
  });

  test("비밀번호가 짧을 때 에러 메시지 노출 테스트.", async () => {
    const { emailInput, pwInput, signupForm } = commonElement();

    fireEvent.change(emailInput, {
      target: { value: "test@example.com" },
    });

    fireEvent.change(pwInput, {
      target: { value: "short" },
    });

    expect(isSubmitActive()).toBe(true);

    expect(signupForm).toBeInTheDocument();

    fireEvent.submit(signupForm);

    expect(popuprHandler).toHaveBeenCalledWith({
      message: "비밀번호가 짧습니다.",
    });
  });

  test("이미 사용 중인 닉네임 일 때 에러 메시지 표시 테스트", async () => {
    const { emailInput, pwInput, nicknameInput, signupForm } = commonElement();

    fireEvent.change(emailInput, {
      target: { value: "test@example.com" },
    });

    fireEvent.change(pwInput, {
      target: { value: "validPassword123" },
    });

    fireEvent.change(nicknameInput, {
      target: { value: "사용중인닉네임" },
    });

    expect(isSubmitActive()).toBe(true);

    expect(signupForm).toBeInTheDocument();

    fireEvent.submit(signupForm);

    expect(popuprHandler).toHaveBeenCalledWith({
      message: "이미 사용중인 닉네임 입니다",
    });
  });

  test("모든 유효성 검사를 통과 하는 지 확인합니다.", async () => {
    const { emailInput, pwInput, nicknameInput, signupForm } = commonElement();

    const inputInfo = {
      email: "test@example.com",
      password: "validPassword123",
      nickname: "existingNickname",
    };

    fireEvent.change(emailInput, {
      target: { value: inputInfo.email },
    });

    fireEvent.change(pwInput, {
      target: { value: inputInfo.password },
    });

    fireEvent.change(nicknameInput, {
      target: { value: inputInfo.nickname },
    });

    expect(isSubmitActive()).toBe(true);

    expect(signupForm).toBeInTheDocument();

    fireEvent.submit(signupForm);

    const crateAccount = useSignupHandler();

    expect(crateAccount.mutate).toHaveBeenCalledWith(inputInfo);
  });
});
