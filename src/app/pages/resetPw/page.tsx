"use client";
import "@/app/_asset/Sign.scss";
import { authService } from "@/app/Firebase";
import { LoginErrorHandler } from "@/app/api_hooks/login/LoginErrorHandler";
import { sendPasswordResetEmail } from "firebase/auth";
import { useRouter } from "next/navigation";
import { popuprHandler } from "@/app/handler/error/ErrorHandler";
import useUserQueryHook from "@/app/api_hooks/login/getUserHook";
import { Popup } from "@/stories/atoms/Popup";
import { Input } from "@/stories/atoms/Input";
import ButtonGroup from "@/stories/modules/ButtonGroup/ButtonGroup";
import { Button } from "@/stories/atoms/Button";
import { useEffect, useState } from "react";
import { validateEmail } from "@/app/handler/commonHandler";

const ResetPwPage = () => {
  const [findPw, setFindPw] = useState("");

  const { data, isLoading } = useUserQueryHook();

  const router = useRouter();

  useEffect(() => {
    if (data && !isLoading) {
      router.push("/pages/login");
    }
  }, [data, isLoading]);

  const resetHandler = async () => {
    try {
      await sendPasswordResetEmail(authService, findPw);
      const isEmail = validateEmail(findPw);
      if (isEmail) {
        popuprHandler({ message: "입력하신 메일로 비밀번호 안내드렸습니다" });
        router.push("/pages/login");
      } else {
        throw new Error("올바른 이메일 형식이 아닙니다.");
      }
    } catch (error) {
      popuprHandler({ message: "올바른 이메일 형식이 아닙니다." });
    }
  };

  return (
    <Popup type="custom" width="28rem;" customText="비밀번호를 잊어버리셨나요?">
      <Input type="email" width="full" setstate={setFindPw} />
      <ButtonGroup>
        <Button onClick={() => router.push("/pages/login")}>취소</Button>
        <Button theme="success" onClick={() => resetHandler()}>
          확인
        </Button>
      </ButtonGroup>
    </Popup>
  );
};

export default ResetPwPage;
