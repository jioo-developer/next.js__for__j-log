"use client";
import "@/app/_asset/Sign.scss";
import { authService } from "@/app/Firebase";
import useUserQueryHook from "@/app/hooks/login/getUserHook";
import { LoginErrorHandler } from "@/app/hooks/login/LoginErrorType";
import { popupMessageStore } from "@/app/store/common";
import { Button } from "@/stories/atoms/Button";
import { Input } from "@/stories/atoms/Input";
import { Popup } from "@/stories/atoms/Popup";
import ButtonGroup from "@/stories/modules/ButtonGroup/ButtonGroup";
import { sendPasswordResetEmail } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

const ResetPw = () => {
  const [findPw, setFindPw] = useState("");
  const msg = popupMessageStore();
  const { data } = useUserQueryHook();
  const router = useRouter();

  function routerHandler() {
    router.push("/pages/login");
  }

  const resetHandler = () => {
    sendPasswordResetEmail(authService, findPw)
      .then(() => {
        popupMessageStore.setState({
          message: "입력하신 메일로 비밀번호 안내드렸습니다.",
        });
        routerHandler();
      })
      .catch((error) => {
        const errorMessage = LoginErrorHandler(error.message);
        popupMessageStore.setState({ message: errorMessage });
      });
  };
  return (
    <>
      {data && (
        <section className="find">
          <div className="find_wrap">
            <p>비밀번호를 잊어 버리셨나요?</p>
            <div className="find-form">
              <Input
                type="email"
                width={"full"}
                height={45}
                fontSize={14}
                setstate={setFindPw}
              />

              <ButtonGroup rightAlign>
                <Button onClick={routerHandler}>취소</Button>
                <Button onClick={resetHandler} theme="success">
                  확인
                </Button>
              </ButtonGroup>
            </div>
            {msg.message !== "" && <Popup rightAlign top />}
          </div>
        </section>
      )}
    </>
  );
};

export default ResetPw;
