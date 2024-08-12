import React from "react";
import ButtonGroup from "./ButtonGroup";
import { Button } from "@/stories/atoms/Button";

export default {
  title: "components/ButtonGroup",
  component: ButtonGroup,
  argTypes: {
    direction: {
      control: {
        type: "radio",
        options: ["row", "column"],
      },
      defaultValue: "row",
    },
    rightAlign: {
      control: "boolean",
      defaultValue: false,
    },
    gap: {
      control: "text",
      defaultValue: "0.5rem",
    },
  },
};

type propsType = {
  direction: "row" | "column" | undefined;
  rightAlign: boolean;
  gap: string;
};

export const buttonGroup = ({ direction, rightAlign, gap }: propsType) => {
  return (
    <ButtonGroup direction={direction} rightAlign={rightAlign} gap={gap}>
      <Button>취소</Button>
      <Button theme="success">확인</Button>
    </ButtonGroup>
  );
};

buttonGroup.story = {
  name: "Default",
};

export const rightAlign = () => {
  return (
    <ButtonGroup rightAlign>
      <Button theme="success">취소</Button>
      <Button>확인</Button>
    </ButtonGroup>
  );
};

export const column = () => {
  return (
    <ButtonGroup direction="column">
      <Button>CLICK ME</Button>
      <Button>CLICK ME</Button>
    </ButtonGroup>
  );
};

export const customGap = () => {
  return (
    <ButtonGroup gap="1rem">
      <Button theme="success">취소</Button>
      <Button>확인</Button>
    </ButtonGroup>
  );
};

export const customGapColumn = () => {
  return (
    <ButtonGroup direction="column" gap="1rem">
      <Button>CLICK ME</Button>
      <Button>CLICK ME</Button>
    </ButtonGroup>
  );
};