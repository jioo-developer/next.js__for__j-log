/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
export type ButtonGroupProps = {
  /** 버튼을 보여줄 방향 */
  direction?: "row" | "column";
  /** 버튼을 우측에 보여줍니다. */
  rightAlign?: boolean;
  /** 버튼과 버튼사이의 간격을 설정합니다. */
  gap?: number | string;
  /** 버튼 그룹에서 보여줄 버튼들 */
  children: React.ReactNode;
  /* 스타일 커스터마이징 하고싶을 때 사용 */
  className?: string;
};

/**
 * 여러개의 `Button` 컴포넌트를 보여주고 싶거나, 버튼을 우측에 정렬하고 싶을 땐 `ButtonGroup` 컴포넌트를 사용하세요.
 */
const ButtonGroup = ({
  direction = "row",
  rightAlign = true,
  children,
  gap = 8,
  className,
}: ButtonGroupProps) => {
  return (
    <div
      css={style({ direction, rightAlign, gap, children })}
      className={className}
    >
      {children}
    </div>
  );
};

const style = ({ direction, rightAlign, gap }: ButtonGroupProps) => css`
  display: flex;
  flex-direction: ${direction};
  justify-content: ${rightAlign ? "flex-end" : "flex-start"};
  gap: ${gap}px;
`;

export default ButtonGroup;
