import { fireEvent, screen } from "@testing-library/react";

export const commonElement = () => {
  // signup 전용
  const emailInput = screen.getByLabelText("이메일") as HTMLInputElement;
  const pwInput = screen.getByLabelText("비밀번호") as HTMLInputElement;
  const nicknameInput = screen.getByLabelText("닉네임") as HTMLInputElement;
  const signupForm = emailInput.closest("form") as HTMLFormElement;

  const checkbox = screen.getByText("회원가입 및 운영약관 동의")
    .previousElementSibling as HTMLInputElement;

  const privateCheckbox = screen.getByText("개인정보 수집 및 동의")
    .previousElementSibling as HTMLInputElement;

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

  const isCheckbox = (checkbox.previousElementSibling as HTMLInputElement)
    .checked;
  expect(checkboxResult).toBe(true);
  expect(isCheckbox).toBe(true);

  const privateResult = fireEvent.click(privateCheckbox);

  const isPrivatebox = (
    privateCheckbox.previousElementSibling as HTMLInputElement
  ).checked;

  expect(privateResult).toBe(true);
  expect(isPrivatebox).toBe(true);

  if (!isCheckbox || !isPrivatebox) {
    return false;
  }

  return true;
};

//공용작업
