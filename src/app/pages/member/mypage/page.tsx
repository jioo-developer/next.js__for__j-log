"use client";
import "@/app/_asset/profile.scss";
import Image from "next/image";
import React, { ChangeEvent, useEffect, useState } from "react";
import useNickQueryHook from "@/app/api_hooks/common/getnameHook";
import useUserQueryHook from "@/app/api_hooks/login/getUserHook";
import onFileChange from "@/app/handler/file/onFileChangeHandler";
import storageUpload from "@/app/handler/file/storageUploadHandler";
import { User } from "firebase/auth";
import { popuprHandler } from "@/app/handler/error/ErrorHandler";
import { Input } from "@/stories/atoms/Input";
import useNameChanger from "@/app/handler/mypage/useMutationHandler";
import ButtonGroup from "@/stories/modules/ButtonGroup/ButtonGroup";
import { Button } from "@/stories/atoms/Button";
import QuitPage from "../quit/page";
import useImageChanger from "@/app/handler/mypage/useImaeMutationHandler";
import ItemStore from "@/stories/modules/ItemStore/ItemStore";

function MyPage() {
  const { data, isLoading } = useUserQueryHook();
  const { nicknameData, refetch } = useNickQueryHook();

  const [nickname, setnickname] = useState("");
  const [nameToggle, setnameToggle] = useState(false);
  const [quit, setQuit] = useState(false);
  const [storeToggle, setStore] = useState(false);

  const nameChangeMutate = useNameChanger();
  const imageChangeMutate = useImageChanger();

  useEffect(() => {
    if (data) {
      setnickname(data.displayName as string);
    }
  }, [data]);

  async function changeNameHandler() {
    if (nicknameData && data) {
      const isNamecheck = nicknameData.includes(nickname);
      // 닉네임 중복 체크
      if (!isNamecheck) {
        nameChangeMutate.mutate({ data, nickname });
        setnameToggle(!nameToggle);
        refetch();
      } else {
        popuprHandler({ message: "이미 사용중인 닉네임 입니다" });
      }
    }
  }

  async function changeImageHandler(e: ChangeEvent<HTMLInputElement>) {
    const theFiles = Array.from(e.target.files || []);
    if (theFiles.length > 0) {
      let upload = null;
      try {
        const { result, files } = await onFileChange(theFiles);
        // 업로드 한  파일을 URL로 변환하는 함수
        upload = await storageUpload(result, files);
        if (upload.length === 0 || !upload[0]) return;
        // Firebase에 등록 할 수 있게 URL 변환
      } catch (error) {
        popuprHandler({ message: "프로필 업로드에 실패하였습니다." });
        return;
      }

      if (upload && upload.length > 0 && upload[0]) {
        imageChangeMutate.mutate({ user: data as User, imgurl: upload[0] });
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
                {isLoading ? (
                  <div
                    style={{
                      width: 135,
                      height: 135,
                      background: "#888",
                      borderRadius: "50%",
                    }}
                  ></div>
                ) : (
                  <Image
                    width={135}
                    height={135}
                    src={data.photoURL ? data.photoURL : "/img/no-image.jpg"}
                    alt="프로필 이미지"
                  />
                )}
              </figure>

              <label htmlFor="img_check" className="uploads btn">
                이미지 업로드
              </label>
            </div>
            <div className="name_area" data-testid="name_area">
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
            <div className="delete_wrap" style={{ marginTop: 35 }}>
              <p className="withdrawal_title" style={{ marginRight: 35 }}>
                우선권 구매
              </p>
              <Button
                theme="white"
                width={110}
                onClick={() => setStore(!storeToggle)}
              >
                구매하기
              </Button>
            </div>
            <p
              className="explan"
              style={{ borderBottom: "1px solid #eee", paddingBottom: 15 }}
            >
              탈퇴 시 작성한 포스트 및 댓글이 모두 삭제되며 복구되지 않습니다.
            </p>
            <p className="explan">
              소셜로그인 회원탈퇴는 첫 가입 시 입력했던 2차 비밀번호 입니다.
            </p>
          </div>
        </section>
        {quit && <QuitPage setQuit={setQuit} />}
        {storeToggle && <ItemStore setState={setStore} />}
      </div>
    )
  );
}

export default MyPage;
