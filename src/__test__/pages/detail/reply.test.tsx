import { render, renderHook, act, waitFor } from "@testing-library/react";
import {
  useCreateHandler,
  useUpdateHandler,
  useDeleteHandler,
} from "@/app/handler/detail-reply/useMutationHandler";
import { useCreateId } from "@/app/handler/detail/pageInfoHandler";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Reply from "@/app/pages/detail/_reply/page";
import { popuprHandler } from "@/app/handler/error/ErrorHandler";

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
    data: { uid: "user-id", displayName: "Test User" },
    error: null,
    isLoading: false,
  }),
}));

jest.mock("@/app/handler/detail-reply/useMutationHandler", () => ({
  useCreateHandler: jest.fn(),
  useUpdateHandler: jest.fn(),
  useDeleteHandler: jest.fn(),
}));

jest.mock("@/app/handler/detail/pageInfoHandler");

describe("Reply 페이지 테스트", () => {
  beforeEach(() => {
    // 각 테스트 전에 mock 함수 초기화
    jest.clearAllMocks();

    (useCreateId as jest.Mock).mockReturnValue("new-page-id");

    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <Reply />
      </QueryClientProvider>
    );
  });

  test("댓글 생성 성공 테스트", async () => {
    (useCreateHandler as jest.Mock).mockReturnValue({
      mutate: jest.fn(),
    });

    const { result } = renderHook(() => useCreateHandler());
    const comment = "Test comment";

    // 댓글 작성 호출
    act(() => {
      result.current.mutate({
        user: { name: "Test User", profile: "test-photo-url", uid: "test-uid" },
        id: "test-page-id",
        comment,
      });
    });

    // 댓글이 제대로 작성되었는지 확인
    expect(useCreateHandler().mutate).toHaveBeenCalledWith({
      user: {
        name: "Test User",
        profile: "test-photo-url",
        uid: "test-uid",
      },
      id: "test-page-id",
      comment: "Test comment",
    });
  });

  test("댓글 생성 실패 테스트", async () => {
    (useCreateHandler as jest.Mock).mockReturnValue({
      mutate: jest.fn(() => {
        new Error("Mutate function failed");
      }),
    });

    const { result } = renderHook(() => useCreateHandler());
    const comment = "Test comment";

    // 댓글 작성 호출
    act(() => {
      result.current.mutate({
        user: {
          uid: "user-id",
          name: "Test User",
          profile: "test-photo-url",
        },
        id: "test-page-id",
        comment,
      });
    });
    await waitFor(() => {
      // 댓글 작성 실패 시 popuprHandler가 호출되었는지 확인
      expect(popuprHandler).toHaveBeenCalledWith({
        message: "에러가 발생하여 댓글이 작성되지 않았습니다",
      });
    });
  });

  test("댓글 수정 성공 테스트", async () => {
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
    (useUpdateHandler as jest.Mock).mockReturnValue({
      mutateAsync: jest.fn(() => {
        new Error("Mutate function failed");
      }),
    });
    const { result } = renderHook(() => useUpdateHandler());
    const comment = "Updated comment";

    await act(async () => {
      await result.current.mutateAsync({
        id: "test-page-id",
        replyId: "test-reply-id",
        comment,
      });
    });

    // 댓글 수정 실패 시 popuprHandler가 호출되었는지 확인
    expect(popuprHandler).toHaveBeenCalledWith({
      message: "댓글 수정 중 문제가 생겼습니다",
    });
  });

  test("댓글 삭제 성공 테스트", async () => {
    const mockDeleteMutation = jest.fn();
    (useDeleteHandler as jest.Mock).mockReturnValue({
      mutate: mockDeleteMutation,
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
    expect(mockDeleteMutation).toHaveBeenCalledWith({
      id: "test-page-id",
      replyId: "test-reply-id",
      comment: "",
    });
  });
  test("댓글 삭제 실패 테스트", async () => {
    (useDeleteHandler as jest.Mock).mockReturnValue({
      mutate: jest.fn(() => {
        new Error("Mutate function failed");
      }),
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

    // 댓글 삭제 실패 시 popuprHandler가 호출되었는지 확인
    expect(popuprHandler).toHaveBeenCalledWith({
      message: "댓글 삭제 중 문제가 생겼습니다",
    });
  });
});
