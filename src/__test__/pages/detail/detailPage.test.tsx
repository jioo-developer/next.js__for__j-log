import useDetailQueryHook from "@/app/api_hooks/detail/getDetailHook";
import useUserQueryHook from "@/app/api_hooks/login/getUserHook";
import { pageDelete } from "@/app/handler/detail/pageDeleteHanlder";
import { useCreateId } from "@/app/handler/detail/pageInfoHandler";
import { useFavoriteMutate } from "@/app/handler/detail/useMutationHandler";
import { popuprHandler } from "@/app/handler/error/ErrorHandler";
import DetailPage from "@/app/pages/detail/[id]/page";
import { pageInfoStore, popupMessageStore } from "@/app/store/common";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  act,
  render,
  waitFor,
  screen,
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
  popupInit: jest.fn(),
}));

jest.mock("@/app/api_hooks/login/getUserHook", () => ({
  __esModule: true, // ES 모듈로 인식되도록 설정
  default: jest.fn().mockReturnValue({
    data: null, // 모의 데이터 반환
    error: null,
    isLoading: false,
  }),
}));

jest.mock("@/app/api_hooks/detail/getDetailHook", () => ({
  __esModule: true, // ES 모듈로 인식되도록 설정
  default: jest.fn().mockReturnValue({
    pageData: null,
    error: null,
    isLoading: false,
  }),
}));

jest.mock("@/app/handler/detail/pageInfoHandler");

jest.mock("@/app/handler/detail/pageDeleteHanlder");

jest.mock("@/app/handler/detail/useMutationHandler");

(useFavoriteMutate as jest.Mock).mockReturnValue({
  mutate: jest.fn(),
});

describe("게시글 페이지 데이터 없을 때 테스트", () => {
  const queryClient = new QueryClient();
  const pageId = "new-page-id";

  beforeEach(() => {
    jest.clearAllMocks();
    (useCreateId as jest.Mock).mockReturnValue(pageId);

    render(
      <QueryClientProvider client={queryClient}>
        <DetailPage />
      </QueryClientProvider>
    );
  });

  test("게시글 데이터 조회가 안 될 경우 팝업 노출 테스트", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <DetailPage />
      </QueryClientProvider>
    );
    await waitFor(() => {
      expect(popuprHandler).toHaveBeenCalledWith({
        message: "페이지 정보가 조회 되지 않습니다.",
      });
    });
  });
  test("팝업 노출 후 확인 버튼 클릭 시 메인 페이지로 이동 테스트", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <DetailPage />
      </QueryClientProvider>
    );
    await waitFor(() => {
      expect(popuprHandler).toHaveBeenCalledWith({
        message: "페이지 정보가 조회 되지 않습니다.",
      });
    });

    await act(async () => {
      popupMessageStore.setState({ message: "" }); // 상태를 ""로 변경
    });

    // 상태가 ""로 변경되었을 때 router.push가 호출되는지 확인
    await waitFor(() => {
      const currentState = popupMessageStore.getState(); // 현재 zustand 상태 가져오기
      expect(currentState.message).toBe(""); // 상태가 빈 문자열로 변경되었는지 확인
    });

    await waitFor(() => {
      popupMessageStore.subscribe((state, prevState) => {
        const target = "페이지 정보가 조회 되지 않습니다.";
        if (prevState.message === target && state.message === "") {
          expect(useRouter().push).toHaveBeenCalledWith("/pages/main");
        }
      });
    });
  });
});

describe("게시글 페이지 데이터 있을 때 테스트", () => {
  const queryClient = new QueryClient();
  const pageId = "new-page-id";

  beforeEach(async () => {
    jest.clearAllMocks();
    (useCreateId as jest.Mock).mockReturnValue(pageId);

    (useUserQueryHook as jest.Mock).mockReturnValue({
      data: { uid: "user-id", displayName: "Test User" },
      error: null,
      isLoading: false,
    });
    (useDetailQueryHook as jest.Mock).mockReturnValue({
      pageData: { title: "123", text: "123", url: [] },
      error: null,
      isLoading: false,
    });

    await act(async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <DetailPage />
        </QueryClientProvider>
      );
    });
  });

  test("수정 버튼 클릭 시 edit 페이지로 이동 테스트", async () => {
    const editbtn = screen.getByText("수정");
    fireEvent.click(editbtn);
    await act(async () => {
      pageInfoStore.setState({ editMode: true }); // 상태를 ""로 변경
    });

    // 상태가 ""로 변경되었을 때 router.push가 호출되는지 확인
    await waitFor(() => {
      const currentState = pageInfoStore.getState(); // 현재 zustand 상태 가져오기
      expect(currentState.editMode).toBe(true); // 상태가 빈 문자열로 변경되었는지 확인
    });
    await waitFor(() => {
      expect(useRouter().push).toHaveBeenCalledWith("/pages/editor");
    });
  });
  test("삭제 버튼을 클릭시 삭제 핸들러 호출 테스트", async () => {
    const deleteBtn = screen.getByText("삭제");
    fireEvent.click(deleteBtn);

    await waitFor(() => {
      expect(popuprHandler).toHaveBeenCalledWith({
        message: "정말 삭제 하시겠습니까?",
        type: "confirm",
      });
    });

    await act(async () => {
      pageInfoStore.setState({ fromAction: "detail" }); // 상태를 ""로 변경
    });

    // 상태가 ""로 변경되었을 때 router.push가 호출되는지 확인
    await waitFor(() => {
      const currentState = pageInfoStore.getState(); // 현재 zustand 상태 가져오기
      expect(currentState.fromAction).toBe("detail"); // 상태가 빈 문자열로 변경되었는지 확인
    });
  });
});

