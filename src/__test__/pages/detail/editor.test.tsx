import {
  render,
  fireEvent,
  waitFor,
  renderHook,
  act,
  screen,
} from "@testing-library/react";
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
import { CreateImgUrl } from "@/app/handler/detail/crud/imageCrudHandler";
import { useRouter } from "next/navigation";
import { setDoc } from "firebase/firestore";
import { popupInit, popuprHandler } from "@/app/handler/error/ErrorHandler";
import { ImageDeleteHandler } from "@/app/handler/detail/crud/imageCrudHandler";
import { popupMessageStore } from "@/app/store/common";
import useCashQueryHook from "@/app/api_hooks/common/getCashHook";

// 필요한 훅과 모듈을 모킹

jest.mock("@/app/Firebase", () => ({
  authService: {},
}));

jest.mock("firebase/firestore", () => ({
  setDoc: jest.fn(),
  doc: jest.fn(),
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

jest.mock("@/app/api_hooks/common/getCashHook", () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue({
    CashData: [
      {
        cash: 0,
        item: 0,
      },
    ],
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
  mutateAsync: jest.fn(),
});

describe("페이지 생성 & 수정 컴포넌트 랜더링 테스트", () => {
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
  test("onSubmit 조건 만족 시 함수 호출 테스트", async () => {
    const { form, input, textarea } = getElement();

    fireEvent.change(input, {
      target: { value: "Test Title" },
    });
    fireEvent.change(textarea, {
      target: { value: "Test content" },
    });

    await act(async () => {
      fireEvent.submit(form);
    });
    await waitFor(() => {
      expect(setDataHandler).toHaveBeenCalled();
    });
  });
  test("onSubmit 조건 비 만족 시 함수 미호출 테스트", async () => {
    const { form, input, textarea } = getElement();

    fireEvent.change(input, {
      target: { value: "" },
    });
    fireEvent.change(textarea, {
      target: { value: "Test content" },
    });

    await act(async () => {
      fireEvent.submit(form);
    });
    await waitFor(() => {
      expect(setDataHandler).not.toHaveBeenCalled();
    });
  });
});

describe("페이지 생성 & 수정 함수 호출 테스트", () => {
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

  beforeEach(async () => {
    const { form, input, textarea } = getElement();

    fireEvent.change(input, {
      target: { value: "Test Title" },
    });
    fireEvent.change(textarea, {
      target: { value: "Test content" },
    });

    await act(async () => {
      fireEvent.submit(form);
    });
  });

  test("페이지 생성 함수 호출 테스트", async () => {
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

    postMutate.mutateAsync({
      data: addContent as any, // data에 resultObj 전달
      pageId: storeState.pgId,
    });

    expect(postMutate.mutateAsync).toHaveBeenCalledWith({
      data: addContent,
      pageId: storeState.pgId,
    });
  });

  test("페이지 수정 함수 호출 테스트", () => {
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
});

describe("페이지 생성 & 수정 로직 테스트", () => {
  const queryClient = new QueryClient();
  beforeEach(() => {
    jest.clearAllMocks();
    (setDoc as jest.Mock).mockResolvedValue(true);
    // 페이지 정보 스토어 초기화
    (useCreateId as jest.Mock).mockReturnValue("new-page-id");

    render(
      <QueryClientProvider client={queryClient}>
        <EditorPage />
      </QueryClientProvider>
    );
  });
  test("CreateHandler 함수 성공 테스트", async () => {
    const mutationHandler = jest.requireActual(
      "@/app/handler/detail/crud/useMutationHandler"
    ).default;

    const pageId = "new-page-id";

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

    const { result } = renderHook(() => mutationHandler(), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      ),
    });

    await act(async () => {
      result.current.mutate({
        content,
        pageId,
      });
    });

    // isLoading이 완료될 때까지 대기 후 isSuccess 확인
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    await waitFor(() => {
      expect(useRouter().push).toHaveBeenCalledWith(`/pages/detail/${pageId}`);
    });
  });
  test("CreateHandler 함수 실패 테스트", async () => {
    (setDoc as jest.Mock).mockRejectedValue(() => {
      return Promise.reject(new Error("게시글 작성 중 오류 발생"));
    });

    const mutationHandler = jest.requireActual(
      "@/app/handler/detail/crud/useMutationHandler"
    ).default;

    const pageId = "new-page-id";

    const { result } = renderHook(() => mutationHandler(), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      ),
    });

    const obj = {
      data: null,
      pageId,
    };

    await act(async () => {
      result.current.mutate(obj);
    });

    // isLoading이 완료될 때까지 대기 후 isError 확인
    await waitFor(() => {
      expect(result.current.isError).toBe(true); // 실패한 경우 isError가 true가 되어야 함
    });

    await waitFor(() => {
      // 오류 메시지가 올바르게 처리되었는지 확인 (popuprHandler 호출 여부 등)
      expect(popuprHandler).toHaveBeenCalledWith({
        message: "게시글 작성 중 오류가 발생하였습니다",
      });
    });
  });
});

describe("이미 업로도 된 이미지 삭제 테스트", () => {
  beforeEach(async () => {
    jest.clearAllMocks();
  });
  test("이미지 삭제 성공 테스트 ", () => {
    const handler = jest.requireActual(
      "@/app/handler/detail/crud/imageCrudHandler"
    ).ImageDeleteHandler;
    // 테스트용 데이터 준비
    const mockArray = {
      image: ["img1.jpg", "img2.jpg", "img3.jpg"],
      file: ["file1", "file2", "file3"],
    };

    // 첫 번째 이미지를 삭제
    const result1 = handler({ array: mockArray, fileIndex: 0 });
    expect(result1.image).toEqual(["img2.jpg", "img3.jpg"]);
    expect(result1.files).toEqual(["file2", "file3"]);

    // 두 번째 이미지를 삭제
    const result2 = handler({ array: mockArray, fileIndex: 1 });
    expect(result2.image).toEqual(["img1.jpg", "img3.jpg"]);
    expect(result2.files).toEqual(["file1", "file3"]);

    // 세 번째 이미지를 삭제
    const result3 = handler({ array: mockArray, fileIndex: 2 });
    expect(result3.image).toEqual(["img1.jpg", "img2.jpg"]);
    expect(result3.files).toEqual(["file1", "file2"]);
  });

  test("이미지 삭제 싪패 테스트", () => {
    const handler = jest.requireActual(
      "@/app/handler/detail/crud/imageCrudHandler"
    ).ImageDeleteHandler;
    const mockArray = {
      image: ["img1.jpg", "img2.jpg"],
      file: ["file1", "file2"],
    };

    const result = handler({ array: mockArray, fileIndex: 5 });
    expect(result.image).toEqual(["img1.jpg", "img2.jpg"]);
    expect(result.files).toEqual(["file1", "file2"]);
  });
});

describe("노출 우선권 소유 테스트", () => {
  const queryClient = new QueryClient();
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test("노출 우선권 있을 때 팝업 미 호출 테스트", async () => {
    (useCashQueryHook as jest.Mock).mockReturnValue({
      CashData: [
        {
          cash: 10000,
          item: 5,
        },
      ],
      error: null,
      isLoading: false,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <EditorPage />
      </QueryClientProvider>
    );
    const { CashData } = useCashQueryHook();
    const button = screen.getByText("노출 우선권 사용하기") as HTMLElement;
    fireEvent.click(button);

    await waitFor(() => {
      expect(popuprHandler).not.toHaveBeenCalled();
    });
  });

  test("노출 우선권 없을 때 팝업 호출 테스트", async () => {
    (useCashQueryHook as jest.Mock).mockReturnValue({
      CashData: [
        {
          cash: 0,
          item: 0,
        },
      ],
      error: null,
      isLoading: false,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <EditorPage />
      </QueryClientProvider>
    );
    const button = screen.getByText("노출 우선권 사용하기") as HTMLElement;
    fireEvent.click(button);

    await waitFor(() => {
      expect(popuprHandler).toHaveBeenCalledWith({
        message: "아이템을 보유 하고 있지 않습니다, 구매하러 가시겠습니까?",
        type: "confirm",
      });
    });

    await act(async () => {
      popupMessageStore.setState({ isClick: true });
    });

    await waitFor(() => {
      expect(useRouter().push).toHaveBeenCalledWith("/pages/member/mypage");
    });
  });
});
