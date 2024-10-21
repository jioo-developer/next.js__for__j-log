import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import EditorPage from "@/app/pages/editor/page";
import useCreateMutation from "@/app/handler/detail/crud/useMutationHandler";
import { useCreateId } from "@/app/handler/detail/pageInfoHandler";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { create } from "zustand";
import setDataHandler from "@/app/handler/detail/crud/setDataHandler";
import { getElement, lenderingCheck } from "./utils";
import useDetailQueryHook, {
  FirebaseData,
} from "@/app/api_hooks/detail/getDetailHook";
import {
  CreateImgUrl,
  ImageDeleteHandler,
  LoadImageHandler,
} from "@/app/handler/detail/crud/imageCrudHandler";

// 필요한 훅과 모듈을 모킹

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

// 사용자 정보 모킹

jest.mock("@/app/api_hooks/login/getUserHook", () => ({
  __esModule: true, // ES 모듈로 인식되도록 설정
  default: jest.fn().mockReturnValue({
    data: { uid: "user-id", displayName: "Test User" },
    error: null,
    isLoading: false,
  }),
}));

jest.mock("@/app/api_hooks/detail/getDetailHook", () => ({
  __esModule: true, // ES 모듈로 인식되도록 설정
  default: jest.fn().mockReturnValue({
    pageData: { title: "", text: "", url: [] },
    error: null,
    isLoading: false,
  }),
}));

jest.mock("@/app/handler/detail/pageInfoHandler", () => ({
  useCreateId: jest.fn(),
}));
jest.mock("@/app/handler/detail/crud/setDataHandler");

jest.mock("@/app/handler/detail/crud/imageCrudHandler", () => ({
  LoadImageHandler: jest.fn(),
  CreateImgUrl: jest.fn(),
  ImageDeleteHandler: jest.fn(),
}));

jest.mock("@/app/handler/detail/crud/useMutationHandler");

(useCreateMutation as jest.Mock).mockReturnValue({
  mutate: jest.fn(),
});

describe("Post & Edit 페이지 랜더링 테스트", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <EditorPage />
      </QueryClientProvider>
    );
  });
  test("Element 랜더링 체크", () => {
    lenderingCheck();
  });
  test("createHandler 호출 성공 테스트", async () => {
    const { form, input, textarea } = getElement();

    fireEvent.change(input, {
      target: { value: "Test Title" },
    });
    fireEvent.change(textarea, {
      target: { value: "Test content" },
    });

    fireEvent.submit(form);
    await waitFor(() => {
      expect(setDataHandler).toHaveBeenCalled();
    });
  });
  test("createHandler 호출 실패 테스트", async () => {
    const { form, input, textarea } = getElement();

    fireEvent.change(input, {
      target: { value: "" },
    });
    fireEvent.change(textarea, {
      target: { value: "Test content" },
    });

    fireEvent.submit(form);
    await waitFor(() => {
      expect(setDataHandler).not.toHaveBeenCalled();
    });
  });
});

describe("Post & Edit 페이지 CreateHandler 테스트", () => {
  const usePageInfoStore = create(() => ({
    pgId: "",
    editMode: false,
  }));

  beforeEach(() => {
    jest.clearAllMocks();
    // 페이지 정보 스토어 초기화
    (useCreateId as jest.Mock).mockReturnValue("new-page-id");

    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <EditorPage />
      </QueryClientProvider>
    );
  });

  beforeEach(() => {
    const { form, input, textarea } = getElement();

    fireEvent.change(input, {
      target: { value: "Test Title" },
    });
    fireEvent.change(textarea, {
      target: { value: "Test content" },
    });

    fireEvent.submit(form);
  });

  test("CreateHandler가 실행 되었을 때 editMode가 true 일 때 테스트", () => {
    usePageInfoStore.setState({ editMode: true, pgId: "new-page-id" });
    const storeState = usePageInfoStore.getState();
    expect(storeState.editMode).toBe(true);

    const { pageData } = useDetailQueryHook(useCreateId());

    const content = {
      title: "Mock Title",
      text: "This is some mock text.",
      file: [
        new File(["file content 1"], "file1.png", { type: "image/png" }),
        new File(["file content 2"], "file2.jpg", { type: "image/jpeg" }),
      ],
      previewImg: [
        "http://example.com/preview1.png",
        "http://example.com/preview2.png",
      ],
      pageInfo: "mockPageId",
      editMode: false,
      priority: true,
      url: "http://example.com/uploadedImage.png", // CreateImgUrl 함수가 반환할 값
    };

    const obj = { ...(pageData as FirebaseData) };
    const assignSpy = jest.spyOn(Object, "assign");

    const resultObj = Object.assign(obj, content);

    expect(assignSpy).toHaveBeenCalled();

    expect(assignSpy).toHaveBeenCalledWith(obj, content);

    assignSpy.mockRestore();

    const postMutate = useCreateMutation();

    postMutate.mutate({
      data: resultObj as any, // data에 resultObj 전달
      pageId: storeState.pgId,
    });

    expect(postMutate.mutate).toHaveBeenCalledWith({
      data: resultObj,
      pageId: storeState.pgId,
    });
  });
  test("CreateHandler가 실행 되었을 때 editMode가 false 일 때 테스트", async () => {
    usePageInfoStore.setState({ editMode: false, pgId: "new-page-id" });
    const storeState = usePageInfoStore.getState();
    expect(storeState.editMode).toBe(false);

    (CreateImgUrl as jest.Mock).mockReturnValue([]);

    const addContent = {
      fileName: [],
      pageId: "new-page-id",
      priority: false,
      text: "Test content",
      title: "Test Title",
      url: [],
    };
    await waitFor(() => {
      expect(setDataHandler).toHaveBeenCalledWith(addContent);
    });

    const postMutate = useCreateMutation();

    postMutate.mutate({
      data: addContent as any, // data에 resultObj 전달
      pageId: storeState.pgId,
    });

    expect(postMutate.mutate).toHaveBeenCalledWith({
      data: addContent,
      pageId: storeState.pgId,
    });
  });
});
