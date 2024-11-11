"use client";
import "@/app/_asset/detail.scss";
import useDetailQueryHook, {
  FirebaseData,
} from "@/app/api_hooks/detail/getDetailHook";
import useUserQueryHook from "@/app/api_hooks/login/getUserHook";
import { popupInit, popuprHandler } from "@/app/handler/error/ErrorHandler";
import Reply from "@/app/pages/detail/_reply/page";
import { pageInfoStore, popupMessageStore } from "@/app/store/common";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useGetPageInfo } from "@/app/handler/detail/pageInfoHandler";
import useFavoriteMutate from "@/app/handler/detail/useMutationHandler";
import usePageDeleteHandler from "@/app/handler/detail/crud/useDeleteMutationHandler";
import { User } from "firebase/auth";
import { MyContextProvider } from "../_reply/context";

const DetailPage = () => {
  const router = useRouter();

  const { data: user } = useUserQueryHook();

  const pageInfo = useGetPageInfo();
  const { pageData, isLoading, error } = useDetailQueryHook(pageInfo);

  const msg = popupMessageStore().message;
  const ispopupClick = popupMessageStore().isClick;

  const favoriteMutate = useFavoriteMutate();
  const pageDeleteMutate = usePageDeleteHandler();

  useEffect(() => {
    if (!isLoading) {
      if (!pageData || error) {
        popuprHandler({ message: "페이지 정보가 조회 되지 않습니다." });
      }
    }
  }, [pageData, isLoading]);
  // 페이지 정보가 없을 때 팝업 노출

  useEffect(() => {
    popupMessageStore.subscribe((state, prevState) => {
      const target = "페이지 정보가 조회 되지 않습니다.";
      if (prevState.message === target && state.message === "") {
        router.push("/pages/main");
      }
    });
  }, [msg]);
  // 팝업 노출 후 확인 눌렀을 시 메인페이지로 이동

  function favoriteHandler() {
    const getcookie = `${(user as User).uid}-Cookie`;
    if (!document.cookie.includes(getcookie)) {
      favoriteMutate.mutate({
        value: (pageData as FirebaseData).favorite,
        id: pageInfo,
      });
    }
  }

  // 좋아요 조절 함수

  useEffect(() => {
    if (ispopupClick) {
      onDelete();
      popupInit();
    }
  }, [ispopupClick]);

  const from = pageInfoStore().fromAction;

  async function pageDeleteHandler() {
    popuprHandler({ message: "정말 삭제 하시겠습니까?", type: "confirm" });
    pageInfoStore.setState({ fromAction: "detail" });
  }

  async function onDelete() {
    if (from === "detail") {
      pageDeleteMutate.mutate(pageData as FirebaseData);
    }
  }

  const handleCopy = async () => {
    try {
      // 현재 페이지 URL을 가져와 클립보드에 복사합니다.
      await navigator.clipboard.writeText(window.location.href);
      popuprHandler({ message: "클립보드에 복사되었습니다" });
    } catch (err) {
      console.error("복사 실패:", err);
    }
  };

  return (
    pageData &&
    user &&
    !isLoading && (
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
                <button className="delete" onClick={() => pageDeleteHandler()}>
                  삭제
                </button>
              </div>
            </div>
          </section>
          <section className="content_wrap">
            <pre className="text">{pageData.text}</pre>
            <div className="grid">
              {pageData.url.length > 0 &&
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
                <div className="right_box">
                  <button className="favorite_btn" onClick={handleCopy}>
                    공유하기
                  </button>

                  <button className="favorite_btn" onClick={favoriteHandler}>
                    <span>👍</span>추천&nbsp;{pageData.favorite}
                  </button>
                </div>
              </div>
              <MyContextProvider>
                <Reply />
              </MyContextProvider>
            </div>
          </section>
        </div>
      </div>
    )
  );
};

export default DetailPage;
