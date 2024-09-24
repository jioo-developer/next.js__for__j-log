import React from "react";
import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import useNameQueryHook from "@/app/api_hooks/common/getnameHook";
import useSignupHandler from "@/app/api_hooks/signup/signupHook";
import { validateEmail } from "@/app/handler/commonHandler";
import { popuprHandler } from "@/app/handler/error/ErrorHandler";
import SignupPage from "@/app/pages/signup/page";
import { useRouter } from "next/router";

jest.mock("@/app/api_hooks/common/getnameHook", () => jest.fn());
jest.mock("@/app/api_hooks/signup/signupHook", () => jest.fn());

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/app/handler/error/ErrorHandler", () => ({
  popuprHandler: jest.fn(),
}));

jest.mock("@/app/handler/commonHandler", () => ({
  validateEmail: jest.fn(),
}));

describe("회원가입 페이지 테스트 그룹", () => {
  const givenSetup = () => {
    (useRouter as jest.Mock).mockReturnValue({
      pathname: "/signup",
      query: {},
      push: jest.fn(),
    });

    render(<SignupPage />);
    // 나머지 테스트 코드 작성
    const emailInput = screen.getByLabelText("이메일*") as HTMLInputElement;
    const pwInput = screen.getByLabelText("비밀번호*") as HTMLInputElement;
    const nicknameInput = screen.getByLabelText("닉네임*") as HTMLInputElement;
    const signupButton = screen.getByRole("button", { name: "회원가입" });
    return { emailInput, pwInput, nicknameInput, signupButton };
  };

  beforeEach(() => {
    jest.clearAllMocks();
    givenSetup();

    (useNameQueryHook as jest.Mock).mockReturnValue({
      nicknameData: ["사용중인닉네임"],
      error: false,
      isLoading: false,
    });
    (useSignupHandler as jest.Mock).mockReturnValue({ mutate: jest.fn() });
  });

  test("초기 랜더링시 회원가입 버튼이 비 활성화 되는 지 확인합니다.", () => {
    const { signupButton } = givenSetup();

    expect(signupButton).toHaveClass("un_btn");
    expect(signupButton);
  });

  test("입력 상태가 올바르게 업데이트되는지 확인", () => {
    const { emailInput, pwInput, nicknameInput, signupButton } = givenSetup();

    fireEvent.change(emailInput, { target: { value: "user@test.com" } });
    fireEvent.change(pwInput, { target: { value: "password123" } });
    fireEvent.change(nicknameInput, { target: { value: "nickname" } });

    expect(emailInput.value).toBe("user@test.com");
    expect(pwInput.value).toBe("password123");
    expect(nicknameInput.value).toBe("nickname");

    expect(signupButton).toHaveClass("btn");
    expect(signupButton).not.toBeDisabled();
  });

  test("올바르지 않은 이메일 형식일 때 에러 메시지 표시", () => {
    (validateEmail as jest.Mock).mockReturnValue(false);
    // validateEmail의 mock 함수의 값이 false로 설정
    // 에러 표시가 되는지 테스트를 해야 하기 때문

    const { emailInput, signupButton } = givenSetup();

    fireEvent.change(emailInput, {
      target: { value: "invalidEmail" },
    });

    fireEvent.click(signupButton);

    expect(popuprHandler).toHaveBeenCalledWith({
      message: "올바른 이메일 형식이 아닙니다.",
    });
  });

  test("비밀번호가 짧을 때 에러 메시지 표시", () => {
    (validateEmail as jest.Mock).mockReturnValue(true);

    const { emailInput, pwInput, signupButton } = givenSetup();

    fireEvent.change(emailInput, {
      target: { value: "test@example.com" },
    });

    fireEvent.change(pwInput, {
      target: { value: "short" },
    });

    fireEvent.click(signupButton);

    expect(popuprHandler).toHaveBeenCalledWith({
      message: "비밀번호가 짧습니다.",
    });
  });

  test("이미 사용 중인 닉네임일 때 에러 메시지 표시", () => {
    (validateEmail as jest.Mock).mockReturnValue(true);

    const { emailInput, pwInput, nicknameInput, signupButton } = givenSetup();

    fireEvent.change(emailInput, {
      target: { value: "test@example.com" },
    });

    fireEvent.change(pwInput, {
      target: { value: "validPassword123" },
    });

    fireEvent.change(nicknameInput, {
      target: { value: "사용중인닉네임" },
    });

    fireEvent.click(signupButton);

    expect(popuprHandler).toHaveBeenCalledWith({
      message: "이미 사용중인 닉네임 입니다",
    });
  });

  test("모든 유효성 검사를 통과하면 계정 생성 함수 호출", () => {
    (validateEmail as jest.Mock).mockReturnValue(true);
    const crateAccount = useSignupHandler();

    const { emailInput, pwInput, nicknameInput, signupButton } = givenSetup();

    fireEvent.change(emailInput, {
      target: { value: "test@example.com" },
    });

    fireEvent.change(pwInput, {
      target: { value: "validPassword123" },
    });

    fireEvent.change(nicknameInput, {
      target: { value: "existingNickname" },
    });

    fireEvent.click(signupButton);

    expect(crateAccount.mutate).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "validPassword123",
      nickname: "newNickname",
    });
  });
});
