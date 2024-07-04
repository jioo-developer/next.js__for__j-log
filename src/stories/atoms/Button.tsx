
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import "@/app/_asset/theme.scss"
type propsType = {
    width : string | number,
    size : 'small' | 'medium' | 'large' | 'xlarge'
    children : React.ReactNode,
    theme : 'white' | 'success'
}
  
export const Button = ({width,size,theme,children}:propsType) => {
    const buttonStyle = css`
        width: ${width}px;
    `
    return <button css={[style,buttonStyle,sizes[size],themes[theme]]}>{children}</button>
}

const themes = {
  white : css`
  background:transparent;
  color : var(--maincolor);
  border:1px solid #d1d1d1;
  box-sizing:border-box;
  `,
  success : css`
  background: var(--pointcolor);
  color: #fff
  `
}

const sizes = {
    small: css`
      height: 1.75rem;
      font-size: 0.75rem;
      padding: 0 0.875rem;
      font-weight:400;
    `,
    medium: css`
      height: 2.5rem;
      font-size: 1rem;
      padding: 0 1rem;
      font-weight:500;
    `,
    large: css`
      height: 3rem;
      font-size: 1.125rem;
      padding: 0 1.5rem;
      font-weight:700;
    `,
    xlarge : css`
    height: 4rem;
    font-size: 1.5rem;
    padding: 0 2rem;
    font-weight:bold;
    `
  };

  const style = css`
  outline: none;
  border: none;
  box-sizing: border-box;
  height: 2rem;
  font-size: 0.875rem;
  padding: 0 1rem;
  border-radius: 0.25rem;
  line-height: 1;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  &:focus {
    box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.2);
  }
`;

