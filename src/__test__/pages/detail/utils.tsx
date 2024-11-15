import { replyType } from "@/app/api_hooks/Reply/getReplyHook";
import { within, screen, render } from "@testing-library/react";

export const getElement = () => {
  const form = screen.getByRole("form") as HTMLFormElement;
  const input = within(form).getByPlaceholderText(
    "내용을 입력하세요."
  ) as HTMLInputElement;
  const textarea = within(form).getAllByRole(
    "textbox"
  )[1] as HTMLTextAreaElement;
  const fileInputLabel = within(form).getByLabelText(
    "이미지를 담아주세요"
  ) as HTMLLabelElement;
  const exitBtn = within(form).getAllByRole("button")[0] as HTMLButtonElement;
  const submitBtn = screen.getByText("글작성");
  return { form, input, textarea, fileInputLabel, exitBtn, submitBtn };
};

export const lenderingCheck = () => {
  // 제목, 텍스트, 파일 업로드, 글작성 버튼이 있는지 확인
  const { form, input, textarea, fileInputLabel, exitBtn, submitBtn } =
    getElement();
  expect(form).toBeInTheDocument();
  expect(input).toBeInTheDocument();
  expect(textarea).toBeInTheDocument();
  expect(fileInputLabel).toBeInTheDocument();
  expect(exitBtn).toBeInTheDocument();
  expect(submitBtn).toBeInTheDocument();
};

export const mockReplyData: replyType[] = [
  {
    id: "reply1",
    comment: "This is a test comment",
    uid: "user123",
    replyrer: "Test User 1",
    date: "2024년11월14일",
    timestamp: { second: 1699988400, nanoseconds: 123000000 },
    profile: "/img/profile1.png",
  },
  {
    id: "reply2",
    comment: "Another comment",
    uid: "user456",
    replyrer: "Test User 2",
    date: "2024년11월14일",
    timestamp: { second: 1699988400, nanoseconds: 123000000 },
    profile: "/img/profile2.png",
  },
];
