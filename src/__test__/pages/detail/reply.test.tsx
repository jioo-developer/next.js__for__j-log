import {
  renderHook,
  act,
  waitFor,
  render,
  screen,
  fireEvent,
} from "@testing-library/react";
import { mockReplyData } from "./utils";
import { useCreateId } from "@/app/handler/detail/pageInfoHandler";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { popuprHandler } from "@/app/handler/error/ErrorHandler";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { timeData } from "@/app/handler/commonHandler";
import Reply from "@/app/pages/detail/_reply/page";
import {
  useCreateHandler,
  useDeleteHandler,
  useUpdateHandler,
} from "@/app/handler/Reply/useMutationHandler";
import { MyContextProvider } from "@/app/pages/detail/_reply/context";
import ReplyItem from "@/app/pages/detail/_reply/ReplyItem";
import { pageInfoStore, popupMessageStore } from "@/app/store/common";
import ReplyUpdate from "@/app/handler/Reply/replyUpdateHandler";

jest.mock("@/app/Firebase", () => ({
  authService: {
    currentUser: {
      uid: "test-uid",
      displayName: "Test User",
      profile: "/img/default.svg",
    },
  },
  db: jest.fn().mockReturnValue({}),
}));

jest.mock("firebase/firestore", () => ({
  doc: jest.fn(),
  addDoc: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
  getDocs: jest.fn(),
  collection: jest.fn(),
  serverTimestamp: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
  }),
}));

jest.mock("@/app/api_hooks/login/getUserHook", () => ({
  __esModule: true, // ES 모듈로 인식되도록 설정
  default: jest.fn().mockReturnValue({
    data: {
      uid: "test-uid",
      displayName: "Test User",
      profile: "/img/default.svg",
    },
    error: null,
    isLoading: false,
  }),
}));

jest.mock("@/app/api_hooks/detail/getDetailHook", () => ({
  __esModule: true, // ES 모듈로 인식되도록 설정
  default: jest.fn().mockReturnValue({
    pageData: { title: "test title", text: "test text", url: [] },
    error: null,
    isLoading: false,
  }),
}));

jest.mock("@/app/api_hooks/Reply/getReplyHook", () => ({
  __esModule: true, // ES 모듈로 인식되도록 설정
  useReplyQueryHook: jest.fn().mockReturnValue({
    replyData: mockReplyData,
    error: null,
    isLoading: false,
  }),
}));

jest.mock("@/app/handler/Reply/useMutationHandler", () => ({
  useCreateHandler: jest.fn().mockReturnValue({
    mutate: jest.fn(),
  }),
  useUpdateHandler: jest.fn().mockReturnValue({
    mutate: jest.fn(),
  }),
  useDeleteHandler: jest.fn().mockReturnValue({
    mutate: jest.fn(),
  }),
}));

jest.mock("@/app/handler/error/ErrorHandler", () => ({
  popuprHandler: jest.fn(),
  popupInit: jest.fn(),
}));

jest.mock("@/app/handler/detail/pageInfoHandler");

const queryClient = new QueryClient();

const pageId = "new-page-id";

const comment = "This is a test comment.";

const replyObj = {
  user: {
    uid: "test-uid",
    name: "Test User",
    profile: "/img/default.svg",
  },
  id: pageId,
  comment,
};

(useCreateId as jest.Mock).mockReturnValue("new-page-id");

(serverTimestamp as jest.Mock).mockReturnValue(111111);

jest.mock("@/app/handler/reply/replyUpdateHandler", () => ({
  __esModule: true, // ES 모듈로 처리
  default: jest.fn(),
}));

