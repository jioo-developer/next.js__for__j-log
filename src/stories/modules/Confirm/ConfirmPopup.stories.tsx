// confirmPopup.stories.ts
import { Meta } from "@storybook/react";
import ConfirmPopup from "./ConfirmPopup";

export default {
  title: "Components/ConfirmPopup",
  component: ConfirmPopup,

  tags: ["autodocs"],

  parameters: {
    controls: { expanded: true },
  },
} as Meta;

export const DefaultConfirmPopup = () => <ConfirmPopup />;
