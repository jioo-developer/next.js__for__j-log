"use client";
import "@/app/_asset/myboard.scss";
import useUserQueryHook from "@/app/api_hooks/login/getUserHook";
import useMyDataQueryHook from "@/app/api_hooks/mypage/getMyPostData";
import { popuprHandler } from "@/app/handler/error/ErrorHandler";
import { pageInfoStore, popupMessageStore } from "@/app/store/common";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const MyBoardPage = () => {
  const { data: user } = useUserQueryHook();
  const { myData, isLoading, error } = useMyDataQueryHook();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (myData.length === 0) {
        popuprHandler({ message: "게시글이 조회되지 않습니다." });
      }
    }
  }, [myData]);

  function routeHandler() {
    pageInfoStore.setState({ pgId: myData[0].pageId });
    router.push(`/pages/detail/${myData[0].pageId}`);
  }

  return (
    <>
      {!isLoading && user && myData.length > 0 && (
        <div className="wrap board_wrap">
          <section className="board__header">
            <Image
              width={128}
              height={128}
              src={user.photoURL ? user.photoURL : "/img/no-image.jpg"}
              alt="프로필 이미지"
              className="header_img"
            />
            <p className="board__nickname">{user.displayName}</p>
          </section>
          <section className="board__content">
            <div className="content__in">
              <p className="all_view">
                전체보기
                <span>&nbsp;{`(${myData.length})`}</span>
              </p>
              {myData.map((item, index) => {
                return (
                  <article onClick={routeHandler} key={index}>
                    <figure>
                      <Image
                        src={item.url[0] ? item.url[0] : "/img/no-image.jpg"}
                        width={768}
                        height={400}
                        alt="프로필 이미지"
                      />
                    </figure>
                    <figcaption>
                      <p className="content__title">{item.title}</p>
                      <p className="content__text">{item.text}</p>
                      <div className="caption__bottom">
                        <p>{item.date}</p>
                        <p>{`${item.replyLength}개의 댓글`}</p>
                        <p>
                          ♥&nbsp;
                          {item.favorite}
                        </p>
                      </div>
                    </figcaption>
                  </article>
                );
              })}
            </div>
          </section>
        </div>
      )}
    </>
  );
};

export default MyBoardPage;
