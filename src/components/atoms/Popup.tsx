/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { Button } from "@/stories/atoms/Button";
import { popupMessageStore } from "@/store/common";
import { ReactNode } from "react";
import { popupInit } from "@/app/handler/error/ErrorHandler";

type propsType = {
  type?: "alert" | string;
  top?: boolean;
  width?: number | string;
  height?: number | string;
  textAlign?: "left" | "center";
  subText?: string;
  children?: ReactNode;
  customText?: string;
};

export const Popup = ({
  type = "alert",
  width = "25rem;",
  height = "auto;",
  top = false,
  textAlign = "left",
  subText,
  children,
  customText = "",
}: propsType) => {
  const msgContent = popupMessageStore();

  return (
    <>
      <div className="popup" css={[fullscreen, darkLayer]}></div>
      <div css={[fullscreen, whiteBoxWrapper, top && { position: "relative" }]}>
        <div css={[whiteBox(width, height), flexDirection]}>
          <p
            css={css`
              margin-bottom: 1.5rem !important;
              text-align: ${textAlign} !important;
              font-weight: bold;
            `}
          >
            {customText === "" ? msgContent.message : customText}
          </p>
          {subText && (
            <p
              css={css`
                margin-bottom: 1.5rem !important;
                font-size: 16px !important;
                text-align: ${textAlign} !important;
              `}
            >
              {subText}
            </p>
          )}
          {type === "alert" ? (
            <Button
              theme="success"
              width={textAlign === "center" ? "full" : 100}
              onClick={popupInit}
            >
              확인
            </Button>
          ) : (
            children
          )}
        </div>
      </div>
    </>
  );
};

const fullscreen = css`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9998;
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

//   width: ${direction === "row" ? "25rem;" : "18rem;"}
const whiteBox = (width: string | number, height: string | number) => css`
  box-sizing: border-box;
  border-radius: 4px;
  width: ${width}px;
  height : ${height === "auto" ? "auto;" : height + "px;"}
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
