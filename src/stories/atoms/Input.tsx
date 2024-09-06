/** @jsxImportSource @emotion/react */
import "@/app/_asset/theme.scss";
import { css } from "@emotion/react";
import { styleProps } from "@/app/type_global/commonType";
import { useInput } from "@/app/handler/useInput";
import { Dispatch, SetStateAction } from "react";

interface propsType extends styleProps {
  type: "id" | "password" | "textarea" | "email" | "text";
  setstate?: Dispatch<SetStateAction<string>>;
  value?: string | number;
}

export const Input = ({
  width,
  fontSize = 14,
  type,
  setstate,
  value,
}: propsType) => {
  const { valueChangeHandler } = useInput("");
  return (
    <input
      required
      type={type === "id" || type === "text" ? "text" : type}
      className="form-control"
      placeholder={textPlaceHolader[type]}
      value={value && value}
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
  width: ${width === "full" ? "100%;" : width + "px;"}
  font-size: ${fontSize}px;
  margin-bottom: 15px;
  &::placeholder {
    color: gray;
  }
`;
