import useMyDataQueryHook from "@/app/api_hooks/mypage/getMyPostData";
import { popuprHandler } from "@/app/handler/error/ErrorHandler";
import MyBoardPage from "@/app/pages/member/myBoard/page";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  render,
  waitFor,
  screen,
  act,
  fireEvent,
} from "@testing-library/react";
import { useRouter } from "next/navigation";

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
    data: { uid: "123" }, // 모의 데이터 반환
    error: null,
    isLoading: false,
  }),
}));

jest.mock("@/app/api_hooks/mypage/getMyPostData", () => ({
  __esModule: true, // ES 모듈로 인식되도록 설정
  default: jest.fn().mockReturnValue({
    myData: [],
    isLoading: false,
    error: null,
  }),
}));

describe("myboard 페이지 테스트", () => {
  const queryClient = new QueryClient();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("게시글이 없을 경우 팝업 호출 테스트", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MyBoardPage />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(popuprHandler).toHaveBeenCalledWith({
        message: "게시글이 조회되지 않습니다.",
      });
    });
  });

  test("게시글이 있을 경우 페이지 라우팅 테스트", async () => {
    // 모의 데이터를 설정
    (useMyDataQueryHook as jest.Mock).mockReturnValue({
      myData: [
        {
          id: "1",
          pageId: "1234",
          writer: "user1",
          content: "test",
          url: ["/img/no-image.jpg"],
        },
      ],
      isLoading: false,
      error: null,
    });

    await act(async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MyBoardPage />
        </QueryClientProvider>
      );
    });

    await waitFor(() => {
      const target = screen.getByText("전체보기")
        .nextElementSibling as HTMLElement;
      fireEvent.click(target);
      waitFor(() => {
        expect(useRouter().push).toHaveBeenCalledWith("/pages/detail/1234");
      });
    });
  });
});
