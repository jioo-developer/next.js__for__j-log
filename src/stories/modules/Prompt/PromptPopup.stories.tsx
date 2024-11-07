// promptPopup.stories.ts
import "@/app/_asset/common.scss";
import PromptPopup from "./PromptPopup";
import { Popup } from "@/stories/atoms/Popup";
import { Input } from "@/stories/atoms/Input";
import ButtonGroup from "../ButtonGroup/ButtonGroup";
import { Button } from "@/stories/atoms/Button";
import { useState } from "react";

export default {
  title: "MODULES/PromptPopup",
  component: PromptPopup,
  tags: ["autodocs"],

  parameters: {
    controls: { expanded: true },
  },
  argTypes: {
    width: { control: "text" },
    height: { control: "text" },
    placeholder: {
      control: {
        type: "select",
        options: [
          "아이디를 입력하세요.",
          "비밀번호를 8자리 이상 입력하세요.",
          "내용을 입력하세요.",
          "이메일을 입력하세요.",
        ],
      },
    },
  },
};

type ArgsType = {
  placeholder: string;
};

export const Default = {
  args: {
    placeholder: "아이디를 입력하세요.", // 기본 placeholder 값 설정
  } as ArgsType,
  render: (args: ArgsType) => {
    const [state, setState] = useState("");
    return (
      <>
        <Popup type="custom" width="28rem;" top customText="제목">
          <Input
            type="password"
            width="full"
            setstate={setState}
            placeholder={args.placeholder}
          />
          <ButtonGroup>
            <Button>취소</Button>
            <Button theme="success">확인</Button>
          </ButtonGroup>
        </Popup>
        <p>입력 값 : {state}</p>
      </>
    );
  },
};
