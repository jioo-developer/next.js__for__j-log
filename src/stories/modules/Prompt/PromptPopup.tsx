import { popupMessageStore } from "@/app/store/common";
import { Button } from "@/stories/atoms/Button";
import { Input } from "@/stories/atoms/Input";
import { Popup } from "@/stories/atoms/Popup";

const PromptPopup = () => {
  const inputState = popupMessageStore().state;
  const isClick = popupMessageStore().isClick;
  return (
    <Popup type="custom" width={"28rem;"}>
      <Input type="password" width={"full"} setstate={inputState} />
      <Button
        theme="success"
        onClick={() => popupMessageStore.setState({ isClick: true })}
      >
        확인
      </Button>
    </Popup>
  );
};

export default PromptPopup;
