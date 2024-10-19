import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from "@testing-library/react";
import EditorPage from "@/app/pages/editor/page";
import { pageInfoStore } from "@/app/store/common";
import useCreateMutation from "@/app/handler/detail/crud/useMutationHandler";
import { useCreateId } from "@/app/handler/detail/pageInfoHandler";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { create } from "zustand";
import setDataHandler from "@/app/handler/detail/crud/setDataHandler";
import useUserQueryHook from "@/app/api_hooks/login/getUserHook";

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

jest.mock("@/app/handler/detail/pageInfoHandler");
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

const getElement = () => {
  const form = screen.getByRole("form") as HTMLFormElement;
  const input = within(form).getByPlaceholderText(
    "내용을 입력하세요."
  ) as HTMLInputElement;
  const textarea = within(form).getAllByRole(
    "textbox"
  )[1] as HTMLTextAreaElement;
  const fileInputLabel = within(form).getByLabelText(
    "이미지를 담아주세요"
  ) as HTMLLabelElement;
  const exitBtn = within(form).getAllByRole("button")[0] as HTMLButtonElement;
  const submitBtn = screen.getByText("글작성");
  return { form, input, textarea, fileInputLabel, exitBtn, submitBtn };
};

describe("Post & Edit 페이지 테스트", () => {
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

    expect(input.value).not.toBe("");
    expect(textarea.value).not.toBe("");
    fireEvent.submit(form);
  });

  test("에디터 폼이 렌더링 되는지 확인", () => {
    // 제목, 텍스트, 파일 업로드, 글작성 버튼이 있는지 확인
    const { form, input, textarea, fileInputLabel, exitBtn, submitBtn } =
      getElement();
    expect(form).toBeInTheDocument();
    expect(input).toBeInTheDocument();
    expect(textarea).toBeInTheDocument();
    expect(fileInputLabel).toBeInTheDocument();
    expect(exitBtn).toBeInTheDocument();
    expect(submitBtn).toBeInTheDocument();
  });

  test("createHandler 함수 실행 테스트", async () => {
    // createHandler가 실행 됐을 때 setDataHandler를 호출 하는지

    await waitFor(() => {
      expect(setDataHandler).toHaveBeenCalled();
    });
  });

  test("CreateHandler가 실행 되었을 때 editMode가 true 일 때 테스트", () => {
    usePageInfoStore.setState({ editMode: true, pgId: "new-page-id" });
    const storeState = usePageInfoStore.getState();
    expect(storeState.editMode).toBe(true);
    const resultObj = {
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

    await waitFor(() => {
      expect(setDataHandler).toHaveBeenCalled();
    });

    const addContent = {
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
