// promptPopup.stories.ts
import { Meta } from "@storybook/react";
import PromptPopup from "./PromptPopup";

export default {
  title: "Components/PromptPopup", // Storybook에서 `PromptPopup` 컴포넌트를 "Components/PromptPopup"으로 찾을 수 있도록 설정합니다.
  component: PromptPopup,
  tags: ["autodocs"],

  parameters: {
    controls: { expanded: true },
  },
  argTypes: {
    width: { control: "text" },
    height: { control: "text" },
  },
} as Meta;

// 기본 Prompt 팝업 예제
export const DefaultPromptPopup = () => <PromptPopup />;

/*
코드 설명:

1. `Meta` 설정:
   - Storybook에서 `PromptPopup` 컴포넌트를 "Components/PromptPopup"으로 등록하고, 여러 속성(`width`, `height`, `top`)을 Storybook에서 조정할 수 있게 합니다.

2. 각 Prompt 팝업 스토리:
   - `DefaultPromptPopup`: 기본 설정으로 `PromptPopup`을 렌더링합니다.
   - `TopPositionedPromptPopup`: `top` 속성을 활성화해 팝업이 화면 상단에 위치하도록 렌더링합니다.
   - `SizedPromptPopup`: `width`와 `height` 값을 달리해 크기가 다른 `PromptPopup`을 테스트합니다.

이 구성으로 Storybook에서 `PromptPopup` 컴포넌트를 다양한 조건에서 테스트할 수 있습니다.
*/
