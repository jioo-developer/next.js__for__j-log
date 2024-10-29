// checker.stories.ts
import { Meta } from "@storybook/react";
import Checker from "./Checker";
import { useState } from "react";

export default {
  title: "Components/Checker", // Storybook에서 컴포넌트를 "Components/Checker"로 찾을 수 있게 설정합니다.
  component: Checker, // 스토리에서 사용할 컴포넌트를 지정합니다.
  tags: ["autodocs"],

  parameters: {
    controls: { expanded: true },
  },
  argTypes: {
    allcheck: { control: "boolean" }, // Storybook에서 `allcheck` 속성을 boolean으로 조절할 수 있게 만듭니다.
  },
} as Meta;

// 모든 체크박스가 선택된 기본 예제
export const DefaultChecker = () => {
  const [state, setState] = useState(true); // Checker 컴포넌트가 사용할 상태입니다.

  const items = [
    { id: "auth", text: "Authentication agreement", important: true },
    { id: "data", text: "Data collection agreement", important: true },
    { id: "marketing", text: "Marketing preferences", important: false },
  ]; // 각 항목을 설정하는 배열입니다.

  return <Checker allcheck={true} items={items} setState={setState} />; // `allcheck`가 true인 Checker 컴포넌트를 렌더링합니다.
};

// "전체 동의" 기능이 꺼진 예제
export const WithoutAllCheck = () => {
  const [state, setState] = useState(true);

  const items = [
    { id: "auth", text: "Authentication agreement", important: true },
    { id: "data", text: "Data collection agreement", important: true },
    { id: "marketing", text: "Marketing preferences", important: false },
  ];

  return <Checker allcheck={false} items={items} setState={setState} />; // `allcheck`가 false인 Checker 컴포넌트를 렌더링합니다.
};

/*
코드 설명:

1. `Meta` 설정:
   - Storybook 사이드바에 표시될 위치와 컴포넌트를 지정합니다.
   - `argTypes`로 `allcheck` 속성을 Storybook에서 켜고 끌 수 있게 만듭니다.

2. `DefaultChecker`:
   - `allcheck`가 true인 예제입니다.
   - "전체 동의"가 기본적으로 선택된 상태로 보여줍니다.

3. `WithoutAllCheck`:
   - `allcheck`가 false인 예제입니다.
   - "전체 동의" 없이 개별 항목만 선택 가능합니다.

이렇게 하면 Storybook에서 `Checker` 컴포넌트를 여러 설정으로 쉽게 테스트할 수 있습니다.
*/
