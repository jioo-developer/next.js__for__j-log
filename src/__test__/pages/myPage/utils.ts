import { screen, within } from "@testing-library/react";

export const falsyStateElement = () => {
  const formArea = screen.getByTestId("name_area") as HTMLElement;
  const editStartBtn = within(formArea).getByText("수정") as HTMLButtonElement;
  const label = screen.getByLabelText("이미지 업로드") as HTMLLabelElement;
  return { editStartBtn, label };
};

export const trueStateElement = () => {
  const formArea = screen.getByTestId("name_area") as HTMLElement;
  const editEndBtn = within(formArea).getByText(
    "수정완료"
  ) as HTMLButtonElement;
  const cancelBtn = within(formArea).getByText("취소") as HTMLButtonElement;
  const input = within(formArea).getByRole("textbox") as HTMLInputElement;
  return { editEndBtn, cancelBtn, input };
};
