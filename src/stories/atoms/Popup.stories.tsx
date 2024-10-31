// popup.stories.ts
import { Popup } from "./Popup";
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
};

// 기본 Alert 타입 팝업 예제
export const popup = () => {
  return (
    <Popup
      type="alert"
      handText="Alert Message"
      subText="This is an alert popup."
      top
    >
      <Button theme="success">확인</Button>
    </Popup>
  );
};
