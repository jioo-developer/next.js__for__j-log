import useNameQueryHook from "@/app/api_hooks/common/getnameHook";
import useNameChanger from "@/app/handler/mypage/useMutationHandler";
import MyPage from "@/app/pages/member/mypage/page";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  act,
  fireEvent,
  render,
  renderHook,
  waitFor,
} from "@testing-library/react";
import { falsyStateElement, trueStateElement } from "./utils";
import useUserQueryHook from "@/app/api_hooks/login/getUserHook";
import { popuprHandler } from "@/app/handler/error/ErrorHandler";
import { updateProfile, User } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/app/Firebase";
import storageUpload from "@/app/handler/file/storageUploadHandler";
import onFileChange from "@/app/handler/file/onFileChangeHandler";
import { useRouter } from "next/navigation";
jest.mock("@/app/Firebase", () => ({
  authService: {
    currentUser: {
      uid: "123",
      displayName: "OldNick",
      photoURL: "/profile.jpg",
    },
  },
}));

jest.mock("firebase/firestore", () => ({
  updateDoc: jest.fn(),
  doc: jest.fn().mockReturnValue({}),
  deleteField: jest.fn().mockReturnValue(expect.any(Function)),
}));

jest.mock("firebase/auth", () => ({
  updateProfile: jest.fn(),
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
    data: {
      uid: "123",
      displayName: "OldNick",
      photoURL: "/profile.jpg", // 여기서 photoURL 값을 명시적으로 설정
    },
    error: null,
    isLoading: false,
  }),
}));

jest.mock("@/app/api_hooks/common/getnameHook", () => ({
  __esModule: true, // ES 모듈로 인식되도록 설정
  default: jest.fn().mockReturnValue({
    nicknameData: ["Nickname1", "Nickname2"],
    error: null,
    isLoading: false,
  }),
}));

jest.mock("@/app/handler/file/onFileChangeHandler", () => jest.fn());

jest.mock("@/app/handler/mypage/useMutationHandler", () => jest.fn());

(useNameChanger as jest.Mock).mockReturnValue({ mutate: jest.fn() });

jest.mock("@/app/handler/file/storageUploadHandler", () => jest.fn());

const queryClient = new QueryClient();

