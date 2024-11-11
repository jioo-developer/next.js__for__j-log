"use client";
import { useReplyQueryHook } from "@/app/api_hooks/Reply/getReplyHook";
import ReactTextareaAutosize from "react-textarea-autosize";
import { pageInfoStore } from "@/app/store/common";
import ReplyItem from "@/app/pages/detail/_reply/ReplyItem";
import { useReplyContext } from "./context";
import { User } from "firebase/auth";
import { useCreateHandler } from "@/app/handler/Reply/useMutationHandler";
import useUserQueryHook from "@/app/api_hooks/login/getUserHook";

const Reply = () => {
  const id = pageInfoStore().pgId;

  const { data } = useUserQueryHook();

  const { replyData, isLoading } = useReplyQueryHook(id);

  const { comment, setComment } = useReplyContext();

  const isReply = !isLoading && replyData && replyData.length > 0;

  const createMutation = useCreateHandler();

  const CreateRely = async () => {
    const user = data as User;
    const userObj = {
      name: user.displayName as string,
      profile: user.photoURL ? user.photoURL : "img/default.svg",
      uid: user.uid as string,
    };

    await createMutation.mutateAsync({ user: userObj, id, comment });
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
        onSubmit={(e) => {
          e.preventDefault();
          CreateRely();
        }}
      >
        <ReactTextareaAutosize
          cacheMeasurements
          onHeightChange={(height) => ""}
          minRows={4}
          className="comment_input"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button className="btn">댓글 작성</button>
      </form>
    </>
  );
};

export default Reply;
