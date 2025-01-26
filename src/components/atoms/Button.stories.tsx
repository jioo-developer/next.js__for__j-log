import { Button } from "./Button";

export default {
  title: "atoms/Button",
  component: Button,
  tags: ["autodocs"],

  parameters: {
    controls: { expanded: true },
  },

  argTypes: {
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

export const Default = {
  args: {
    theme: "white",
    width: 120,
    height: 50,
    children: "버튼",
  },
};

export const Success = {
  args: {
    theme: "success",
    width: 120,
    height: 50,
    children: "버튼",
  },
};

export const Primary = {
  args: {
    theme: "primary",
    width: 120,
    height: 50,
    children: "버튼",
  },
};
