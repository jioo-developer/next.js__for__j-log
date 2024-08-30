"use client";

import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { useReplyQueryHook } from "../api_hooks/detail/getReplyHook";
import useUserQueryHook from "../api_hooks/login/getUserHook";
import Image from "next/image";
import { Input } from "@/stories/atoms/Input";
import { Button } from "@/stories/atoms/Button";
import ReactTextareaAutosize from "react-textarea-autosize";
import {
  useCreateHandler,
  useDeleteHandler,
  useUpdateHandler,
} from "../common/handler/detail/reply/useSetReplyHandler";
import { User } from "firebase/auth";

const Reply = ({ pageId }: { pageId: string }) => {
  const [comment, setcomment] = useState("");
  const [commentTarget, setTarget] = useState("");
  const { data } = useUserQueryHook();
  const { replyData, isLoading } = useReplyQueryHook(pageId);

  const id = pageId;

  const textareaForm = useRef<HTMLTextAreaElement | null>(null);

  const createMutation = useCreateHandler();
  const updateMutation = useUpdateHandler();
  const deleteMutation = useDeleteHandler();

  function targetHandler(e: ChangeEvent<HTMLInputElement>, id: string) {
    if (e.target.checked) {
      setTarget(id);
    } else {
      setTarget("");
    }
  }

  function replyCreateHandler(e: FormEvent) {
    e.preventDefault();
    if (textareaForm) {
      createMutation.mutate({
        data: data as User,
        id: id,
        comment: comment,
      });
    }
  }

  function replyUpdateHandler(replyId: string) {
    updateMutation.mutate({ id, replyId, comment });
  }

  function replyDeleteHandler(replyId: string) {
    deleteMutation.mutate({ id, replyId, comment });
  }

  return (
    <>
      {(!isLoading && replyData && replyData.length > 0) ??
        replyData.map((item, index) => {
          return (
            <div className="reply_wrap" key={`reply-${index}`}>
              <div className="user_info">
                <Image src={item.profile} alt="" width={40} height={40} />
                <div className="user_text">
                  <p className="reply_name">{item.replyrer}</p>
                  <p className="reply_date">{item.date}</p>
                </div>
                {data?.uid === item.uid ||
                data?.email === "rlawl3383@gmail.com" ? (
                  <div className="edit_comment">
                    {commentTarget === item.id ? (
                      <input
                        type="checkbox"
                        id={`edit__input-${index}`}
                        className="edit btns"
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                          targetHandler(e, item.id);
                        }}
                      >
                        <label htmlFor={`edit__input-${index}`}> 수정</label>
                      </input>
                    ) : (
                      <Button
                        onClick={() => replyUpdateHandler(item.id as string)}
                      >
                        완료
                      </Button>
                    )}

                    <button
                      className="delete btns"
                      onClick={() => {
                        const id = pageId;
                        const replyId = item.id;
                        replyDeleteHandler(item.id);
                      }}
                    >
                      삭제
                    </button>
                  </div>
                ) : null}
              </div>
              {commentTarget === item.id ? (
                <Input type="text" value={comment} setstate={setcomment} />
              ) : (
                <p className={`reply_text`}>{item.comment}</p>
              )}
            </div>
          );
        })}
      <form
        style={{ order: 0 }}
        onSubmit={(e: FormEvent) => {
          replyCreateHandler(e);
        }}
      >
        <ReactTextareaAutosize
          cacheMeasurements
          onHeightChange={(height) => ""}
          minRows={4}
          ref={textareaForm}
          className="comment_input"
          onChange={(e) => setcomment(e.target.value)}
        />
        <button className="btn">댓글 작성</button>
      </form>
    </>
  );
};

export default Reply;
