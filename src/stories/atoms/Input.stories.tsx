// input.stories.ts
import { Meta } from "@storybook/react";
import { Input } from "./Input";
import { useState } from "react";

export default {
  title: "Components/Input", // Storybook에서 `Input` 컴포넌트를 "Components/Input"으로 찾을 수 있도록 설정합니다.
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
} as Meta;

// ID 입력 필드 예제
export const IdInput = () => {
  const [value, setValue] = useState("");

  return (
    <Input
      type="id"
      placeholder="아이디를 입력하세요."
      value={value}
      setstate={setValue}
    />
  );
};

// 비밀번호 입력 필드 예제
export const PasswordInput = () => {
  const [value, setValue] = useState("");

  return (
    <Input
      type="password"
      placeholder="비밀번호를 8자리 이상 입력하세요."
      value={value}
      setstate={setValue}
    />
  );
};

// 텍스트 입력 필드 예제
export const TextInput = () => {
  const [value, setValue] = useState("");

  return (
    <Input
      type="text"
      placeholder="내용을 입력하세요."
      value={value}
      setstate={setValue}
    />
  );
};

// 텍스트 에어리어 입력 필드 예제
export const TextareaInput = () => {
  const [value, setValue] = useState("");

  return (
    <Input
      type="textarea"
      placeholder="내용을 입력하세요."
      value={value}
      setstate={setValue}
    />
  );
};

// 이메일 입력 필드 예제 (Enter 키 이벤트 포함)
export const EmailInputWithEnter = () => {
  const [value, setValue] = useState("");

  return (
    <Input
      type="email"
      placeholder="이메일을 입력하세요."
      value={value}
      setstate={setValue}
      enter={{
        isEnter: true,
        func: () => alert("Enter key pressed!"),
      }}
    />
  );
};

/*
코드 설명:

1. `Meta` 설정:
   - `Input` 컴포넌트를 Storybook에 등록하고, `type`, `width`, `height`, `fontSize` 속성을 Storybook에서 컨트롤할 수 있게 설정합니다.

2. 모든 입력 유형별 스토리:
   - `IdInput`: ID 입력을 위한 필드.
   - `PasswordInput`: 비밀번호 입력을 위한 필드.
   - `TextInput`: 일반 텍스트 입력을 위한 */
