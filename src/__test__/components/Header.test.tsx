import {
  render,
  fireEvent,
  screen,
  renderHook,
  act,
  waitFor,
} from "@testing-library/react";
import { useRouter, usePathname } from "next/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Header from "@/components/atoms/Header";
import { useLogOut } from "@/app/handler/commonHandler";
import { authService } from "../../../Firebase";
import useUserQueryHook from "@/app/api_hooks/login/getUserHook";

jest.mock("@/app/Firebase", () => ({
  authService: {
    signOut: jest.fn(), // signOut 함수를 모킹
  },
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
    data: { uid: "user-id", displayName: "Test User" },
    error: null,
    isLoading: false,
    refetch: jest.fn(),
  }),
}));

describe("Header 컴포넌트 조건에 의한 토글 테스트", () => {
  const queryClient = new QueryClient();
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("로그아웃 버튼 누를 시 로그아웃 함수 테스트 ", async () => {
    (usePathname as jest.Mock).mockReturnValue("/pages/main");
    render(
      <QueryClientProvider client={queryClient}>
        <Header />
      </QueryClientProvider>
    );
    // 로그아웃 버튼 클릭
    const logOutButton = screen.getByText("로그아웃");
    fireEvent.click(logOutButton);

    // useLogOut 훅을 테스트 환경에서 실행
    const { result } = renderHook(() => useLogOut());

    // logOut 함수 실행
    await act(async () => {
      await result.current();
    });

    // authService.signOut가 호출되었는지 확인
    expect(authService.signOut).toHaveBeenCalled();

    // refetch 함수가 호출되었는지 확인
    expect(useUserQueryHook().refetch).toHaveBeenCalled();

    // router.push가 로그인 페이지로 이동했는지 확인
    expect(useRouter().push).toHaveBeenCalledWith("/pages/login");
  });

  test("isActive가 true 일 때 header 노출 테스트", () => {
    (usePathname as jest.Mock).mockReturnValue("/pages/main");
    render(
      <QueryClientProvider client={queryClient}>
        <Header />
      </QueryClientProvider>
    );
    const header = screen.getByRole("banner");
    expect(header).toBeInTheDocument();
  });

  test("isActive가 false 일 때 header 미 노출 테스트", () => {
    (usePathname as jest.Mock).mockReturnValue("/pages/login");
    render(
      <QueryClientProvider client={queryClient}>
        <Header />
      </QueryClientProvider>
    );
    const header = screen.queryByText("banner");
    expect(header).not.toBeInTheDocument();
  });
});

describe("Header 컴포넌트 라우팅 테스트", () => {
  const queryClient = new QueryClient();
  beforeEach(() => {
    jest.clearAllMocks();
    (usePathname as jest.Mock).mockReturnValue("/pages/main");
    render(
      <QueryClientProvider client={queryClient}>
        <Header />
      </QueryClientProvider>
    );
  });

  test("글 작성 버튼 누를 시 editor로 라우팅 이동 테스트", async () => {
    const button = screen.getByText("새 글 작성");
    fireEvent.click(button);
    await waitFor(() => {
      expect(useRouter().push).toHaveBeenCalledWith("/pages/editor");
    });
  });
  test("검색 아이콘 클릭 시 search 페이지로 라우팅 이동 테스트", async () => {
    const button = screen.getByText("새 글 작성")
      .nextElementSibling as HTMLButtonElement;
    fireEvent.click(button);
    await waitFor(() => {
      expect(useRouter().push).toHaveBeenCalledWith("/pages/search");
    });
  });

  test("설정 버튼 누를 시 마이 페이지로 라우팅 이동 테스트", async () => {
    const button = screen.getByText("설정");
    fireEvent.click(button);
    await waitFor(() => {
      expect(useRouter().push).toHaveBeenCalledWith("/pages/member/mypage");
    });
  });

  test("내 게시글 버튼 누를 시 myboard 페이지로 라우팅 이동 테스트", async () => {
    const button = screen.getByText("내 게시글");
    fireEvent.click(button);
    await waitFor(() => {
      expect(useRouter().push).toHaveBeenCalledWith("/pages/member/myBoard");
    });
  });
});
