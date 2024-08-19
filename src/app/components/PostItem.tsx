import "@/app/_asset/home.scss";
import Image from "next/image";
import { postProps } from "@/app/api_hooks/main/getPosthooks";
import { useRouter } from "next/navigation";

type itemProps = {
  item: postProps;
  index: number;
};

const PostItem = ({ item, index }: itemProps) => {
  const router = useRouter();
  function goDetail() {
    router.push(`/pages/detail/${item.pageId}`);
  }

  return (
    <div className="post" key={`item-${index}`} onClick={goDetail}>
      <figure className="thumbnail">
        <Image
          width={320}
          height={180}
          src={item.url.length > 0 ? item.url[0] : "/img/no-image.jpg"}
          alt="썸네일"
        />
      </figure>
      <div className="text_wrap">
        <p className="post_title">{item.title}</p>
        <p className="post_text">{item.text}</p>
        <p className="post_date">{item.date}</p>
      </div>
      <div className="writer_wrap">
        <div className="id writter-id">
          <Image
            src={item.profile}
            alt=""
            width={40}
            height={40}
            className="profile"
          />
          <p className="profile_id">{item.user}</p>
        </div>
        <p className="favorite">❤{item.favorite}</p>
      </div>
    </div>
  );
};

export default PostItem;
