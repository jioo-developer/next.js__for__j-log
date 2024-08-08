/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import "@/app/_asset/theme.scss";
import "@/app/_asset/_mixin.scss";
import ButtonGroup from "../modules/ButtonGroup/ButtonGroup";
import { Button } from "@/stories/atoms/Button";
import { popupMessageStore } from "@/app/store/common";

type propsType = {
  type: string;
  rightAlign: boolean;
};

export const Popup = ({ type, rightAlign }: propsType) => {
  const msgContent = popupMessageStore();
  return (
    <>
      <div css={[fullscreen, darkLayer]}></div>
      <div css={[fullscreen, whiteBoxWrapper]}>
        <div css={[whiteBox, flexDirection]}>
          <p
            css={css`
              margin-bottom: 1.5rem !important;
            `}
          >
            {msgContent.message}
          </p>
          {type === "alert" ? (
            <Button
              theme="success"
              onClick={() => {
                popupMessageStore.setState({ message: "" });
              }}
            >
              확인
            </Button>
          ) : (
            <ButtonGroup rightAlign={rightAlign}>
              <Button theme="success">취소</Button>
              <Button>삭제</Button>
            </ButtonGroup>
          )}
        </div>
      </div>
    </>
  );
};

Popup.defaultProps = {
  type: "alert",
};

const fullscreen = css`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const darkLayer = css`
  z-index: 10;
  background: rgba(0, 0, 0, 0.5);
`;

const whiteBoxWrapper = css`
  z-index: 15;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const flexDirection = css`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const whiteBox = css`
  box-sizing: border-box;
  border-radius: 4px;
  width: 25rem;
  background: white;
  box-shadow: 0px 4px 8px 8px rgba(0, 0, 0, 0.05);
  padding: 2rem;

  h3 {
    font-size: 1.5rem;
    color: #343a40;
    margin-top: 0;
    margin-bottom: 1rem;
  }

  p {
    width: 100%;
    text-align: left;
    font-size: 1.125rem;
    margin: 0;
    color: #3d3d3e;
  }
`;
