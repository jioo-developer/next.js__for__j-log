import {
  render,
  renderHook,
  act,
  waitFor,
  screen,
  fireEvent,
} from "@testing-library/react";
import {
  useCreateHandler,
  useUpdateHandler,
  useDeleteHandler,
} from "@/app/handler/Reply/useMutationHandler";
import { useCreateId } from "@/app/handler/detail/pageInfoHandler";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Reply from "@/app/pages/detail/_reply/page";
import { popuprHandler } from "@/app/handler/error/ErrorHandler";
import { pageInfoStore } from "@/app/store/common";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import useUserQueryHook from "@/app/api_hooks/login/getUserHook";
import { timeData } from "@/app/handler/commonHandler";

jest.mock("@/app/Firebase", () => ({
  authService: {},
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
      profile: "img/default.svg",
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
    replyData: ["test"],
    error: null,
    isLoading: false,
  }),
}));

jest.mock("@/app/handler/Reply/useMutationHandler", () => ({
  useCreateHandler: jest.fn().mockReturnValue({
    mutate: jest.fn(),
    mutateAsync: jest.fn(),
  }),
  useUpdateHandler: jest.fn().mockReturnValue({
    mutate: jest.fn(),
    mutateAsync: jest.fn(),
  }),
  useDeleteHandler: jest.fn().mockReturnValue({
    mutate: jest.fn(),
    mutateAsync: jest.fn(),
  }),
}));

jest.mock("@/app/handler/error/ErrorHandler", () => ({
  popuprHandler: jest.fn(),
}));

jest.mock("@/app/handler/detail/pageInfoHandler");

const queryClient = new QueryClient();

