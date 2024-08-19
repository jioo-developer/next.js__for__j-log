"use client";
import "@/app/_asset/profile.scss";
import Image from "next/image";
import React, { ChangeEvent, useEffect, useState } from "react";

import useNickQueryHook from "@/app/api_hooks/signup/getNicknamehooks";
import useUserQueryHook from "@/app/api_hooks/login/getUserHook";

import Quit from "@/app/pages/member/quit/page";

import { globalRefetch } from "@/app/store/common";
import nameChangeHandler from "@/app/common/handler/nickname/nicknameChangeHandler";
import onFileChange from "@/app/common/handler/file/onFileChangeHandler";
import storageUpload from "@/app/common/handler/file/storageUploadHandler";
import { updateProfile, User } from "firebase/auth";
import { authService } from "@/app/Firebase";
import { errorHandler } from "@/app/common/handler/error/ErrorHandler";

function MyPage() {
  const [nickname, setnickname] = useState("");
  const [nameToggle, setnameToggle] = useState(false);
  const [toggleQuit, setQuit] = useState(false);

  const refetchState = globalRefetch();

  const { nicknameData } = useNickQueryHook();
  const { data, refetch } = useUserQueryHook();

  useEffect(() => {
    if (data) {
      setnickname(data.displayName as string);
    }
  }, [data, refetchState]);

  async function nameHandler() {
    if (nicknameData) {
      try {
        await nameChangeHandler({ data, nicknameData, nickname });
        refetch();
        globalRefetch.setState({ refetch: !refetch });
        setnameToggle(!nameToggle);
      } catch {
        errorHandler("닉네임을 변경에 실패하였습니다.");
      }
    }
  }

  async function ImageHandler(e: ChangeEvent<HTMLInputElement>) {
    const user = authService.currentUser;
    const theFiles = Array.from(e.target.files || []);
    if (theFiles.length > 0) {
      try {
        const { result, files } = await onFileChange(theFiles);
        const upload = await storageUpload(result, files);

        try {
          await updateProfile(user as User, { photoURL: upload[0] });
          refetch();
          globalRefetch.setState({ refetch: !refetch });
        } catch {
          errorHandler("프로필 변경에 실패하였습니다.");
        }
      } catch (error) {
        errorHandler("프로필 업로드에 실패하였습니다.");
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
                onChange={(e: ChangeEvent<HTMLInputElement>) => ImageHandler(e)}
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
                <input
                  type="text"
                  value={nickname}
                  className="form-control"
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setnickname(e.target.value)
                  }
                />
              ) : (
                <b className="nickname">{data.displayName}</b>
              )}

              <button
                className="btn comment_btn"
                onClick={() =>
                  !nameToggle ? setnameToggle(!nameToggle) : nameHandler()
                }
              >
                {nameToggle ? "수정완료" : "닉네임 수정"}
              </button>
              {nameToggle && (
                <button
                  className="btn comment_btn"
                  onClick={() => nameToggle && setnameToggle(!nameToggle)}
                >
                  취소
                </button>
              )}
            </div>
          </div>
          <div className="suggest">
            <p className="suggest_title">문의사항</p>
            <p className="director_email">rlawlgh388@naver.com</p>
          </div>
          <div className="withdrawal">
            <div className="delete_wrap">
              <p className="withdrawal_title">회원 탈퇴</p>
              <button
                className="btn"
                onClick={() => {
                  setQuit(true);
                  errorHandler("정말로 탈퇴하시겠어요?");
                }}
              >
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
        {toggleQuit && <Quit />}
      </div>
    )
  );
}

export default MyPage;
