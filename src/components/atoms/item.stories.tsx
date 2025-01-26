"use client";
import { useState } from "react";
import Item from "./Item";

export default {
  title: "atoms/Item",
  component: Item,
  tags: ["autodocs"],
  parameters: {
    controls: { expanded: true },
  },
  argTypes: {
    value: { control: "number" },
  },
};

export const Default = {
  render: (args: any) => {
    const [selectedValue, setSelectedValue] = useState<number>(0);

    return <Item {...args} value={args.value} setItem={setSelectedValue} />;
  },
  args: {
    value: 4,
  },
};
