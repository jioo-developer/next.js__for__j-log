import useUserQueryHook from "@/app/api_hooks/login/getUserHook";
import { isSecondaryPw } from "@/app/api_hooks/login/snsLogin/googleLogin";
import { popupInit, popuprHandler } from "@/app/handler/error/ErrorHandler";
import MainPage from "@/app/pages/main/page";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  act,
  render,
  renderHook,
  screen,
  waitFor,
} from "@testing-library/react";
import { useRouter } from "next/navigation";
import { create } from "zustand";

jest.mock("@/app/Firebase", () => ({
  authService: {},
}));

jest.mock("@/app/api_hooks/login/getUserHook", () => ({
  __esModule: true, // ES 모듈로 인식되도록 설정
  default: jest.fn().mockReturnValue({
    data: null, // 모의 데이터 반환
    error: null,
    isLoading: false,
  }),
}));

jest.mock("@/app/api_hooks/main/getPostHook", () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue({
    postData: [
      { id: "1", title: "Test Title", text: "Test Text" },
      { id: "2", title: "Other Title", text: "Other Text" },
    ],
  }),
}));

jest.mock("@/app/api_hooks/login/snsLogin/googleLogin");

jest.mock("next/navigation", () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
  }),
}));

jest.mock("@/app/handler/error/ErrorHandler", () => ({
  popuprHandler: jest.fn(),
  popupInit: jest.fn(),
}));

describe("메인페이지 테스트", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <MainPage />
      </QueryClientProvider>
    );
  });

  test("유저 데이터가 없을 때 로그인 페이지로 리다이렉트 되는지 확인", async () => {
    const { data } = useUserQueryHook();
    expect(data).toBe(null);

    await waitFor(() => {
      expect(useRouter().push).toHaveBeenCalledWith("/pages/login");
    });
  });

  test("유저가 2차 비밀번호를 설정하지 않은 경우 로그인 페이지로 리다이렉트 되는지 확인", async () => {
    (useUserQueryHook as jest.Mock).mockReturnValue({
      data: { uid: "123" },
      isLoading: false,
    });
    (isSecondaryPw as jest.Mock).mockResolvedValue(false);

    await waitFor(() => {
      expect(useRouter().push).toHaveBeenCalledWith("/pages/login");
    });
  });

  test("검색어가 있을 때 필터링된 데이터가 렌더링 되는지 확인", async () => {
    (useUserQueryHook as jest.Mock).mockReturnValue({
      data: { uid: "123" },
      isLoading: false,
    });

    const testStore = create(() => ({
      searchText: "",
    }));

    act(() => {
      testStore.setState({ searchText: "Test Title" });
    });

    await waitFor(() => {
      expect(screen.getAllByText("Test Text")).toHaveLength(1);
      expect(screen.getByText("Test Title")).toBeInTheDocument();
    });
  });
});
