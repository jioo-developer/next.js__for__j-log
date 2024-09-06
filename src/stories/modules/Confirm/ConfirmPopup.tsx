import { Popup } from "@/stories/atoms/Popup";
import ButtonGroup from "../ButtonGroup/ButtonGroup";
import { Button } from "@/stories/atoms/Button";
import { popupInit } from "@/app/handler/error/ErrorHandler";
import { popupMessageStore } from "@/app/store/common";
const ConfirmPopup = () => {
  return (
    <Popup type="confirm">
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

export default ConfirmPopup;
