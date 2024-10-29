// popup.stories.ts
import { Meta } from "@storybook/react";
import { Popup } from "./Popup";
import { useState } from "react";
import { Button } from "@/stories/atoms/Button";

export default {
  title: "Components/Popup", // Storybook에서 `Popup` 컴포넌트를 "Components/Popup"으로 찾을 수 있도록 설정합니다.
  component: Popup,
  tags: ["autodocs"],

  parameters: {
    controls: { expanded: true },
  },
  argTypes: {
    type: {
      control: {
        type: "select",
        options: ["alert", "custom"],
      },
    },
    textAlign: {
      control: {
        type: "select",
        options: ["left", "center", "right"],
      },
    },
    width: { control: "text" },
    height: { control: "text" },
    top: { control: "boolean" },
  },
} as Meta;

// 기본 Alert 타입 팝업 예제
export const AlertPopup = () => {
  return (
    <Popup
      type="alert"
      handText="Alert Message"
      subText="This is an alert popup."
    >
      <Button theme="success">확인</Button>
    </Popup>
  );
};

// 커스텀 타입 팝업 예제
export const CustomPopup = () => {
  return (
    <Popup
      type="custom"
      handText="Custom Message"
      subText="This is a custom popup."
    >
      <Button theme="primary">Custom Action</Button>
    </Popup>
  );
};

// 다양한 정렬이 적용된 팝업 예제
export const AlignedPopup = () => {
  return (
    <>
      <Popup
        type="alert"
        textAlign="left"
        handText="Left Aligned"
        subText="Aligned to the left."
      />
      <Popup
        type="alert"
        textAlign="center"
        handText="Center Aligned"
        subText="Aligned to the center."
      />
      <Popup
        type="alert"
        textAlign="right"
        handText="Right Aligned"
        subText="Aligned to the right."
      />
    </>
  );
};

// 상단에 위치한 팝업 예제
export const TopPositionedPopup = () => {
  return (
    <Popup
      type="alert"
      top
      handText="Top Position"
      subText="This popup is positioned at the top."
    />
  );
};

// 다양한 크기를 가진 팝업 예제
export const SizedPopup = () => {
  return (
    <>
      <Popup
        type="alert"
        width="20rem"
        height="10rem"
        handText="Small Popup"
        subText="This popup is small."
      />
      <Popup
        type="alert"
        width="30rem"
        height="15rem"
        handText="Medium Popup"
        subText="This popup is medium-sized."
      />
      <Popup
        type="alert"
        width="40rem"
        height="20rem"
        handText="Large Popup"
        subText="This popup is large."
      />
    </>
  );
};

/*
코드 설명:

1. `Meta` 설정:
   - Storybook에서 `Popup` 컴포넌트를 "Components/Popup"으로 등록하고, 다양한 속성(`type`, `textAlign`, `width`, `height`, `top`)을 조작할 수 있게 설정합니다.

2. 각 팝업 스토리:
   - `AlertPopup`: 기본 알림(alert) 타입 팝업을 렌더링합니다.
   - `CustomPopup`: "custom" 타입으로 버튼을 통해 커스텀 액션을 실행하는 팝업입니다.
   - `AlignedPopup`: `textAlign` 속성을 활용해 텍스트가 왼쪽, 중앙, 오른쪽 정렬된 팝업을 각각 렌더링합니다.
   - `TopPositionedPopup`: `top` 속성을 `true`로 설정해 팝업이 화면 상단에 위치하도록 합니다.
   - `SizedPopup`: 다양한 `width`와 `height` 값을 적용해 크기가 다른 팝업을 렌더링합니다.

모든 옵션을 포함하여 Storybook에서 ` */
