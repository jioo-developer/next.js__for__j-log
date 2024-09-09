import useUserQueryHook from "@/app/api_hooks/login/getUserHook";
import useMyDataQueryHook from "@/app/api_hooks/mypage/getMyPostData";
import { pageInfoStore } from "@/app/store/common";
import Image from "next/image";
import { useRouter } from "next/navigation";

const MyBoardPage = () => {
  const { data: user } = useUserQueryHook();
  const { myData } = useMyDataQueryHook();
  const router = useRouter();
  function routeHandler() {
    pageInfoStore.setState({ pgId: myData[0].pageId });
    router.push(`/pages/detail/${myData[0].pageId}`);
  }
  return (
    <>
      {user && myData && (
        <div className="wrap board_wrap">
          <section className="board__header">
            <Image
              width={128}
              height={128}
              src={user.photoURL as string}
              alt="프로필 이미지"
              className="header_img"
            />
            <p className="board__nickanme">{user.displayName}</p>
          </section>
          <section className="board__content" onClick={routeHandler}>
            <aside>
              <p className="all_view">
                전체보기
                <span>{`(${myData.length})`}</span>
              </p>
            </aside>
            <div className="content__in">
              <figure>
                <Image
                  src={myData[0].url[0]}
                  width={768}
                  height={400}
                  alt="프로필 이미지"
                />
              </figure>
              <figcaption>
                <p className="content__title">{myData[0].title}</p>
                <p className="content__text">{myData[0].text}</p>
                <div className="caption__bottom">
                  <p>{myData[0].date}</p>
                  <p>{`${myData[0].replies}개의 댓글`}</p>
                  <p>♥&nbsp;{myData[0].favorite}</p>
                </div>
              </figcaption>
            </div>
          </section>
        </div>
      )}
    </>
  );
};

export default MyBoardPage;
