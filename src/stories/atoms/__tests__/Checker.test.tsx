import React from "react";
import test, { describe } from "node:test";
import { fireEvent, render, screen } from "@testing-library/react";
import { expect } from "@storybook/test";
import Checker from "../Checker";
type CheckItemType = {
  id: string;
  text: string;
  important: boolean;
};

const items: CheckItemType[] = [
  { id: "auth", text: "회원가입및 운영약관 동의", important: true },
  { id: "data", text: "개인정보 수집 및 동의", important: true },
  { id: "location", text: "위치정보 이용약관 동의", important: false },
];

const isCheckHandler = (labelText: string) => {
  if (labelText.includes("전체 약관동의")) {
    const allcheckbox = screen.getByLabelText(labelText) as HTMLInputElement;
    // 전체 동의 체크박스 찾기
    fireEvent.click(allcheckbox);
    // 클릭

    const result = items.every((item) => {
      const target = screen.getByLabelText(item.text) as HTMLInputElement;
      return target.checked;
    });
    // 모든 체크박스의 checked 상태를 검사 (전부 true 여야 하기 때문에 every를 사용)
  } else {
    // 개별 체크박스 테스트
    const checkbox = screen.getByLabelText(labelText) as HTMLInputElement;
    // 파라미터에 주어진 체크박스를 찾아서
    return fireEvent.click(checkbox);
    // 체크박스를 클릭 했을 때
  }
};

describe("Checker Component test", () => {
  test("전체동의 체크박스 기능 테스트", () => {
    // given start 테스트 기본 셋팅
    const setStateMock = jest.fn();
    // setState 목업 함수

    render(<Checker allcheck={true} items={items} setState={setStateMock} />);
    // 테스트 할 컴포넌트를 랜더링

    // given End

    // when start 입력이나 동작에 관한 액션
    const expectTry = isCheckHandler("전체 약관 동의");
    // when End

    // then start 모든 체크박스가 체크 되었는지 검증
    expect(expectTry).toBe(true);
    // 전체 약관 동의 체크박스를 클릭했을 때

    const expectReTry = isCheckHandler("전체 약관 동의");
    // 체크 해제 했을 때

    expect(expectReTry).toBe(false);
    // 전체 약관 동의 체크박스를 클릭했을 때

    // then End
  });
  test("약관 동의 개별 테스트", () => {
    // given start 테스트 기본 셋팅
    const setStateMock = jest.fn();
    // setState 목업 함수

    render(<Checker allcheck={true} items={items} setState={setStateMock} />);
    // 테스트 할 컴포넌트를 랜더링

    // given End

    // when 입력이나 동작에 관한 액션
    const firstChecker = isCheckHandler("회원가입 및 운영약관 동의");

    // then 체크 상태 검증
    expect(firstChecker).toBe(true);

    // when 입력이나 동작에 관한 액션
    const SecondChecker = isCheckHandler("개인정보 수집 및 동의");

    // then 체크 상태 검증
    expect(SecondChecker).toBe(true);

    // when 입력이나 동작에 관한 액션
    const thirdChecker = isCheckHandler("회원가입 및 운영약관 동의");

    // then 체크 상태 검증
    expect(thirdChecker).toBe(true);
  });

  test("필수 항목이 체크 되었을 때 상태 업데이트 여부 테스트", () => {
    const items = [
      { id: "auth", text: "회원가입및 운영약관 동의", important: true },
      { id: "data", text: "개인정보 수집 및 동의", important: true },
    ];
    const setStateMock = jest.fn();
    render(<Checker allcheck={true} items={items} setState={setStateMock} />);

    const authCheck = screen.getByLabelText("회원가입및 운영약관 동의");
    const dataCheck = screen.getByLabelText("개인정보 수집 및 동의");

    const authBoolean = fireEvent.click(authCheck);
    const privateBooelan = fireEvent.click(dataCheck);

    const result = authBoolean && privateBooelan ? false : true;
    // disable에 대한 것이기 때문에 false를 넣어야 disable이 해제됨
    expect(setStateMock).toHaveBeenCalledWith(result);
  });
});
