"use client";
import "@/app/_asset/profile.scss";
import Image from "next/image";
import React, { ChangeEvent, useEffect, useState } from "react";

import useNickQueryHook from "@/app/api_hooks/signup/getNicknamehooks";
import useUserQueryHook from "@/app/api_hooks/login/getUserHook";

import onFileChange from "@/app/common/handler/file/onFileChangeHandler";
import storageUpload from "@/app/common/handler/file/storageUploadHandler";
import { updateProfile, User } from "firebase/auth";
import { authService } from "@/app/Firebase";
import { popuprHandler } from "@/app/common/handler/error/ErrorHandler";
import { Input } from "@/stories/atoms/Input";
import useNameChanger from "@/app/api_hooks/mypage/nameChangeHandler";
import ButtonGroup from "@/stories/modules/ButtonGroup/ButtonGroup";
import { Button } from "@/stories/atoms/Button";
import { useRouter } from "next/navigation";
import QuitPage from "../quit/page";
import { popupMessageStore } from "@/app/store/common";

function MyPage() {
  const [nickname, setnickname] = useState("");
  const [nameToggle, setnameToggle] = useState(false);
  const [quit, setQuit] = useState(false);

  const { data } = useUserQueryHook();
  const { nicknameData } = useNickQueryHook();

  const nameChangeMutate = useNameChanger();

  const msg = popupMessageStore().message;

  const router = useRouter();

  useEffect(() => {
    if (data) {
      setnickname(data.displayName as string);
    }
  }, [data]);

  useEffect(() => {
    popupMessageStore.subscribe((state, prevState) => {
      if (prevState.message !== "" && state.message === "") {
        setQuit(false);
      }
    });
  }, [msg]);

  async function changeNameHandler() {
    if (nicknameData) {
      const isNamecheck = nicknameData.includes(nickname);
      if (isNamecheck) {
        popuprHandler({ message: "이미 사용중인 닉네임 입니다" });
      } else {
        nameChangeMutate.mutate({ data, nickname });
        setnameToggle(!nameToggle);
      }
    }
  }

  async function changeImageHandler(e: ChangeEvent<HTMLInputElement>) {
    const user = authService.currentUser;
    const theFiles = Array.from(e.target.files || []);
    if (theFiles.length > 0) {
      try {
        const { result, files } = await onFileChange(theFiles);
        const upload = await storageUpload(result, files);
        try {
          await updateProfile(user as User, { photoURL: upload[0] });
          router.push("/pages/main");
        } catch {
          popuprHandler({ message: "프로필 변경에 실패하였습니다." });
        }
      } catch (error) {
        popuprHandler({ message: "프로필 업로드에 실패하였습니다." });
      }
    }
  }

  return (
    data && (
      <div className="profile_wrap">
        <section className="content">
          <div className="profile_area">
            <div className="img_wrap">
              <input
                type="file"
                accept="image/*"
                id="img_check"
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  changeImageHandler(e)
                }
              />
              <figure className="profileImg">
                <Image
                  width={135}
                  height={135}
                  src={data.photoURL as string}
                  alt="프로필 이미지"
                />
              </figure>
              <label htmlFor="img_check" className="uploads btn">
                이미지 업로드
              </label>
            </div>
            <div className="name_area">
              {nameToggle ? (
                <Input
                  type="text"
                  width={375}
                  height={45}
                  fontSize={16}
                  value={nickname}
                  setstate={setnickname}
                />
              ) : (
                <b className="nickname">{data.displayName}</b>
              )}
              <ButtonGroup rightAlign={false}>
                <Button
                  width={"auto"}
                  className="btn"
                  onClick={() => {
                    !nameToggle
                      ? setnameToggle(!nameToggle)
                      : changeNameHandler();
                  }}
                >
                  {nameToggle ? "수정완료" : "수정"}
                </Button>
                {nameToggle && (
                  <Button
                    className="btn comment_btn"
                    width={"auto"}
                    onClick={() => nameToggle && setnameToggle(!nameToggle)}
                  >
                    취소
                  </Button>
                )}
              </ButtonGroup>
            </div>
          </div>
          <div className="suggest">
            <p className="suggest_title">문의사항</p>
            <p className="director_email">rlawlgh388@naver.com</p>
          </div>
          <div className="withdrawal">
            <div className="delete_wrap">
              <p className="withdrawal_title">회원 탈퇴</p>
              <button className="btn" onClick={() => setQuit(!quit)}>
                회원 탈퇴
              </button>
            </div>
            <p
              className="explan"
              style={{ borderBottom: "1px solid #eee", paddingBottom: 15 }}
            >
              탈퇴 시 작성한 포스트 및 댓글이 모두 삭제되며 복구되지 않습니다.
            </p>
            <p className="explan">
              소셜로그인 회원탈퇴는 첫 가입 시 입력했던 비밀번호 입니다.
            </p>
          </div>
        </section>
        {quit && <QuitPage />}
      </div>
    )
  );
}

export default MyPage;
