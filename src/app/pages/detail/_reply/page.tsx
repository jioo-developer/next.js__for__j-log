"use client";
import { FormEvent, useEffect } from "react";
import { useReplyQueryHook } from "@/app/api_hooks/detail-reply/getReplyHook";
import ReactTextareaAutosize from "react-textarea-autosize";
import { pageInfoStore, popupMessageStore } from "@/app/store/common";
import ReplyItem from "@/app/pages/detail/_reply/ReplyItem";
import { useReplyContext } from "./context";
import { authService } from "@/app/Firebase";
import { User } from "firebase/auth";
import { useCreateHandler } from "@/app/handler/detail-reply/useSetReplyHandler";

const Reply = () => {
  const id = pageInfoStore().pgId;

  const { replyData, isLoading } = useReplyQueryHook(id);

  const { msg, comment, setComment } = useReplyContext();

  const isReply = !isLoading && replyData && replyData.length > 0;

  // useEffect(() => {
  //   popupMessageStore.subscribe((state, prevState) => {
  //     if (prevState.message.includes("삭제") && state.message === "") {
  //       // 뭐더라
  //     }
  //   });
  // }, [msg]);

  const createMutation = useCreateHandler();

  const CreateRely = () => {
    const user = authService.currentUser as User;
    const userObj = {
      name: user.displayName as string,
      profile: user.photoURL as string,
      uid: user.uid as string,
    };

    createMutation.mutate({ user: userObj, id, comment });
  };

  return (
    <>
      {isReply &&
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
          onChange={(e) => setComment(e.target.value)}
        />
        <button className="btn">댓글 작성</button>
      </form>
    </>
  );
};

export default Reply;
