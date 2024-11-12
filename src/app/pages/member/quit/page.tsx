"use client";
import React from "react";
import { popupInit, popuprHandler } from "@/app/handler/error/ErrorHandler";
import isCredential from "@/app/handler/quit/userCredential/credentialHandler";
import originDeleteHandler from "@/app/handler/quit/originquit";
import SocialDeleteHandler from "@/app/handler/quit/socialquit";
import { popupMessageStore } from "@/app/store/common";
import { deleteUser, User } from "firebase/auth";
import { useEffect, useState } from "react";
import deleteDB from "@/app/handler/quit/deleteDB";
import { Popup } from "@/stories/atoms/Popup";
import ButtonGroup from "@/stories/modules/ButtonGroup/ButtonGroup";
import { Button } from "@/stories/atoms/Button";
import { authService } from "@/app/Firebase";
import { useRouter } from "next/navigation";

const QuitPage = ({ setQuit }: any) => {
  const [quitPw, setPw] = useState("");
  const [loginType, setType] = useState("");
  const isPopupClick = popupMessageStore().isClick;

  const router = useRouter();

  useEffect(() => {
    if (isPopupClick) {
      deleteHandler();
    }
  }, [isPopupClick]);

  const user = authService.currentUser as User;

  async function LogintypeCheck() {
    const Credential = await isCredential(user as User);
    setType(Credential);

    if (Credential === "sosial") {
      //state에 저장
      popuprHandler({
        message: "회원탈퇴에 사용 될 2차비밀번호를 입력 해주세요",
        type: "prompt",
        state: setPw,
      });
    } else {
      popuprHandler({
        message: "로그인에 사용 되는 비밀번호를 입력 해주세요",
        type: "prompt",
        state: setPw,
      });
    }
  }

  async function deleteHandler() {
    await deleteDB(user);
    try {
      if (loginType === "sosial") {
        await SocialDeleteHandler();
        await deleteUser(user);
        popupInit();
        router.push("/pages/login"); // 4. 로그인 페이지로 네비게이션 (비동기 작업이므로 완료 전에 다음 줄로 넘어갈 수 있음)
        // 소셜 로그인 삭제
      } else {
        await originDeleteHandler(quitPw); // 1. `quitPw`를 사용하여 원래 삭제 핸들러 실행
        await deleteUser(user); // 2. 사용자를 Firebase 인증에서 삭제
        popupInit();
        router.push("/pages/login"); // 4. 로그인 페이지로 네비게이션 (비동기 작업이므로 완료 전에 다음 줄로 넘어갈 수 있음)
        // 기존 로그인 삭제
      }
    } catch {
      popuprHandler({ message: "회원 탈퇴에 실패하였습니다" });
    }
  }

  return (
    <Popup
      type="custom"
      width="28rem;"
      customText="정말로 계정을 삭제 하시겠습니까?"
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
