"use client";
import "@/app/_asset/detail.scss";
import useFavoriteMutate from "@/app/api_hooks/detail/favoriteMutate";
import useDetailQueryHook, {
  FirebaseData,
} from "@/app/api_hooks/detail/getDetailHooks";
import useUserQueryHook from "@/app/api_hooks/login/getUserHook";
import DeleteHandler from "@/app/common/handler/detail/pageDeleteHanlder";
import {
  popupInit,
  popuprHandler,
} from "@/app/common/handler/error/ErrorHandler";
import Reply from "@/app/components/ReplyComponent";
import { db } from "@/app/Firebase";
import { pageInfoStore, popupMessageStore } from "@/app/store/common";
import { User } from "firebase/auth";
import { deleteDoc, doc } from "firebase/firestore";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

const DetailPage = () => {
  const router = useRouter();

  const pageParams = useParams().id as string;
  const id = pageInfoStore().pgId === "" ? pageParams : pageInfoStore().pgId;

  const { data } = useUserQueryHook();
  const { pageData, isLoading } = useDetailQueryHook(id);
  const user = data as User;

  const msg = popupMessageStore().message;

  const ispopupClick = popupMessageStore().isClick;

  const favoriteQuery = useFavoriteMutate();

  useEffect(() => {
    if (!isLoading) {
      if (!pageData) {
        popuprHandler({ message: "페이지 정보가 조회 되지 않습니다." });
      }
    }
  }, [pageData, isLoading]);

  useEffect(() => {
    popupMessageStore.subscribe((state, prevState) => {
      const target = "페이지 정보가 조회 되지 않습니다.";
      if (prevState.message === target && state.message === "") {
        router.push("/pages/main");
      }
    });
  }, [msg]);

  useEffect(() => {
    if (ispopupClick) {
      pageDeleteHandler(ispopupClick);
    }
  }, [ispopupClick]);

  async function favoriteHandler() {
    const email = user.email as string;
    const getcookie = `${email}-Cookie`;
    if (!document.cookie.includes(getcookie)) {
      const ref = doc(db, "post", id);
      favoriteQuery.mutate({
        email,
        pageData: pageData as FirebaseData,
        ref,
        id,
      });
    }
  }

  async function pageDeleteHandler(params?: boolean) {
    if (!params) {
      popuprHandler({ message: "정말 삭제 하시겠습니까?", type: "confirm" });
    } else {
      try {
        if ((pageData as FirebaseData).fileName.length > 0) {
          await DeleteHandler(pageData as FirebaseData);
        }
        const locate = doc(db, "post", id);
        await deleteDoc(locate);
        popupInit();
        router.push("/pages/main");
      } catch {
        popuprHandler({ message: "페이지 삭제 도중 문제가 생겼습니다" });
      }
    }
  }

  if (isLoading) {
    return <div></div>;
  }

  return (
    pageData &&
    user && (
      <div className="detail_wrap">
        <div className="in_wrap">
          <section className="sub_header">
            <h1>{pageData.title}</h1>
            <div className="writer_wrap">
              <div className="left_wrap">
                <Image
                  src={pageData.profile ? pageData.profile : "/img/default.svg"}
                  width={40}
                  height={40}
                  alt="프로필"
                  className="profile"
                />
                <p className="writer">{pageData.user}</p>
                <p className="date">{pageData.date}</p>
              </div>
              {user.uid === pageData.writer ||
                (user.email === "rlawl3383@gmail.com" && (
                  <div className="right_wrap">
                    <button
                      className="edit"
                      onClick={() => {
                        pageInfoStore.setState({ editMode: true });
                        router.push("/pages/editor");
                      }}
                    >
                      수정
                    </button>
                    <button
                      className="delete"
                      onClick={() => pageDeleteHandler()}
                    >
                      삭제
                    </button>
                  </div>
                ))}
            </div>
          </section>
          <section className="content_wrap">
            <pre className="text">{pageData.text}</pre>
            <div className="grid">
              {pageData.url &&
                pageData.url.length > 0 &&
                pageData.url.map((value, index) => {
                  return (
                    <Image
                      src={value}
                      className="att"
                      alt="업로드 이미지"
                      key={index}
                      width={160}
                      height={160}
                    />
                  );
                })}
            </div>
            <div className="comment">
              <div className="favorite_wrap">
                <p className="com_title">게시글에 대한 댓글을 달아주세요.</p>
                <button className="favorite_btn" onClick={favoriteHandler}>
                  <span>👍</span>추천&nbsp;{pageData.favorite}
                </button>
              </div>
              <Reply pageId={id} />
            </div>
          </section>
        </div>
      </div>
    )
  );
};

export default DetailPage;
