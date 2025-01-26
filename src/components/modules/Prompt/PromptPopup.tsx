import { popupMessageStore } from "@/store/common";
import { Button } from "@/stories/atoms/Button";
import { Input } from "@/stories/atoms/Input";
import { Popup } from "@/stories/atoms/Popup";
import ButtonGroup from "../ButtonGroup/ButtonGroup";
import { popupInit } from "@/app/handler/error/ErrorHandler";

const PromptPopup = () => {
  const inputState = popupMessageStore().state;

  return (
    <Popup type="custom" width={"28rem;"}>
      <Input type="password" width={"full"} setstate={inputState} />
      <ButtonGroup>
        <Button onClick={popupInit}>취소</Button>
        <Button
          theme="success"
          onClick={() => popupMessageStore.setState({ isClick: true })}
        >
          확인
        </Button>
      </ButtonGroup>
    </Popup>
  );
};

export default PromptPopup;
