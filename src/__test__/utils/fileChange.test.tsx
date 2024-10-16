import onFileChange from "@/app/handler/file/onFileChangeHandler";
describe("onFileChange 함수 테스트", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test("유효한 파일에 대해 base64 데이터 반환 테스트", async () => {
    const mockFile = new Blob(["file content"], { type: "text/plain" });
    const fileList = [new File([mockFile], "test.txt")];

    const result = await onFileChange(fileList);

    expect(result.result).toHaveLength(1);
    expect(result.result[0]).toContain(
      "data:application/octet-stream;base64,ZmlsZSBjb250ZW50"
    );
    expect(result.files).toEqual(fileList);
  });
  test("유효한 파일이 없는 경우 에러 반환 테스트 ", async () => {
    const fileList: File[] = []; // 빈 파일 리스트

    // onFileChange 함수가 에러를 던지는지 확인
    await expect(onFileChange(fileList)).rejects.toThrow(
      "유효한 파일이 없습니다."
    );
  });
});
