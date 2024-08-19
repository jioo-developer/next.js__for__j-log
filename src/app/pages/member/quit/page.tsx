"use client";
import useUserQueryHook from "@/app/api_hooks/login/getUserHook";
import { errorHandler } from "@/app/common/handler/error/ErrorHandler";
import {
  LoginTypeCheck,
  deleteUserDB,
} from "@/app/common/handler/quit/quitHandler";
import originDeleteHandler from "@/app/common/handler/quit/originquit";
import SocialDeleteHandler from "@/app/common/handler/quit/socialquit";
import { popupMessageStore } from "@/app/store/common";
import { Button } from "@/stories/atoms/Button";
import { Input } from "@/stories/atoms/Input";
import { Popup } from "@/stories/atoms/Popup";
import ButtonGroup from "@/stories/modules/ButtonGroup/ButtonGroup";
import { useRouter } from "next/navigation";
import { useState } from "react";

const QuitPage = () => {
  const msgContent = popupMessageStore();
  const router = useRouter();
  const { data } = useUserQueryHook();
  const [quitPw, setPw] = useState("");
  const [subCon, setSub] = useState(true);

  async function deleteHandler() {
    errorHandler("비밀번호를 입력해주세요");
    if (data && quitPw !== "") {
      const password = quitPw;
      const userHandler = await LoginTypeCheck({ data, password });
      if (!userHandler) {
        errorHandler("첫 가입시 입력하신 비밀번호랑 다릅니다.");
      } else {
        try {
          if (userHandler === "social") {
            const result = (await SocialDeleteHandler()).user;
            result.delete().then(() => deleteUserDB(userHandler));
          } else {
            const result = (await originDeleteHandler({ data, password })).user;
            result.delete().then(() => deleteUserDB());
          }
          errorHandler("회원탈퇴가 완료되었습니다");
          setSub(true);
        } catch {
          errorHandler("사용자 재인증에 실패하였습니다");
        }
      }
    }
  }

  if (msgContent.message !== "") {
    return (
      <Popup
        direction="column"
        type="custom"
        textAlign="center"
        height={250}
        subText={
          subCon ? "탈퇴하시면 모든 정보를 복구 할 수 없습니다." : undefined
        }
      >
        <div className="direction-wrap">
          {subCon ? (
            <ButtonGroup>
              <Button>취소</Button>
              <Button
                theme="success"
                onClick={() => {
                  errorHandler("");
                  setSub(false);
                  deleteHandler();
                }}
              >
                확인
              </Button>
            </ButtonGroup>
          ) : (
            <>
              <Input type="password" setstate={setPw} />
              <Button>확인</Button>
            </>
          )}
        </div>
      </Popup>
    );
  } else {
    router.push("/pages/member/profile");
  }
};

export default QuitPage;