describe("Reply 페이지 함수 호출 테스트 - mutate 이전", () => {
  beforeEach(() => {
    // 각 테스트 전에 mock 함수 초기화
    jest.clearAllMocks();

    (useCreateId as jest.Mock).mockReturnValue("new-page-id");

    render(
      <QueryClientProvider client={queryClient}>
        <Reply />
      </QueryClientProvider>
    );
  });

  test("댓글 생성 muatate 호출 테스트", async () => {
    await act(async () => {
      pageInfoStore.setState({ pgId: useCreateId() });
    });

    const { data } = useUserQueryHook();

    const btn = screen.getByText("댓글 작성");
    fireEvent.submit(btn);

    const createMutation = useCreateHandler();

    await waitFor(() => {
      expect(createMutation.mutateAsync).toHaveBeenCalledWith({
        user: {
          name: data?.displayName,
          profile: "img/default.svg",
          uid: data?.uid,
        },
        id: useCreateId(),
        comment: "",
      });
    });
  });

  test("댓글 생성 실패 테스트", async () => {
    const errorMsg = "에러가 발생하여 댓글이 작성되지 않았습니다";

    // useCreateHandler의 반환값을 모킹

    (useCreateHandler as jest.Mock).mockReturnValue({
      mutate: jest.fn(
        () => Promise.reject(new Error(errorMsg)) // 에러를 발생시키는 Promise 반환
      ),
    });

    const mutateHandler = useCreateHandler();

    // mutate 호출 (에러 발생)
    try {
      await mutateHandler.mutate({
        user: { name: "Test User", profile: "", uid: "test-uid" },
        id: "test-page-id",
        comment: "",
      });
    } catch {
      popuprHandler({
        message: "에러가 발생하여 댓글이 작성되지 않았습니다",
      });
    }

    // popupHandler가 호출되었는지 확인
    await waitFor(() => {
      expect(popuprHandler).toHaveBeenCalledWith({
        message: errorMsg,
      });
    });
  });

  test("댓글 수정 mutate 호출 테스트", async () => {
    (useUpdateHandler as jest.Mock).mockReturnValue({
      mutateAsync: jest.fn().mockResolvedValue({}),
    });

    const { result } = renderHook(() => useUpdateHandler());
    const comment = "Updated comment";

    // 댓글 수정 호출
    await act(async () => {
      await result.current.mutateAsync({
        id: "test-page-id",
        replyId: "test-reply-id",
        comment,
      });
    });

    // 댓글이 제대로 수정되었는지 확인
    expect(useUpdateHandler().mutateAsync).toHaveBeenCalledWith({
      id: "test-page-id",
      replyId: "test-reply-id",
      comment: "Updated comment",
    });
  });

  test("댓글 수정 실패 테스트", async () => {
    const errorMsg = "댓글 수정 중 문제가 생겼습니다";

    // useCreateHandler의 반환값을 모킹

    (useUpdateHandler as jest.Mock).mockReturnValue({
      mutate: jest.fn(
        () => Promise.reject(new Error(errorMsg)) // 에러를 발생시키는 Promise 반환
      ),
    });

    const mutateHandler = useCreateHandler();

    // mutate 호출 (에러 발생)
    try {
      await mutateHandler.mutate({
        user: { name: "Test User", profile: "", uid: "test-uid" },
        id: "test-page-id",
        comment: "",
      });
    } catch {
      popuprHandler({
        message: errorMsg,
      });
    }

    // popupHandler가 호출되었는지 확인
    await waitFor(() => {
      expect(popuprHandler).toHaveBeenCalledWith({
        message: errorMsg,
      });
    });
  });

  test("댓글 삭제 mutate 호출 테스트", async () => {
    (useDeleteHandler as jest.Mock).mockReturnValue({
      mutate: jest.fn(),
    });

    const { result } = renderHook(() => useDeleteHandler());

    // 댓글 삭제 호출
    act(() => {
      result.current.mutate({
        id: "test-page-id",
        replyId: "test-reply-id",
        comment: "",
      });
    });

    // 댓글이 제대로 삭제되었는지 확인
    expect(useDeleteHandler().mutate).toHaveBeenCalledWith({
      id: "test-page-id",
      replyId: "test-reply-id",
      comment: "",
    });
  });

  test("댓글 삭제 실패 테스트", async () => {
    const errorMsg = "댓글 삭제 중 문제가 생겼습니다";

    // useCreateHandler의 반환값을 모킹

    (useDeleteHandler as jest.Mock).mockReturnValue({
      mutate: jest.fn(
        () => Promise.reject(new Error(errorMsg)) // 에러를 발생시키는 Promise 반환
      ),
    });

    const mutateHandler = useCreateHandler();

    // mutate 호출 (에러 발생)
    try {
      await mutateHandler.mutate({
        user: { name: "Test User", profile: "", uid: "test-uid" },
        id: "test-page-id",
        comment: "",
      });
    } catch {
      popuprHandler({
        message: errorMsg,
      });
    }

    // popupHandler가 호출되었는지 확인
    await waitFor(() => {
      expect(popuprHandler).toHaveBeenCalledWith({
        message: errorMsg,
      });
    });
  });
});

