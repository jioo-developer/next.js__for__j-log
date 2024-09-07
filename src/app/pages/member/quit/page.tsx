"use client";
import { popuprHandler } from "@/app/handler/error/ErrorHandler";
import { isCredential } from "@/app/handler/quit/userCredential/credentialHandler";
import originDeleteHandler from "@/app/handler/quit/originquit";
import SocialDeleteHandler from "@/app/handler/quit/socialquit";
import { popupMessageStore } from "@/app/store/common";
import { User } from "firebase/auth";
import { useEffect, useState } from "react";
import { deleteUserDB, quitError } from "@/app/handler/quit/deleteDB";

const QuitPage = ({ user }: { user: User }) => {
  const [quitPw, setPw] = useState("");
  const isPopupClick = popupMessageStore().isClick;
  const [loginType, setType] = useState<string | null>(null);

  useEffect(() => {
    popuprHandler({
      message: "정말로 계정을 삭제 하시겠습니까?",
      type: "confirm",
    });
  }, []);

  useEffect(() => {
    if (isPopupClick) {
      // 클릭 인식
      if (!loginType) {
        deleteHandler();
      } else {
        deleteHandler(true);
      }
    }
  }, [isPopupClick]);

  async function deleteHandler(isSosial?: boolean) {
    if (!loginType) {
      const Credential = await isCredential(user);
      // 계정 타입을 체크

      if (Credential === "sosial") {
        setType(Credential);
        //state에 저장
        popuprHandler({
          message: "회원탈퇴에 사용 될 2차비밀번호를 입력해주세요",
          type: "prompt",
          state: setPw,
        });
      }
    } else {
      try {
        deleteUserDB();
        if (isSosial) {
          SocialDeleteHandler();
        } else {
          originDeleteHandler({ data: user, password: quitPw });
        }
      } catch {
        quitError();
      }
    }
  }

  return <div></div>;
};

export default QuitPage;
