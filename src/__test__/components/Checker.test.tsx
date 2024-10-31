import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, beforeEach, test, expect } from "@jest/globals";
import Checker from "@/stories/atoms/Checker";
type CheckItemType = {
  id: string;
  text: string;
  important: boolean;
};

const items: CheckItemType[] = [
  { id: "auth", text: "회원가입 및 운영약관 동의", important: true },
  { id: "data", text: "개인정보 수집 및 동의", important: true },
  { id: "location", text: "위치정보 이용약관 동의", important: false },
];

const isCheckHandler = (labelText: string) => {
  if (labelText === "전체 약관 동의") {
    const allcheckbox = screen.getByText("전체 약관 동의")
      .previousElementSibling as HTMLInputElement;
    // 전체 동의 체크박스 찾기
    act(() => {
      fireEvent.click(allcheckbox);
    });
    // 클릭

    const result = items.every((item) => {
      const target = screen.getByText(item.text)
        .previousElementSibling as HTMLElement;

      const isCheck = target.previousElementSibling as HTMLInputElement;
      return isCheck.checked;
    });

    return result;
    // 모든 체크박스의 checked 상태를 검사 (전부 true 여야 하기 때문에 every를 사용)
  } else {
    // 개별 체크박스 테스트
    const checkbox = screen.getByText(labelText)
      .previousElementSibling as HTMLInputElement;
    // 파라미터에 주어진 체크박스를 찾아서
    return fireEvent.click(checkbox);
    // 체크박스를 클릭 했을 때
  }
};

describe("Checker Component test", () => {
  beforeEach(() => {
    // given
    const setStateMock = jest.fn();
    render(<Checker allcheck={true} items={items} setState={setStateMock} />);
    // 테스트 할 컴포넌트를 랜더링
  });
  test("전체동의 체크박스 기능 테스트", () => {
    // when start 입력이나 동작에 관한 액션
    const expectTry = isCheckHandler("전체 약관 동의");

    // then start 모든 체크박스가 체크 되었는지 검증
    expect(expectTry).toBe(true);
    // 전체 약관 동의 체크박스를 클릭했을 때

    const expectReTry = isCheckHandler("전체 약관 동의");
    // 체크 해제 했을 때

    expect(expectReTry).toBe(false);
    // 전체 약관 동의 체크박스를 클릭했을 때
  });
  test("약관 동의 개별 테스트", () => {
    // when 입력이나 동작에 관한 액션
    const firstChecker = isCheckHandler("회원가입 및 운영약관 동의");

    // then 체크 상태 검증
    expect(firstChecker).toBe(true);

    // when 입력이나 동작에 관한 액션
    const SecondChecker = isCheckHandler("개인정보 수집 및 동의");

    // then 체크 상태 검증
    expect(SecondChecker).toBe(true);

    // when 입력이나 동작에 관한 액션
    const thirdChecker = isCheckHandler("위치정보 이용약관 동의");

    // then 체크 상태 검증
    expect(thirdChecker).toBe(true);
  });
});
