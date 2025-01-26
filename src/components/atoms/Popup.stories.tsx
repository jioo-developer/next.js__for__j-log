// Popup.stories.tsx
/** @jsxImportSource @emotion/react */
import { Popup } from "@/stories/atoms/Popup"; // 실제 Popup 컴포넌트 경로로 업데이트하세요
import { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";

export default {
  title: "ATOMS/Popup",
  component: Popup,
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: { type: "select" },
      options: ["alert", "custom"],
      description: "팝업 유형",
    },
    direction: {
      control: { type: "select" },
      options: ["row", "column"],
      description: "팝업 내부 컨텐츠의 레이아웃 방향",
    },
    textAlign: {
      control: { type: "select" },
      options: ["left", "center"],
      description: "팝업의 주요 텍스트 정렬",
    },
    subText: {
      control: { type: "text" },
      description: "팝업에 표시되는 추가 텍스트",
    },
    customText: {
      control: { type: "text" },
      description: "주요 팝업 메시지에 대한 사용자 정의 텍스트",
    },
    width: {
      control: { type: "text" },
      description: "팝업의 너비",
    },
    height: {
      control: { type: "text" },
      description: "팝업의 높이",
    },
    top: {
      control: false,
    },
  },
};

type Story = StoryObj<typeof Popup>;

export const AlertPopup: Story = {
  args: {
    type: "alert",
    width: "25rem",
    height: "auto",
    textAlign: "left",
    subText: "이것은 예시 서브 텍스트입니다.",
    customText: "알림 팝업",
    top: true,
  },
};

export const CustomPopupWithChildren: Story = {
  args: {
    type: "custom",
    width: "25rem",
    height: "auto",
    customText: "자식이 포함된 사용자 정의 팝업",
    top: true,
    children: (
      <>
        <p> 사용자 지정 Element</p>
        <br />
        <Button theme="success">버튼</Button>
      </>
    ),
  },
};

export const CenterAlignedTextPopup: Story = {
  args: {
    type: "alert",
    textAlign: "center",
    width: "25rem",
    height: "auto",
    customText: "중앙 정렬 텍스트 팝업",
    top: true,
  },
};

export const PopupWithOnlyCustomTitle: Story = {
  args: {
    type: "alert",
    customText: "사용자 정의 텍스트만 포함된 팝업",
    width: "25rem",
    height: "auto",
    top: true,
  },
};

export const PopupWithSubTextOnly: Story = {
  args: {
    type: "alert",
    subText: "서브 텍스트만 표시됩니다.",
    width: "25rem",
    height: "auto",
    top: true,
  },
};
