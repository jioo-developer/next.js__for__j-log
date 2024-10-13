import useUserQueryHook from "@/app/api_hooks/login/getUserHook";
import MainPage from "@/app/pages/main/page";
import SkeletonItem from "@/app/components/SkeletonItem";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, render, screen, waitFor } from "@testing-library/react";
import { create } from "zustand";
import { usePathname } from "next/navigation";

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

describe("메인페이지 테스트", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("로딩 중에 스켈레톤 렌더링되는지 확인", () => {
    (usePathname as jest.Mock).mockReturnValueOnce("/pages/main");
    (useUserQueryHook as jest.Mock).mockReturnValueOnce({
      data: null,
      error: null,
      isLoading: true,
    });
    const { data, isLoading } = useUserQueryHook();
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <>{isLoading ? <SkeletonItem /> : <MainPage />}</>
      </QueryClientProvider>
    );
    const pathname = usePathname();
    expect(pathname).not.toBe("/");
    const skeletonItems = screen.getByTestId("skeleton");
    expect(skeletonItems).not.toBeNull();
  });

  test("검색어가 있을 때 필터링된 데이터가 렌더링 되는지 확인", async () => {
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <MainPage />
      </QueryClientProvider>
    );

    const testStore = create(() => ({
      searchText: "",
    }));

    act(() => {
      testStore.setState({ searchText: "Test Title" });
    });

    await waitFor(() => {
      expect(screen.getByText("Test Title")).toBeInTheDocument();
    });
  });
});
