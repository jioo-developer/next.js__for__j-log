import onFileChange from "@/app/handler/file/onFileChangeHandler";

// 기본 익스포트 함수 모킹
jest.mock("@/app/handler/file/onFileChangeHandler", () => ({
  __esModule: true, // 모듈이 ES 모듈이라는 것을 명시
  default: jest.fn().mockResolvedValue({
    result: ["image content123123"], // 모킹된 결과 값
    files: [new File([new ArrayBuffer(1)], "file.jpg")], // 모킹된 파일
  }),
}));

describe("onfileChange 테스트", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("onfileChange 성공 테스트", async () => {
    const file = new File(["file contents"], "file.jpg", {
      type: "image/jpeg",
    });

    const result = await onFileChange([file]);

    // 함수 호출 횟수 및 인자 검증
    expect(onFileChange).toHaveBeenCalledTimes(1);
    expect(onFileChange).toHaveBeenCalledWith([file]);

    // 반환값 검증
    expect(result).toEqual({
      result: ["image content123123"],
      files: [file],
    });
  });

  test("파일이 없을 때 함수 실패 테스트", async () => {
    const mockFiles: File[] = [];

    // 모킹된 onFileChange 함수가 파일이 없을 때 오류를 발생시키도록 설정
    (onFileChange as jest.Mock).mockRejectedValueOnce(
      new Error("유효한 파일이 없습니다.")
    );

    // onFileChange가 파일이 없을 때 reject되도록 테스트
    await expect(onFileChange(mockFiles)).rejects.toThrow(
      "유효한 파일이 없습니다."
    );
  });
});
