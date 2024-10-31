/** @jsxImportSource @emotion/react */
import "@/app/_asset/theme.scss";
import { css } from "@emotion/react";
import { styleProps } from "@/app/type_global/commonType";
import { useInput } from "@/app/handler/useInput";
import { Dispatch, KeyboardEvent, SetStateAction } from "react";

interface propsType extends styleProps {
  id?: string;
  type: "id" | "password" | "textarea" | "email" | "text";
  setstate?: Dispatch<SetStateAction<string>>;
  value?: string | number;
  enter?: {
    isEnter: boolean;
    func: () => void;
  };
  placeholder?: string;
}

/**
 * Input의 타입은 id / pw / textarea / email / text 로 나뉩니다
 */

export const Input = ({
  width = 375,
  height = "auto",
  fontSize = 14,
  type,
  setstate,
  value,
  placeholder,
  id,
  enter = { isEnter: false, func: () => {} },
}: propsType) => {
  const { valueChangeHandler } = useInput("");
  function keydownHandler(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      enter.func();
    } else {
      return "다른 keydown 입력";
    }
  }
  return (
    <input
      id={id && id}
      required
      type={type === "id" || type === "text" ? "text" : type}
      className="form-control"
      placeholder={placeholder ? placeholder : textPlaceHolader[type]}
      value={value && value}
      onChange={(e) =>
        setstate ? setstate(e.target.value) : valueChangeHandler
      }
      onKeyDown={(e) => {
        if (enter.isEnter) {
          keydownHandler(e);
        }
      }}
      css={style({ width, height, fontSize })}
      autoComplete="off"
    />
  );
};

const textPlaceHolader = {
  id: "아이디를 입력하세요.",
  password: "비밀번호를 8자리 이상 입력하세요.",
  text: "내용을 입력하세요.",
  textarea: "내용을 입력하세요.",
  email: "이메일을 입력하세요.",
};

const style = ({ width, height, fontSize }: styleProps) => css`
  width: ${width === "full" ? "100%;" : width + "px;"}
  height : ${height && height !== "auto" ? height + "px;" : "auto;"}
  font-size: ${fontSize}px;
  margin-bottom: 15px;
  &::placeholder {
    color: gray;
  }
`;
