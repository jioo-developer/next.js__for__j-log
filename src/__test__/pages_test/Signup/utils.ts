import useSignupHandler from "@/app/api_hooks/signup/signupHook";
import { validateEmail } from "@/app/handler/commonHandler";
import { fireEvent, screen, waitFor } from "@testing-library/react";

export const commonElement = () => {
  const emailInput = screen.getByLabelText("이메일") as HTMLInputElement;
  const pwInput = screen.getByLabelText("비밀번호") as HTMLInputElement;
  const nicknameInput = screen.getByLabelText("닉네임") as HTMLInputElement;
  const signupForm = emailInput.closest("form") as HTMLFormElement;

  const checkbox = screen.getByLabelText(
    "회원가입 및 운영약관 동의"
  ) as HTMLInputElement;
  const privateCheckbox = screen.getByLabelText(
    "개인정보 수집 및 동의"
  ) as HTMLInputElement;

  return {
    emailInput,
    pwInput,
    nicknameInput,
    signupForm,
    checkbox,
    privateCheckbox,
  };
};

export const isSubmitActive = () => {
  const { checkbox, privateCheckbox } = commonElement();
  const checkboxResult = fireEvent.click(checkbox);

  const isCheckbox = checkbox.checked;

  expect(checkboxResult).toBe(true);
  expect(isCheckbox).toBe(true);

  const privateResult = fireEvent.click(privateCheckbox);

  const isPrivatebox = privateCheckbox.checked;

  expect(privateResult).toBe(true);
  expect(isPrivatebox).toBe(true);

  if (!isCheckbox || !isPrivatebox) {
    return false;
  }

  return true;
};
