"use client";
import { useReplyQueryHook } from "@/app/api_hooks/Reply/getReplyHook";
import ReactTextareaAutosize from "react-textarea-autosize";
import { pageInfoStore } from "@/store/common";
import ReplyItem from "@/app/pages/detail/_reply/ReplyItem";
import { useReplyContext } from "@/app/pages/detail/_reply/context";
import { useCreateHandler } from "@/app/handler/Reply/useMutationHandler";
import useUserQueryHook from "@/app/api_hooks/login/getUserHook";
import { User } from "firebase/auth";

const Reply = () => {
  const id = pageInfoStore().pgId;

  const { data } = useUserQueryHook();

  const { replyData, isLoading } = useReplyQueryHook(id);

  const { comment, setComment, commentTarget } = useReplyContext();

  const isReply = !isLoading && replyData && replyData.length > 0;

  const createMutation = useCreateHandler();

  const CreateRely = async () => {
    const user = data as User;
    const userObj = {
      name: user.displayName as string,
      profile: user.photoURL ? user.photoURL : "/img/default.svg",
      uid: user.uid as string,
    };
    createMutation.mutate({ user: userObj, id, comment });
    setComment("");
  };

  return (
    <>
      {isReply &&
        data &&
        replyData.map((item, index) => {
          return (
            <ReplyItem
              key={index}
              item={item}
              index={index}
              replyData={replyData}
              pageId={id}
            />
          );
        })}
      <form
        role="form"
        onSubmit={(e) => {
          if (comment !== "") {
            e.preventDefault();
            CreateRely();
          }
        }}
      >
        <ReactTextareaAutosize
          cacheMeasurements
          onHeightChange={(height) => ""}
          minRows={4}
          className="comment_input"
          placeholder="댓글을 입력하세요"
          value={commentTarget === "" ? comment : ""}
          onChange={(e) => setComment(e.target.value)}
          readOnly={commentTarget !== ""}
        />
        <button className="btn">댓글 작성</button>
      </form>
    </>
  );
};

export default Reply;
