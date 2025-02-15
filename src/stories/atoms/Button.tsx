/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import "@/app/_asset/theme.scss";
import { styleProps } from "@/app/type_global/commonType";

interface propsType extends styleProps {
  children: React.ReactNode;
  theme?: "white" | "success" | "primary";
  onClick?: () => void;
  disable?: boolean;
  className?: string;
}

export const Button = ({
  width = 100,
  height = 38,
  fontSize = 16,
  theme = "white",
  children,
  disable,
  className,
  onClick,
}: propsType) => {
  return (
    <button
      css={[style({ width, height, fontSize }), themes[theme]]}
      disabled={disable ? true : false}
      className={className}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

const themes = {
  white: css`
    background: transparent;
    color: var(--mainTextcolor);
    border: 1px solid #d1d1d1;
    box-sizing: border-box;
  `,
  success: css`
    background: var(--pointTextcolor);
    color: #fff;
  `,
  primary: css`
    background: #2a96ee;
    color: #fff;
  `,
};

const style = ({ width, height, fontSize }: styleProps) => css`
  width: ${
    width === "full"
      ? "100% !important;"
      : width === "auto"
        ? "auto  !important;"
        : width + "px  !important;"
  }

  height: ${height ? height + "px" : "auto"};
  outline: none;
  border: none;
  cursor: pointer;
  box-sizing: border-box;
  border-radius: 5px;
  font-size: ${fontSize}px;
  line-height: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  &:focus {
    box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.2);
  }
`;
