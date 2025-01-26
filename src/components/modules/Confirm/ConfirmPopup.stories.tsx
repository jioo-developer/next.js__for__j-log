// confirmPopup.stories.ts
import { Popup } from "@/stories/atoms/Popup";
import ConfirmPopup from "./ConfirmPopup";
import ButtonGroup from "../ButtonGroup/ButtonGroup";
import { Button } from "@/stories/atoms/Button";

export default {
  title: "MODULES/ConfirmPopup",
  component: ConfirmPopup,

  tags: ["autodocs"],

  parameters: {
    controls: { expanded: true },
  },
};

export const Default = {
  render: () => (
    <Popup type="confirm" top customText="제목" subText="내용">
      <ButtonGroup>
        <Button>취소</Button>
        <Button theme="success">확인</Button>
      </ButtonGroup>
    </Popup>
  ),
};
