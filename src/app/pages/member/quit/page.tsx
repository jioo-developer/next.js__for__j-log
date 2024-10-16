"use client";
import React from "react";
import { popuprHandler } from "@/app/handler/error/ErrorHandler";
import { isCredential } from "@/app/handler/quit/userCredential/credentialHandler";
import originDeleteHandler from "@/app/handler/quit/originquit";
import SocialDeleteHandler from "@/app/handler/quit/socialquit";
import { popupMessageStore } from "@/app/store/common";
import { User } from "firebase/auth";
import { useEffect, useState } from "react";
import { deleteUserDB } from "@/app/handler/quit/deleteDB";
import { Popup } from "@/stories/atoms/Popup";
import { Input } from "@/stories/atoms/Input";
import ButtonGroup from "@/stories/modules/ButtonGroup/ButtonGroup";
import { Button } from "@/stories/atoms/Button";

type propsType = {
  user: User;
  setQuit: React.Dispatch<React.SetStateAction<boolean>>;
};

const QuitPage = ({ user, setQuit }: propsType) => {
  const [quitPw, setPw] = useState("");
  const isPopupClick = popupMessageStore().isClick;

  useEffect(() => {
    if (isPopupClick) {
      deleteHandler(true);
    }
  }, [isPopupClick]);

  async function LogintypeCheck() {
    const Credential = await isCredential(user);
    // 계정 타입을 체크

    if (Credential === "sosial") {
      //state에 저장
      popuprHandler({
        message: "회원탈퇴에 사용 될 2차비밀번호를 입력해주세요",
        type: "prompt",
        state: setPw,
      });
    } else {
      deleteHandler();
    }
  }

  async function deleteHandler(isSosial?: boolean) {
    try {
      deleteUserDB();
      if (isSosial) {
        SocialDeleteHandler();
      } else {
        originDeleteHandler({ data: user, password: quitPw });
      }
    } catch {
      popuprHandler({ message: "회원탈퇴 도중 에러가 발생하였습니다" });
    }
  }

  return (
    <Popup
      type="custom"
      width="28rem;"
      handText="정말로 계정을 삭제 하시겠습니까?"
    >
      <ButtonGroup>
        <Button onClick={() => setQuit(false)}>취소</Button>
        <Button theme="success" onClick={() => LogintypeCheck()}>
          확인
        </Button>
      </ButtonGroup>
    </Popup>
  );
};

export default QuitPage;
