import React from "react";
import { Button } from "./Button";

export default {
  title: "atoms /Button",
  component: Button,
  tags: ["autodocs"],

  parameters: {
    controls: { expanded: true },
  },

  argTypes: {
    theme: {
      control: "select",
      option: ["default", "success", "primary"],
    },
    width: {
      control: { type: "number", min: 400, max: 1200 },
    },
    height: {
      control: { type: "range", min: 50, max: 1000, step: 10 },
    },
    onClick: { action: "클릭" },
    disable: {
      control: { type: "boolean" },
    },
    className: {
      control: { type: "string" },
    },
  },
};

export const DefaultButton = () => {
  return (
    <Button theme="white" width={120} height={50}>
      버튼
    </Button>
  );
};

DefaultButton.story = {
  name: "default",
};

export const SuccessButton = () => {
  return (
    <Button theme="success" width={120} height={50}>
      버튼
    </Button>
  );
};

SuccessButton.story = {
  name: "success",
};

export const PrimaryButton = () => {
  return (
    <Button theme="primary" width={120} height={50}>
      버튼
    </Button>
  );
};

PrimaryButton.story = {
  name: "primary",
};
