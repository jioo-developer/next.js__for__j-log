import useUserQueryHook from "@/app/api_hooks/login/getUserHook";
import MainPage from "@/app/pages/main/page";
import SkeletonItem from "@/stories/modules/utils/SkeletonItem";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, render, screen, waitFor } from "@testing-library/react";
import { usePathname } from "next/navigation";
import { searchStore } from "@/store/common";

jest.mock("@/app/Firebase", () => ({
  authService: {},
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
  }),
  usePathname: jest.fn(),
}));

jest.mock("@/app/api_hooks/login/getUserHook", () => ({
  __esModule: true, // ES 모듈로 인식되도록 설정
  default: jest.fn().mockReturnValue({
    data: { uid: "123" }, // 모의 데이터 반환
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

jest.mock("@/app/handler/error/ErrorHandler", () => ({
  popuprHandler: jest.fn(),
}));

const queryClient = new QueryClient();

describe("메인페이지 테스트 - skeleton 함수까지", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (usePathname as jest.Mock).mockReturnValueOnce("/pages/main");
    (useUserQueryHook as jest.Mock).mockReturnValueOnce({
      data: null,
      error: null,
      isLoading: true,
    });
    const { isLoading } = useUserQueryHook();
    render(
      <QueryClientProvider client={queryClient}>
        <>{isLoading ? <SkeletonItem /> : <MainPage />}</>
      </QueryClientProvider>
    );
  });

  test("pages/main 으로 라우팅 되는 지 테스트", () => {
    const pathname = usePathname();
    expect(pathname).not.toBe("/");
  });

  test("로딩 중에 스켈레톤 렌더링 되는 지 확인", () => {
    const skeletonItems = screen.getByTestId("skeleton");
    expect(skeletonItems).not.toBeNull();
  });
});

describe("메인 페이지 테스트 - skeleton 함수 이후", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("searchInfo.text 가 있을 때 테스트", async () => {
    await act(async () => {
      searchStore.setState({ searchText: "Test Text" }); // 상태를 ""로 변경
    });

    // 상태가 ""로 변경되었을 때 router.push가 호출되는지 확인
    await waitFor(() => {
      const currentState = searchStore.getState(); // 현재 zustand 상태 가져오기
      expect(currentState.searchText).toBe("Test Text");
    });

    await act(() => {
      render(
        <QueryClientProvider client={queryClient}>
          <MainPage />
        </QueryClientProvider>
      );
    });

    expect(screen.getByText("Test Text")).toBeInTheDocument();
    expect(screen.queryByText("Other Text")).not.toBeInTheDocument();
  });

  test("searchInfo.text 가 없을 때 테스트", async () => {
    await act(async () => {
      searchStore.setState({ searchText: "" }); // 상태를 ""로 변경
    });

    // 상태가 ""로 변경되었을 때 router.push가 호출되는지 확인
    await waitFor(() => {
      const currentState = searchStore.getState(); // 현재 zustand 상태 가져오기
      expect(currentState.searchText).toBe("");
    });
    await act(() => {
      render(
        <QueryClientProvider client={queryClient}>
          <MainPage />
        </QueryClientProvider>
      );
    });

    expect(screen.getByText("Test Text")).toBeInTheDocument();
    expect(screen.getByText("Other Text")).toBeInTheDocument();
  });
});
