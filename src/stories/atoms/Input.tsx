/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import "@/app/_asset/theme.scss";
import "@/app/_asset/_mixin.scss";
import { styleProps } from "@/app/common/type/commonType";
import { useInput } from "@/app/common/hook/useInput";
import { Dispatch, SetStateAction } from "react";

interface propsType extends styleProps {
  type: "id" | "password" | "textarea" | "email" | "text";
  setstate?: Dispatch<SetStateAction<string>>;
}

export const Input = ({ width, fontSize, type, setstate }: propsType) => {
  const { value, valueChangeHandler } = useInput("");
  return (
    <input
      required
      type={type === "id" || type === "text" ? "text" : type}
      className="form-control"
      placeholder={textPlaceHolader[type]}
      onChange={(e) =>
        setstate ? setstate(e.target.value) : valueChangeHandler
      }
      css={style({ width, fontSize })}
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

const style = ({ width, fontSize }: styleProps) => css`
  width: ${width}px;
  font-size: ${fontSize}px;
  @include input-text();
  @include size();
  margin-bottom: 15px;

  &::placeholder {
    color: gray;
  }
`;