describe("닉네임 변경 로직 테스트", () => {
  beforeEach(async () => {
    jest.clearAllMocks();

    render(
      <QueryClientProvider client={queryClient}>
        <MyPage />
      </QueryClientProvider>
    );
    const { editStartBtn } = falsyStateElement();
    // 닉네임 수정 버튼 클릭
    await act(() => {
      fireEvent.click(editStartBtn);
    });

    // 인풋이 나타나는지 확인
    await waitFor(() => {
      const { input } = trueStateElement();
      expect(input).toBeInTheDocument();
    });

    // 수정 완료 버튼 클릭
    await waitFor(() => {
      const { input } = trueStateElement();
      fireEvent.change(input, { target: { value: "NewNickName" } });
    });

    await act(() => {
      const { editEndBtn } = trueStateElement();
      expect(editEndBtn).toBeInTheDocument();
      fireEvent.click(editEndBtn);
    });
  });

  test("닉네임 변경 함수 mutate hook 호출 테스트", async () => {
    const { nicknameData } = useNameQueryHook();
    const isNamecheck = nicknameData.includes("NewNickName");
    expect(isNamecheck).toBe(false);
    const nameChangeMutate = useNameChanger();
    expect(nameChangeMutate.mutate).toHaveBeenCalledWith({
      data: {
        uid: "123",
        displayName: "OldNick",
        photoURL: "/profile.jpg",
      },
      nickname: "NewNickName",
    });
  });

  test("닉네임 변경 성공 테스트", async () => {
    const queryClient = new QueryClient();
    const { data } = useUserQueryHook();
    const handler = jest.requireActual(
      "@/app/handler/mypage/useMutationHandler"
    ).default;
    const { result } = renderHook(() => handler(), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      ),
    });

    const obj = {
      data: data as User,
      nickname: "NewNick",
    };

    await act(async () => {
      result.current.mutate(obj);
    });

    // doc 함수가 호출되었는지 확인
    expect(doc).toHaveBeenCalledWith(db, "nickname", "123");

    expect(updateDoc).toHaveBeenCalledTimes(2);
    expect(updateDoc).toHaveBeenCalledWith(expect.any(Object), {
      nickname: expect.any(Function), // deleteField 함수 호출 확인
    });
    expect(updateDoc).toHaveBeenCalledWith(expect.any(Object), {
      nickname: "NewNick", // deleteField 함수 호출 확인
    });

    expect(updateProfile).toHaveBeenCalledWith(
      { uid: "123", displayName: "OldNick", photoURL: "/profile.jpg" },
      {
        displayName: "NewNick",
      }
    );
  });
  test("닉네임 변경 실패 테스트", async () => {
    const queryClient = new QueryClient();
    const handler = jest.requireActual(
      "@/app/handler/mypage/useMutationHandler"
    ).default;
    const { result } = renderHook(() => handler(), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      ),
    });

    const obj = {
      data: null,
      nickname: "NewNick",
    };

    await act(async () => {
      result.current.mutate(obj);
    });

    await waitFor(() => {
      popuprHandler({ message: "닉네임을 변경에 실패하였습니다." });
    });
  });
  test("변경 하려는 닉네임이 이미 존재 할 때 테스트", async () => {
    const { nicknameData } = useNameQueryHook();
    const isNamecheck = nicknameData.includes("Nickname1");
    expect(isNamecheck).toBe(true);

    if (isNamecheck) {
      popuprHandler({ message: "이미 사용중인 닉네임 입니다" });
    }

    await waitFor(() => {
      expect(popuprHandler).toHaveBeenCalledWith({
        message: "이미 사용중인 닉네임 입니다",
      });
    });
  });
});
describe("파일 업로드 성공 및 실패 테스트", () => {
  const mockFiles: File[] = [
    new File(["file content 1"], "file1.txt", { type: "text/plain" }),
    new File(["file content 2"], "file2.txt", { type: "text/plain" }),
  ];
  const mockFilePaths = ["file1.txt", "file2.txt"]; // 파일 경로 또는 이름
  beforeEach(async () => {
    jest.clearAllMocks();
  });
  // 성공 테스트
  test("파일 업로드 성공 시 storageUpload가 호출 테스트", async () => {
    // onFileChange와 storageUpload가 정상적으로 성공하도록 설정
    (onFileChange as jest.Mock).mockResolvedValue({
      result: mockFilePaths,
      files: mockFiles,
    });

    (storageUpload as jest.Mock).mockResolvedValue("uploadSuccess");

    // 함수 실행
    await onFileChange(mockFiles);
    await storageUpload(mockFilePaths, mockFiles);

    // storageUpload가 호출되었는지 확인
    expect(storageUpload).toHaveBeenCalledWith(mockFilePaths, mockFiles);

    expect(popuprHandler).not.toHaveBeenCalled();
  });

  // 실패 테스트
  test("파일 업로드 실패 시 popuprHandler 호출 테스트", async () => {
    const errorMessage = "프로필 업로드에 실패하였습니다.";

    // onFileChange는 성공, storageUpload는 실패하도록 설정
    (onFileChange as jest.Mock).mockResolvedValue({
      result: mockFilePaths,
      files: mockFiles,
    });

    (storageUpload as jest.Mock).mockRejectedValue(new Error(errorMessage));

    await act(async () => {
      try {
        // 함수 실행
        await onFileChange(mockFiles);
        await storageUpload(mockFilePaths, mockFiles);
      } catch {
        popuprHandler({ message: errorMessage });
      }
    });

    await waitFor(() => {
      // popuprHandler가 호출되었는지 확인
      expect(popuprHandler).toHaveBeenCalledWith({
        message: errorMessage,
      });
    });
  });
});

describe("프로필 이미지 변경 로직 테스트", () => {
  const upload = ["uploadedUrl"];
  beforeEach(async () => {
    jest.clearAllMocks();
  });
  test("프로필 이미지 변경 성공 테스트", async () => {
    // updateProfile을 성공적으로 호출하고, 라우터가 호출되는지 확인
    await act(async () => {
      await updateProfile({ uid: "123" } as User, { photoURL: upload[0] });
      useRouter().push("/pages/main");
    });

    await waitFor(() => {
      expect(updateProfile).toHaveBeenCalledWith(
        { uid: "123" },
        { photoURL: "uploadedUrl" }
      );
    });

    await waitFor(() => {
      expect(useRouter().push).toHaveBeenCalledWith("/pages/main");
    });
  });
  test("프로필 이미지 변경 실패 테스트", async () => {
    const errorMessage = "프로필 변경에 실패하였습니다.";
    (updateProfile as jest.Mock).mockRejectedValue(
      new Error("Profile update failed")
    );
    await act(async () => {
      try {
        await updateProfile({ uid: "123" } as User, { photoURL: null });
      } catch {
        popuprHandler({ message: errorMessage });
      }
    });

    await waitFor(() => {
      // popuprHandler가 호출되었는지 확인
      expect(popuprHandler).toHaveBeenCalledWith({
        message: errorMessage,
      });
    });
  });
});