describe("Reply 페이지 테스트 ", () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    await act(async () => {
      pageInfoStore.setState({ pgId: useCreateId() });
    });
  });

  test("Reply Item 랜더링 테스트", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MyContextProvider>
          <Reply />
        </MyContextProvider>
      </QueryClientProvider>
    );
    expect(screen.getByText("This is a test comment")).toBeInTheDocument();
    expect(screen.getByText("Another comment")).toBeInTheDocument();
  });

  test("댓글 작성 테스트", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MyContextProvider>
          <Reply />
        </MyContextProvider>
      </QueryClientProvider>
    );

    const textarea = screen.getByPlaceholderText("댓글을 입력하세요");
    fireEvent.change(textarea, { target: { value: "New comment" } });
    expect(textarea).toHaveValue("New comment");

    const submitButton = screen.getByRole("button", { name: "댓글 작성" });
    fireEvent.click(submitButton);

    const mutation = useCreateHandler();

    await waitFor(() => {
      expect(mutation.mutate).toHaveBeenCalledWith({
        user: replyObj.user,
        id: pageId,
        comment: "New comment",
      });
    });
  });

  test("댓글 수정 테스트", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MyContextProvider>
          <ReplyItem
            item={mockReplyData[0]}
            index={0}
            replyData={mockReplyData}
            pageId="pageId"
          />
        </MyContextProvider>
      </QueryClientProvider>
    );

    const editButton = screen.getByText("수정");
    fireEvent.click(editButton);

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "Updated comment" } });
    expect(input).toHaveValue("Updated comment");

    const updateButton = screen.getByText("완료");
    fireEvent.click(updateButton);

    const mutation = useUpdateHandler();

    await waitFor(() => {
      expect(mutation.mutate).toHaveBeenCalledWith({
        id: "pageId",
        replyId: mockReplyData[0].id,
        comment: "Updated comment",
      });
    });
  });

  test("댓글 삭제 테스트", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MyContextProvider>
          <ReplyItem
            item={mockReplyData[0]}
            index={0}
            replyData={mockReplyData}
            pageId={pageId}
          />
        </MyContextProvider>
      </QueryClientProvider>
    );

    // 삭제 버튼 클릭
    const deleteButton = screen.getByText("삭제");
    fireEvent.click(deleteButton);

    // 팝업 핸들러가 호출되었는지 확인
    expect(popuprHandler).toHaveBeenCalledWith({
      message: "댓글을 정말로 삭제하시겠습니까?",
      type: "confirm",
    });

    await act(async () => {
      popupMessageStore.setState({ isClick: true });
    });

    const currentState = pageInfoStore.getState();
    const popupState = popupMessageStore.getState();

    expect(currentState.fromAction).toBe("reply");
    expect(popupState.isClick).toBe(true);

    const mutation = useDeleteHandler();

    await waitFor(() => {
      expect(mutation.mutate).toHaveBeenCalledWith({
        id: pageId,
        replyId: mockReplyData[0].id,
      });
    });
  });
});