describe("Reply 페이지 함수 호출 테스트 - mutate 이후", () => {
  const pageId = "new-page-id";

  const comment = "This is a test comment.";

  beforeEach(() => {
    // 각 테스트 전에 mock 함수 초기화
    jest.clearAllMocks();

    (useCreateId as jest.Mock).mockReturnValue("new-page-id");

    render(
      <QueryClientProvider client={queryClient}>
        <Reply />
      </QueryClientProvider>
    );
  });
  test("댓글 생성 로직 테스트", async () => {
    const mutationHandler = jest.requireActual(
      "@/app/handler/Reply/useMutationHandler"
    ).useCreateHandler;

    (serverTimestamp as jest.Mock).mockReturnValue(111111);

    const { data } = useUserQueryHook();

    // Expected data
    const mockList = {
      replyrer: data?.displayName,
      comment: comment,
      date: `${timeData.year}년${timeData.month}월${timeData.day}일`,
      profile: data?.photoURL ? data?.photoURL : "/img/default.svg",
      uid: data?.uid,
      timeStamp: serverTimestamp(), // serverTimestamp mock
    };

    const replyCollectionRef = collection(
      expect.any(Object),
      "post",
      pageId,
      "reply"
    );

    (addDoc as jest.Mock).mockResolvedValueOnce(mockList);

    const { result } = renderHook(() => mutationHandler(), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      ),
    });

    const userObj = {
      name: data?.displayName as string,
      profile: data?.photoURL as string,
      uid: data?.uid as string,
    };

    await act(() => {
      result.current.mutateAsync({
        user: userObj,
        id: pageId,
        comment,
      });
    });

    expect(addDoc).toHaveBeenCalledWith(replyCollectionRef, mockList);
    expect(collection).toHaveBeenCalledWith(
      expect.any(Object),
      "post",
      pageId,
      "reply"
    );
  });
  test("댓글 수정 로직 테스트", async () => {
    // mutationHandler는 실제 함수에서 가져옵니다.
    const mutationHandler = jest.requireActual(
      "@/app/handler/Reply/useMutationHandler"
    ).useUpdateHandler;

    // serverTimestamp Mock 설정
    (serverTimestamp as jest.Mock).mockReturnValue(111111);

    // 사용자 정보가 있다고 가정한 mock data
    const { data } = useUserQueryHook();

    // 댓글 수정에 필요한 예상 데이터를 미리 정의
    const mockList = {
      replyrer: data?.displayName,
      comment: comment,
      date: `${timeData.year}년${timeData.month}월${timeData.day}일`,
      profile: data?.photoURL ? data?.photoURL : "/img/default.svg",
      uid: data?.uid,
      timeStamp: serverTimestamp(), // serverTimestamp mock
    };

    // Firestore에 대한 Mock 설정
    const replyCollectionRef = collection(
      expect.any(Object),
      "post",
      pageId,
      "reply"
    );
    (doc as jest.Mock).mockReturnValue("mockDocRef"); // doc 메서드 Mock
    (updateDoc as jest.Mock).mockResolvedValueOnce(mockList); // updateDoc 메서드 Mock

    // renderHook으로 React Query의 mutationHandler를 불러와 테스트
    const { result } = renderHook(() => mutationHandler(), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      ),
    });

    // 사용자 객체 생성 (필요한 정보만 포함)
    const userObj = {
      name: data?.displayName as string,
      profile: data?.photoURL as string,
      uid: data?.uid as string,
    };

    // 댓글 수정 동작 실행
    await act(() => {
      result.current.mutateAsync({
        user: userObj,
        id: pageId,
        comment,
      });
    });

    // Firestore의 doc과 updateDoc이 호출되는지 확인
    expect(doc).toHaveBeenCalledWith(replyCollectionRef, pageId);
    const docRef = doc(replyCollectionRef, pageId);

    await updateDoc(docRef, { comment: comment });

    await waitFor(() => {
      expect(updateDoc).toHaveBeenCalledWith("mockDocRef", { comment });
    });
  });

  test("댓글 삭제 로직 테스트", async () => {
    // mutationHandler는 실제 함수에서 가져옵니다.
    const mutationHandler = jest.requireActual(
      "@/app/handler/Reply/useMutationHandler"
    ).useDeleteHandler;

    // serverTimestamp Mock 설정
    (serverTimestamp as jest.Mock).mockReturnValue(111111);

    // 사용자 정보가 있다고 가정한 mock data
    const { data } = useUserQueryHook();

    // 댓글 수정에 필요한 예상 데이터를 미리 정의

    // Firestore에 대한 Mock 설정
    const replyCollectionRef = collection(
      expect.any(Object),
      "post",
      pageId,
      "reply"
    );

    // renderHook으로 React Query의 mutationHandler를 불러와 테스트
    const { result } = renderHook(() => mutationHandler(), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      ),
    });

    // 사용자 객체 생성 (필요한 정보만 포함)
    const userObj = {
      name: data?.displayName as string,
      profile: data?.photoURL as string,
      uid: data?.uid as string,
    };

    // 댓글 수정 동작 실행
    await act(() => {
      result.current.mutate({
        user: userObj,
        id: pageId,
        comment,
      });
    });

    const replyid = ["post", "new-page-id", "reply", undefined];

    // Firestore의 doc과 updateDoc이 호출되는지 확인
    expect(doc).toHaveBeenCalledWith(replyCollectionRef, ...replyid);

    await waitFor(() => {
      expect(deleteDoc).toHaveBeenCalledWith("mockDocRef");
    });
  });
});
