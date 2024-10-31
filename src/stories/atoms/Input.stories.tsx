// input.stories.ts
import "@/app/_asset/common.scss";
import { Input } from "./Input";
import { useEffect, useState } from "react";

export default {
  title: "ATOMS/Input",
  component: Input,
  tags: ["autodocs"],
  parameters: {
    controls: { expanded: true },
  },
  argTypes: {
    type: {
      control: {
        type: "select",
        options: ["id", "password", "textarea", "email", "text"],
      },
    },
    width: { control: "number" },
    height: { control: "number" },
    fontSize: { control: "number" },
  },
};

const textPlaceHolder = {
  id: "아이디를 입력하세요.",
  password: "비밀번호를 8자리 이상 입력하세요.",
  text: "내용을 입력하세요.",
  textarea: "내용을 입력하세요.",
  email: "이메일을 입력하세요.",
} as const;

export const input = {
  args: {
    type: "id",
    width: "full",
    enter: {
      isEnter: true,
      func: () => alert("엔터 함수"),
    },
  },
  render: (args: { type: keyof typeof textPlaceHolder; width: string }) => {
    const setType = textPlaceHolder[args.type];
    const [value, setValue] = useState("");
    const [placeholder, setPlaceholder] = useState(setType);

    // type 변경 시 placeholder 업데이트 (스토리북에서만 적용됨)
    useEffect(() => {
      setPlaceholder(setType);
    }, [args.type]);

    return (
      <>
        <Input
          {...args}
          placeholder={placeholder}
          value={value}
          setstate={setValue}
        />
        <br />
        <p>텍스트 내용 : {value}</p>
      </>
    );
  },
};
