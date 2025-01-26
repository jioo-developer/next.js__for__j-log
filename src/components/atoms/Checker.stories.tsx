import Checker from "./Checker";
import { useState } from "react";

export default {
  title: "ATOMS/Checker", // Storybook에서 컴포넌트를 "Components/Checker"로 찾을 수 있게 설정합니다.
  component: Checker, // 스토리에서 사용할 컴포넌트를 지정합니다.
  tags: ["autodocs"],

  parameters: {
    controls: { expanded: true },
  },
  argTypes: {
    allcheck: {
      control: "boolean",
    },
  },
};

const items = [
  { id: "auth", text: "회원가입 및 운영약관 동의", important: true },
  { id: "data", text: "개인정보 수집 및 동의", important: true },
  { id: "location", text: "위치정보 이용약관 동의", important: false },
]; // 각 항목을 설정하는 배열입니다.

type propsType = {
  allcheck: boolean;
};

// 모든 체크박스가 선택된 기본 예제
export const AllCheckers = (args: propsType) => {
  const [state, setState] = useState(true); // Checker 컴포넌트가 사용할 상태입니다.

  return (
    <>
      <Checker allcheck={args.allcheck} items={items} setState={setState} />
      <br />
      <p>필수 체크 완료상태 : {state ? "true" : "false"}</p>
    </>
  ); // `allcheck`가 true인 Checker 컴포넌트를 렌더링합니다.
};

// "전체 동의" 기능이 꺼진 예제
export const Checkers = (args: propsType) => {
  const [state, setState] = useState(false);

  return (
    <>
      <Checker allcheck={args.allcheck} items={items} setState={setState} />
      <br />
      <p>필수 체크 완료상태 : {state ? "true" : "false"}</p>
    </>
  );
};