describe("Reply 페이지 로직 테스트", () => {
  // Expected data
  const mockList = {
    replyrer: replyObj.user.name,
    comment: comment,
    date: `${timeData.year}년${timeData.month}월${timeData.day}일`,
    profile: "/img/default.svg",
    uid: replyObj.user.uid,
    timeStamp: serverTimestamp(), // serverTimestamp mock
  };

  beforeEach(() => {
    // 각 테스트 전에 mock 함수 초기화
    jest.clearAllMocks();

    (doc as jest.Mock).mockImplementation(
      (dbInstance, collection, documentId) => {
        if (
          dbInstance === ({} as any) &&
          collection === "post" &&
          documentId === "testId"
        ) {
          return true;
        }
      }
    );

    (collection as jest.Mock).mockImplementation(
      (db, collectionPath, id, subCollection) => {
        if (
          db === ({} as any) &&
          collectionPath === "post" &&
          id === "testId" &&
          subCollection === "reply"
        ) {
          return true;
        }
      }
    );

    (doc as jest.Mock).mockImplementation(
      (dbInstance, collection, documentId) => {
        if (
          dbInstance === ({} as any) &&
          collection === "post" &&
          documentId === "testId"
        ) {
          return true;
        }
      }
    );
  });

  test("댓글 생성 로직 테스트", async () => {
    const ref = collection({} as any, "post", pageId, "reply");

    const mutationHandler = jest.requireActual(
      "@/app/handler/Reply/useMutationHandler"
    ).useCreateHandler;

    const { result } = renderHook(() => mutationHandler(), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      ),
    });

    await act(async () => {
      result.current.mutate({
        user: replyObj.user,
        id: pageId,
        comment,
      });
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(collection).toHaveBeenCalledWith({}, "post", pageId, "reply");
      expect(addDoc).toHaveBeenCalledWith(ref, mockList);
    });
  });

  test("댓글 생성 로직 실패 테스트", async () => {
    const errorMsg = "에러가 발생하여 댓글이 작성되지 않았습니다";

    (addDoc as jest.Mock).mockRejectedValueOnce(new Error(errorMsg));

    const mutationHandler = jest.requireActual(
      "@/app/handler/Reply/useMutationHandler"
    ).useCreateHandler;

    const { result } = renderHook(() => mutationHandler(), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      ),
    });
    await act(async () => {
      try {
        await result.current.mutate(replyObj);
      } catch {
        popuprHandler({ message: errorMsg });
      }
    });

    // 에러 발생 후 처리 확인
    await waitFor(() => {
      expect(result.current.isError).toBe(true);
      expect(popuprHandler).toHaveBeenCalledWith({ message: errorMsg });
    });
  });

  test("댓글 수정 로직 테스트", async () => {
    (ReplyUpdate as jest.Mock).mockResolvedValueOnce(comment);

    let updatedComment: string | Error;

    const mutationHandler = jest.requireActual(
      "@/app/handler/Reply/useMutationHandler"
    ).useUpdateHandler;

    // renderHook으로 React Query의 mutationHandler를 불러와 테스트
    const { result } = renderHook(() => mutationHandler(), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      ),
    });

    // 댓글 수정 동작 실행
    await act(async () => {
      result.current.mutate({
        user: replyObj.user,
        id: pageId,
        comment,
      });

      updatedComment = await ReplyUpdate({
        id: "postId",
        replyId: "replyId",
        comment,
      });
    });

    await waitFor(() => {
      // ReplyUpdate 함수가 올바른 값으로 호출되었는지 확인
      expect(ReplyUpdate).toHaveBeenCalledWith({
        id: "postId",
        replyId: "replyId",
        comment,
      });

      // 함수가 올바른 값을 반환했는지 확인
      expect(updatedComment).toBe(comment);
    });
  });

  test("댓글 수정 로직 실패 테스트", async () => {
    const errorMsg = "댓글 수정 중 문제가 생겼습니다";

    (ReplyUpdate as jest.Mock).mockRejectedValueOnce(new Error(errorMsg));

    const mutationHandler = jest.requireActual(
      "@/app/handler/Reply/useMutationHandler"
    ).useUpdateHandler;

    const { result } = renderHook(() => mutationHandler(), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      ),
    });

    await act(async () => {
      try {
        result.current.mutate(replyObj);
      } catch {
        popuprHandler({ message: errorMsg });
      }
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
      expect(popuprHandler).toHaveBeenCalledWith({ message: errorMsg });
    });
  });

  test("댓글 삭제 로직 테스트", async () => {
    // mutationHandler는 실제 함수에서 가져옵니다.
    const mutationHandler = jest.requireActual(
      "@/app/handler/Reply/useMutationHandler"
    ).useDeleteHandler;

    // renderHook으로 React Query의 mutationHandler를 불러와 테스트
    const { result } = renderHook(() => mutationHandler(), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      ),
    });

    // 댓글 수정 동작 실행
    await act(async () => {
      result.current.mutate({
        user: replyObj.user,
        id: pageId,
        comment,
      });
    });

    const replyDocRef = doc(
      {} as any,
      "post",
      pageId,
      "reply",
      mockReplyData[0].id as string
    );

    await waitFor(() => {
      expect(deleteDoc).toHaveBeenCalledWith(replyDocRef);
    });
  });

  test("댓글 삭제 로직 실패 테스트", async () => {
    const errorMsg = "댓글 삭제 중 문제가 생겼습니다";

    (deleteDoc as jest.Mock).mockRejectedValueOnce(new Error(errorMsg));

    const mutationHandler = jest.requireActual(
      "@/app/handler/Reply/useMutationHandler"
    ).useDeleteHandler;

    const { result } = renderHook(() => mutationHandler(), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      ),
    });

    await act(async () => {
      try {
        result.current.mutate(replyObj);
      } catch {
        popuprHandler({ message: errorMsg });
      }
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
      expect(popuprHandler).toHaveBeenCalledWith({ message: errorMsg });
    });
  });
});
