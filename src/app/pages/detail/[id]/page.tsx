"use client";
import "@/app/_asset/detail.scss";
import useDetailQueryHook, {
  FirebaseData,
} from "@/app/api_hooks/detail/getDetailHooks";
import useUserQueryHook from "@/app/api_hooks/login/getUserHook";
import cookieHandler from "@/app/common/handler/cookieHandler";
import useFavorite from "@/app/common/handler/detail/favoriteHandler";
import DeleteHandler from "@/app/common/handler/detail/pageDeleteHanlder";
import { errorHandler } from "@/app/common/handler/error/ErrorHandler";
import { db } from "@/app/Firebase";
import { popupMessageStore } from "@/app/store/common";
import { User } from "firebase/auth";
import { deleteDoc, doc } from "firebase/firestore";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

const DetailPage = () => {
  const router = useRouter();
  const { id } = useParams() as { id: string };
  const { data } = useUserQueryHook();
  const { pageData, isLoading, pageRefetch } = useDetailQueryHook(id);

  const user = data as User;

  async function favoriteHandler() {
    const getcookie = `${user.uid as string}-Cookie`;
    if (document.cookie.includes(getcookie) && pageData) {
      try {
        await useFavorite({ pageData, id });
        pageRefetch();
        cookieHandler(getcookie, "done");
      } catch {
        throw new Error("좋아요 반영이 되지 않았습니다.");
      }
    }
  }

  async function pageDeleteHandler(boolean?: boolean) {
    if (!boolean) {
      popupMessageStore.setState((prev) => {
        console.log(prev);
        return { message: "정말 삭제 하시겠습니까?" };
      });
      return;
    } else {
      try {
        await DeleteHandler(pageData as FirebaseData);
        const locate = doc(db, "post", id);
        await deleteDoc(locate);
        router.push("/pages/main");
      } catch {
        errorHandler("해당 페이지 삭제에 실패 하셨습니다");
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
                  src={pageData.profile}
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
                      onClick={() => router.push(`/detail?id=${id}`)}
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
                <button className="favorite_btn" onClick={favoriteHandler}>
                  <span>👍</span>추천&nbsp;{pageData.favorite}
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    )
  );
};

export default DetailPage;
