"use client";
import { Popup } from "@/stories/atoms/Popup";
import ButtonGroup from "../ButtonGroup/ButtonGroup";
import { Button } from "@/stories/atoms/Button";
import { popupInit } from "@/app/handler/error/ErrorHandler";
import Item from "@/stories/atoms/Item";
import "@/app/_asset/common.scss";
import useCashQueryHook from "@/app/api_hooks/common/getCashHook";
import { convertPrice } from "@/app/handler/commonHandler";
import useCashMutation from "@/app/api_hooks/common/setCashMutation";
import { useState } from "react";
type propsType = {
  setState: React.Dispatch<React.SetStateAction<boolean>>;
};
const ItemStore = ({ setState }: propsType) => {
  const { CashData } = useCashQueryHook();
  const getData = CashData[0];
  const [value, setValue] = useState(0);

  const getItem = (val: number) => {
    return setValue(val);
  };

  const buying = async () => {
    const money = getData.cash;
    const cash = money - value * 2500;
    const length = getData.item + value;
    await mutation.mutateAsync({ cash, item: length });
    setState(false);
  };

  const mutation = useCashMutation();
  return (
    <Popup type="custom" width={600}>
      <div className="item_area">
        {[1, 5, 10].map((item) => {
          return <Item value={item} key={item} setItem={getItem} />;
        })}
      </div>
      <div className="flex-box">
        <p>현재 포인트 :{getData ? convertPrice(getData.cash) : 0} +</p>
        <ButtonGroup>
          <Button onClick={popupInit}>취소</Button>
          <Button theme="success" onClick={() => buying()}>
            확인
          </Button>
        </ButtonGroup>
      </div>
    </Popup>
  );
};

export default ItemStore;
