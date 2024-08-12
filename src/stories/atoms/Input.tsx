import { css } from "@emotion/react";
import "@/app/_asset/theme.scss";
import "@/app/_asset/_mixin.scss";
import { styleProps } from "@/app/utill/type/commonType";
import { useInput } from "@/app/hooks/login/useInput";
import { Ref } from "react";

interface propsType extends styleProps {
  type: "id" | "password" | "textarea" | "email" | "text";
  ref?: Ref<HTMLInputElement> | null;
}

export const Input = ({ width, fontSize, type, ref }: propsType) => {
  const { value, valueChangeHandler } = useInput("");
  console.log(ref);
  return (
    <input
      required
      type={type === "id" || type === "text" ? "text" : type}
      className="form-control"
      placeholder={textPlaceHolader[type]}
      onChange={valueChangeHandler}
      css={style({ width, fontSize })}
      autoComplete="off"
      ref={ref}
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