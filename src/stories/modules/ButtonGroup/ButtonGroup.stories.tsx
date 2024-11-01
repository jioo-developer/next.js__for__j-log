import React from "react";
import ButtonGroup from "./ButtonGroup";
import { Button } from "@/stories/atoms/Button";

export default {
  title: "MODULES/ButtonGroup",
  component: ButtonGroup,
  tags: ["autodocs"],
  parameters: {
    controls: { expanded: true },
  },
  argTypes: {
    direction: {
      control: {
        type: "radio",
        options: ["row", "column"],
      },
      defaultValue: "row",
    },
    gap: {
      control: "text",
    },
  },
};

export const Default = {
  args: {
    direction: "row",
    rightAlign: false,
    gap: "8",
  },
  render: (args: any) => (
    <ButtonGroup {...args}>
      <Button>취소</Button>
      <Button theme="success">확인</Button>
    </ButtonGroup>
  ),
};

export const CustomGap = {
  args: {
    direction: "row",
    rightAlign: false,
    gap: "12",
  },
  render: (args: any) => (
    <ButtonGroup {...args}>
      <Button theme="success">취소</Button>
      <Button>확인</Button>
    </ButtonGroup>
  ),
};

export const Column = {
  args: {
    direction: "column",
    rightAlign: false,
    gap: "8",
  },
  render: (args: any) => (
    <ButtonGroup {...args}>
      <Button>취소</Button>
      <Button theme="success">확인</Button>
    </ButtonGroup>
  ),
};

export const CustomGapColumn = {
  args: {
    direction: "column",
    rightAlign: false,
    gap: "14",
  },
  render: (args: any) => (
    <ButtonGroup {...args}>
      <Button>취소</Button>
      <Button theme="success">확인</Button>
    </ButtonGroup>
  ),
};
