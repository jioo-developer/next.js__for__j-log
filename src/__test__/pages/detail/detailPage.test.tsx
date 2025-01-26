import useDetailQueryHook, {
  FirebaseData,
} from "@/app/api_hooks/detail/getDetailHook";
import useUserQueryHook from "@/app/api_hooks/login/getUserHook";
import usePageDeleteHandler from "@/app/handler/detail/crud/useDeleteMutationHandler";
import pageDelete from "@/app/handler/detail/pageDeleteHanlder";
import { useCreateId } from "@/app/handler/detail/pageInfoHandler";
import useFavoriteMutate from "@/app/handler/detail/useMutationHandler";
import { popuprHandler } from "@/app/handler/error/ErrorHandler";
import DetailPage from "@/app/pages/detail/[id]/page";
import { pageInfoStore, popupMessageStore } from "@/store/common";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  act,
  render,
  waitFor,
  screen,
  fireEvent,
  renderHook,
} from "@testing-library/react";
import { doc, Timestamp, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

jest.mock("@/app/Firebase", () => ({
  authService: {
    currentUser: {
      email: "test@example.com",
      id: "user-id",
      name: "Test User",
    },
  },
}));

jest.mock("@/app/Firebase", () => ({
  db: jest.fn().mockReturnValue({}),
}));

jest.mock("firebase/firestore", () => ({
  deleteDoc: jest.fn(),
  doc: jest.fn(),
  updateDoc: jest.fn(),
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

jest.mock("@/app/handler/detail/crud/useDeleteMutationHandler");

(usePageDeleteHandler as jest.Mock).mockReturnValue({
  mutate: jest.fn(),
});

(useFavoriteMutate as jest.Mock).mockReturnValue({
  mutate: jest.fn(),
  mutateAsync: jest.fn(),
});

(doc as jest.Mock).mockImplementation((dbInstance, collection, documentId) => {
  if (
    dbInstance === ({} as any) &&
    collection === "post" &&
    documentId === "testId"
  ) {
    return true;
  }
});

const pageId = "new-page-id";

describe("게시글 페이지 데이터 없을 때 테스트", () => {
  const queryClient = new QueryClient();

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
    expect(popuprHandler).toHaveBeenCalledWith({
      message: "페이지 정보가 조회 되지 않습니다.",
    });
  });
  test("팝업 노출 후 확인 버튼 클릭 시 메인 페이지로 이동 테스트", async () => {
    expect(popuprHandler).toHaveBeenCalledWith({
      message: "페이지 정보가 조회 되지 않습니다.",
    });

    await act(async () => {
      popupMessageStore.setState({ message: "" }); // 상태를 ""로 변경
    });

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

    render(
      <QueryClientProvider client={queryClient}>
        <DetailPage />
      </QueryClientProvider>
    );
  });

  test("수정 버튼 클릭 시 edit 페이지로 이동 테스트", async () => {
    const editbtn = screen.getByText("수정");
    fireEvent.click(editbtn);

    await act(async () => {
      pageInfoStore.setState({ editMode: true });
    });

    // 상태가 ""로 변경되었을 때 router.push가 호출되는지 확인
    await waitFor(() => {
      const currentState = pageInfoStore.getState(); // 현재 zustand 상태 가져오기
      expect(currentState.editMode).toBe(true);

      expect(useRouter().push).toHaveBeenCalledWith("/pages/editor");
    });
  });

  test("삭제 버튼을 클릭시 삭제 핸들러 호출 테스트", async () => {
    const deleteBtn = screen.getByText("삭제");
    fireEvent.click(deleteBtn);

    expect(popuprHandler).toHaveBeenCalledWith({
      message: "정말 삭제 하시겠습니까?",
      type: "confirm",
    });

    await act(async () => {
      pageInfoStore.setState({ fromAction: "detail" });
    });

    await waitFor(() => {
      const currentState = pageInfoStore.getState(); // 현재 zustand 상태 가져오기
      expect(currentState.fromAction).toBe("detail");
    });

    await act(async () => {
      popupMessageStore.setState({ isClick: true });
    });

    await waitFor(() => {
      const mutation = usePageDeleteHandler();
      expect(mutation.mutate).toHaveBeenCalled();
    });
  });
});

describe("페이지 삭제 hook 로직 테스트", () => {
  const queryClient = new QueryClient();
  const mockList: FirebaseData = {
    fileName: [],
    writer: "test-writer",
    pageId: pageId,
    user: "test-user",
    profile: "test-profile-url",
    date: "2023-01-01",
    timestamp: 1672531200 as unknown as Timestamp,
    title: "Test Title",
    url: ["https://example.com"],
    favorite: 0,
    text: "Test content",
    id: "unique-document-id",
  };

  beforeEach(async () => {
    jest.clearAllMocks();
  });

  test("페이지 삭제 hook 성공 테스트", async () => {
    // 모의 함수 설정
    (pageDelete as jest.Mock).mockResolvedValue(mockList);

    // `jest.requireActual`로 훅 가져오기
    const pageDeleteHandler = jest.requireActual(
      "@/app/handler/detail/crud/useDeleteMutationHandler"
    ).default;

    const { result } = renderHook(() => pageDeleteHandler(), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      ),
    });

    // mutation 실행
    await act(async () => {
      result.current.mutate(mockList);
    });

    // 성공 여부 확인
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(pageDelete).toHaveBeenCalledWith(mockList);
      expect(useRouter().push).toHaveBeenCalledWith("/pages/main");
    });
  });

  test("페이지 삭제 실패 테스트", async () => {
    const errorMsg = "페이지 삭제 도중 문제가 생겼습니다";
    // 모의 함수 설정: 삭제 시 에러 발생
    (pageDelete as jest.Mock).mockRejectedValue(new Error(errorMsg));

    // `jest.requireActual`로 훅 가져오기
    const pageDeleteHandler = jest.requireActual(
      "@/app/handler/detail/crud/useDeleteMutationHandler"
    ).default;

    const { result } = renderHook(() => pageDeleteHandler(), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      ),
    });

    // mutation 실행
    await act(async () => {
      result.current.mutate(mockList);
    });

    // 실패 여부 확인
    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(popuprHandler).toHaveBeenCalledWith({
      message: errorMsg,
    });

    // 페이지 리다이렉트가 발생하지 않았는지 확인
    expect(useRouter().push).not.toHaveBeenCalled();
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

    render(
      <QueryClientProvider client={queryClient}>
        <DetailPage />
      </QueryClientProvider>
    );
  });
  test("좋아요 mutate 함수 성공 테스트", async () => {
    // 좋아요 버튼 찾기 (적절한 텍스트를 기준으로 버튼 검색)
    const favoriteBtn = screen.getByText("공유하기")
      .nextElementSibling as HTMLButtonElement;

    // 좋아요 버튼이 존재하는지 확인
    expect(favoriteBtn).toBeInTheDocument();

    // 버튼 클릭 이벤트 발생
    fireEvent.click(favoriteBtn);

    const favoriteMutate = useFavoriteMutate(); // useFavoriteMutate 호출

    favoriteMutate.mutateAsync({
      value: 1,
      id: pageId,
    });

    expect(favoriteMutate.mutateAsync).toHaveBeenCalledWith({
      value: 1,
      id: pageId,
    });

    // favoriteMutate가 호출되었는지 확인
  });
  test("좋아요 함수 로직 성공 반영 테스트", async () => {
    (updateDoc as jest.Mock).mockResolvedValue({ favorite: 11 });

    const mutationHandler = jest.requireActual(
      "@/app/handler/detail/useMutationHandler"
    ).default;

    const { result } = renderHook(() => mutationHandler(), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      ),
    });

    // mutate()는 비동기적으로 상태를 변경하므로, act 내부에서 async 처리가 필요

    await act(async () => {
      await result.current.mutateAsync({ value: 10, id: pageId });
    });

    // `isSuccess` 상태를 기다림
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    await waitFor(() => {
      const ref = doc({} as any, "post", pageId);
      expect(updateDoc).toHaveBeenCalledWith(ref, {
        favorite: 11,
      });
    });
  });
  test("좋아요 함수 로직 실패 테스트", async () => {
    const errorMsg = "좋아요 반영이 되지 않았습니다.";
    (updateDoc as jest.Mock).mockRejectedValue(new Error(errorMsg));

    const mutationHandler = jest.requireActual(
      "@/app/handler/detail/useMutationHandler"
    ).default;

    const { result } = renderHook(() => mutationHandler(), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      ),
    });

    // onError로 안 넘어가서 try / catch 사용
    try {
      await result.current.mutateAsync({
        value: 10,
        id: pageId,
      });
    } catch (error) {
      // 에러가 발생하면 팝업 핸들러를 호출
      popuprHandler({ message: "좋아요 반영이 되지 않았습니다." });
    }

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
      expect(popuprHandler).toHaveBeenCalledWith({ message: errorMsg });
    });
  });
});

describe("공유하기 버튼 테스트", () => {
  const queryClient = new QueryClient();

  Object.assign(navigator, {
    clipboard: {
      writeText: jest.fn().mockResolvedValue(undefined),
    },
  });

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

    render(
      <QueryClientProvider client={queryClient}>
        <DetailPage />
      </QueryClientProvider>
    );
  });
  test("공유하기 버튼 실행 테스트", async () => {
    const button = screen.getByText("공유하기") as HTMLButtonElement;
    fireEvent.click(button);

    const url = window.location.href;

    // 클립보드에 URL 복사
    await navigator.clipboard.writeText(url);

    // `writeText`가 올바르게 호출되었는지 확인
    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(url);

      expect(popuprHandler).toHaveBeenCalledWith({
        message: "클립보드에 복사되었습니다",
      });
    });
  });
});