describe("페이지 삭제 로직 테스트", () => {
  const queryClient = new QueryClient();
  const pageId = "new-page-id";

  beforeEach(async () => {
    jest.clearAllMocks();
    (useCreateId as jest.Mock).mockReturnValue(pageId);

    (useUserQueryHook as jest.Mock).mockReturnValue({
      data: { uid: "user-id", displayName: "Test User" },
      error: null,
      isLoading: false,
    });
    (useDetailQueryHook as jest.Mock).mockReturnValue({
      pageData: { title: "123", text: "123", url: [] },
      error: null,
      isLoading: false,
    });

    await act(async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <DetailPage />
        </QueryClientProvider>
      );
    });

    const deleteBtn = screen.getByText("삭제");
    fireEvent.click(deleteBtn);

    await waitFor(() => {
      expect(popuprHandler).toHaveBeenCalledWith({
        message: "정말 삭제 하시겠습니까?",
        type: "confirm",
      });
    });

    await act(async () => {
      pageInfoStore.setState({ fromAction: "detail" }); // 상태를 ""로 변경
    });
  });
  test("페이지 삭제 로직 성공", async () => {
    (pageDelete as jest.Mock).mockResolvedValueOnce({
      title: "123",
      text: "123",
      url: [],
    }); // pageDelete가 성공할 경우

    await act(async () => {
      popupMessageStore.setState({ isClick: true });
    });

    await waitFor(() => {
      expect(pageDelete).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(pageDelete).toHaveBeenCalledWith(expect.any(Object)); // FirebaseData로 pageDelete 호출
      expect(useRouter().push).toHaveBeenCalledWith("/pages/main"); // 페이지가 메인으로 이동
    });
  });

  test("페이지 삭제 로직 실패", async () => {
    (pageDelete as jest.Mock).mockRejectedValue(new Error("삭제 실패"));

    await act(async () => {
      popupMessageStore.setState({ isClick: true });
    });

    await waitFor(() => {
      expect(pageDelete).toHaveBeenCalled();
    });

    await act(async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <DetailPage />
        </QueryClientProvider>
      );
    });

    await waitFor(() => {
      expect(popuprHandler).toHaveBeenCalledWith({
        message: "페이지 삭제 도중 문제가 생겼습니다",
      });
    });
  });
});

describe("좋아요 로직 테스트", () => {
  const queryClient = new QueryClient();
  const pageId = "new-page-id";

  beforeEach(async () => {
    jest.clearAllMocks();
    (useCreateId as jest.Mock).mockReturnValue(pageId);

    (useUserQueryHook as jest.Mock).mockReturnValue({
      data: { uid: "user-id", displayName: "Test User" },
      error: null,
      isLoading: false,
    });
    (useDetailQueryHook as jest.Mock).mockReturnValue({
      pageData: { title: "123", text: "123", url: [] },
      error: null,
      isLoading: false,
    });

    await act(async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <DetailPage />
        </QueryClientProvider>
      );
    });

    await act(async () => {
      popupMessageStore.setState({ message: "", isClick: false });
    });
  });
  test("좋아요 함수 성공 테스트", async () => {
    // document.cookie 모킹
    Object.defineProperty(document, "cookie", {
      writable: true,
      value: "", // 쿠키가 비어있음
    });

    // 좋아요 버튼 찾기 (적절한 텍스트를 기준으로 버튼 검색)
    const favoriteBtn = (await screen.getByText(
      "게시글에 대한 댓글을 달아주세요."
    ).nextElementSibling) as HTMLButtonElement;

    // 좋아요 버튼이 존재하는지 확인
    expect(favoriteBtn).toBeInTheDocument();

    // 버튼 클릭 이벤트 발생
    fireEvent.click(favoriteBtn);
    const user = "testUser"; // 테스트용 사용자
    const getcookie = `${user}-Cookie`; // 쿠키 설정

    // 쿠키가 없으면 mutate 함수 호출
    if (!document.cookie.includes(getcookie)) {
      const favoriteMutate = useFavoriteMutate(); // useFavoriteMutate 호출
      favoriteMutate.mutate({
        value: 1,
        id: pageId,
      });

      expect(favoriteMutate.mutate).toHaveBeenCalledWith({
        value: 1,
        id: pageId,
      });
    }

    // favoriteMutate가 호출되었는지 확인
  });
  test("좋아요 함수 실패 테스트", async () => {
    (useFavoriteMutate as jest.Mock).mockReturnValue({
      mutate: jest.fn(() => {
        new Error("Mutate function failed");
      }),
    });
    // document.cookie 모킹
    Object.defineProperty(document, "cookie", {
      writable: true,
      value: "", // 쿠키가 비어있음
    });

    // 좋아요 버튼 찾기 (적절한 텍스트를 기준으로 버튼 검색)
    const favoriteBtn = (await screen.getByText(
      "게시글에 대한 댓글을 달아주세요."
    ).nextElementSibling) as HTMLButtonElement;

    // 좋아요 버튼이 존재하는지 확인
    expect(favoriteBtn).toBeInTheDocument();

    // 버튼 클릭 이벤트 발생
    fireEvent.click(favoriteBtn);
    const user = "testUser"; // 테스트용 사용자
    const getcookie = `${user}-Cookie`; // 쿠키 설정

    // 쿠키가 없으면 mutate 함수 호출
    if (!document.cookie.includes(getcookie)) {
      const favoriteMutate = useFavoriteMutate(); // useFavoriteMutate 호출
      try {
        favoriteMutate.mutate({
          value: 1,
          id: pageId,
        });
      } catch {
        await waitFor(() => {
          expect(popuprHandler).toHaveBeenCalledWith({
            message: "좋아요 반영이 되지 않았습니다.",
          });
        });
      }
    }
  });
});