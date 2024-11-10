/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import "@/app/_asset/theme.scss";
import { convertPrice } from "@/app/handler/commonHandler";

type propsType = {
  value: number;
  setItem: (value: number) => void;
};

const Item = ({ value, setItem }: propsType) => {
  const itemStyle = css`
    background: transparent;
    color: var(--mainTextcolor);
    border: 3px solid #d1d1d1;
    box-sizing: border-box;
    padding: 10px;
    margin: 10px;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    width: 100%;
    margin-bottom: 35px;
    cursor: pointer;

    &:hover {
      background: #12b886;
      border: 3px solid #12b886;
      p {
        color: #fff;
      }
    }
  `;

  return (
    <div className="item__wrap" css={itemStyle} onClick={() => setItem(value)}>
      <p className="product_name">우선권 {value}회권</p>
      <p className="product_length">+{value}</p>
      <p className="product_price">{convertPrice(2500 * value)}</p>
      <p className="product_sale"></p>
    </div>
  );
};

export default Item;
