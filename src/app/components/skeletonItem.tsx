import "@/app/_asset/home.scss";
const postItem = () => {
  return (
    <div className="post skeleton" data-testid="skeleton">
      <figure className="thumbnail">
        <div
          style={{
            width: 300,
            height: 180,
          }}
        ></div>
      </figure>
      <div className="text_wrap">
        <p className="post_title"></p>
        <p className="post_text"></p>
        <p className="post_date"></p>
      </div>
      <div className="writer_wrap">
        <div className="id writter-id">
          <p className="profile_id"></p>
        </div>
        <p className="favorite"></p>
      </div>
    </div>
  );
};

export default postItem;
