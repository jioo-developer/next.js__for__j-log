import {
  fireEvent,
  render,
  waitFor,
  screen,
  renderHook,
  act,
} from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export const getElementsHandler = () => {
  const id = screen.getByPlaceholderText(
    "아이디를 입력하세요."
  ) as HTMLInputElement;
  const password = screen.getByPlaceholderText(
    "비밀번호를 8자리 이상 입력하세요."
  ) as HTMLInputElement;
  const loginBtn = screen.getByText("로그인");
  const resetBtn = screen.getByText("비밀번호 변경&찾기");
  const signupBtn = screen.getByText("회원가입");

  return { id, password, loginBtn, resetBtn, signupBtn };
};

export const commonHandler = (queryClient: QueryClient) => {
  const LoginHook = jest.requireActual(
    "@/app/api_hooks/login/setUserHook"
  ).default;

  const { result } = renderHook(() => LoginHook(), {
    wrapper: ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    ),
  });

  act(() => {
    result.current.mutate({
      id: "test@example.com",
      pw: "password123",
    });
  });
  return result;
};
