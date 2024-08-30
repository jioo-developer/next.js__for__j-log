"use client";
import { popuprHandler } from "@/app/common/handler/error/ErrorHandler";
import {
  deleteUserDB,
  LoginTypeCheck,
} from "@/app/common/handler/quit/quitHandler";
import originDeleteHandler from "@/app/common/handler/quit/originquit";
import SocialDeleteHandler from "@/app/common/handler/quit/socialquit";
import { popupMessageStore } from "@/app/store/common";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import useUserQueryHook from "@/app/api_hooks/login/getUserHook";
import { User } from "firebase/auth";
import { useRouter } from "next/navigation";

type propsType = {
  quit: Dispatch<SetStateAction<boolean>>;
};

const QuitPage = () => {
  const [quitPw, setPw] = useState("");
  const { data } = useUserQueryHook();
  const isPopupClick = popupMessageStore().isClick;

  const router = useRouter();

  useEffect(() => {
    popuprHandler({
      message: "정말로 계정을 삭제 하시겠습니까?",
      type: "confirm",
    });
  }, []);

  useEffect(() => {
    if (!isPopupClick) {
      console.log("false");
      // 팝업 클릭이 그저 false 일 떄
    } else if (isPopupClick && quitPw === "") {
      deleteProcess();
      // 팝업 클릭은 되어 있지만 quitPw은 변경이 없을 때
    } else if (isPopupClick && quitPw !== "") {
      // 팝업 클릭도 있었고 quitPw도 변경이 되었을 때
      deleteHandler(true);
    }
  }, [isPopupClick]);

  async function deleteProcess() {
    const accountType = await LoginTypeCheck(data as User);
    popupMessageStore.setState({ isClick: false });
    if (accountType === "sosial") {
      popuprHandler({
        message: "회원탈퇴에 사용 될 2차비밀번호를 입력해주세요",
        type: "prompt",
        state: setPw,
      });
    } else {
      deleteHandler(false);
    }
  }

  async function deleteHandler(isSosial?: boolean) {
    if (isSosial) {
      try {
        const result = (await SocialDeleteHandler()).user;
        result.delete().then(() => deleteUserDB(isSosial));
        router.push("/pages/login");
      } catch {
        popuprHandler({ message: "회원탈퇴 중 에러가 발생하였습니다" });
      }
    } else {
      const password = quitPw;
      try {
        const result = await originDeleteHandler({
          data: data as User,
          password,
        });
        result.user.delete().then(() => deleteUserDB());
        router.push("/pages/login");
      } catch {
        popuprHandler({ message: "회원탈퇴 중 에러가 발생하였습니다" });
      }
    }
  }

  return <div></div>;
};

export default QuitPage;
