import { Button } from "@/stories/atoms/Button";
import ButtonGroup from "@/stories/modules/ButtonGroup/ButtonGroup";
import Image from "next/image";
import { Input } from "@/stories/atoms/Input";
import { replyType } from "@/app/api_hooks/detail-reply/getReplyHook";
import { useReplyContext } from "./context";
import { useEffect } from "react";
import { popupInit, popuprHandler } from "@/app/handler/error/ErrorHandler";
import {
  useDeleteHandler,
  useUpdateHandler,
} from "@/app/handler/detail-reply/useSetReplyHandler";

type propsType = {
  item: replyType;
  index: number;
  replyData: replyType[];
  pageId: string;
};

const ReplyItem = ({ item, index, replyData, pageId }: propsType) => {
  const {
    comment,
    setComment,
    msg,
    commentTarget,
    setTarget,
    isClickValue,
    ChangeTargetHandler,
  } = useReplyContext();

  const updateMutation = useUpdateHandler();

  function replyUpdateHandler(replyId: string) {
    updateMutation.mutateAsync({ id: pageId, replyId, comment });
    setComment("");
    setTarget("");
  }

  const deleteMutation = useDeleteHandler();

  function AskDeleteHandler(index: number, isClick?: boolean) {
    if (!isClick) {
      popuprHandler({
        message: "댓글을 정말로 삭제하시겠습니까?",
        type: "confirm",
      });
      setTarget(index);
    }

    if (isClick) {
      const replyId = (replyData as replyType[])[index].id;
      deleteMutation.mutate({ id: pageId, replyId, comment });
    }
  }

  useEffect(() => {
    if (isClickValue) {
      AskDeleteHandler(commentTarget as number, true);
      popupInit();
    }
  }, [isClickValue]);

  const isDelete = msg.includes("삭제");

  return (
    <div className="reply_wrap" key={`reply-${index}`}>
      <div className="user_info">
        <Image src={item.profile} alt="" width={40} height={40} />
        <div className="user_text">
          <p className="reply_name">{item.replyrer}</p>
          <p className="reply_date">{item.date}</p>
        </div>
        <div className="edit_comment">
          <ButtonGroup>
            {isDelete || commentTarget !== index ? (
              <Button
                width={50}
                className="edit btns"
                onClick={() => {
                  const currentText = (replyData as replyType[])[index].comment;
                  ChangeTargetHandler(currentText, index);
                }}
              >
                수정
              </Button>
            ) : (
              <Button
                width={50}
                onClick={() => {
                  const replyId = replyData[index].id;
                  replyUpdateHandler(replyId);
                }}
              >
                완료
              </Button>
            )}

            <Button
              width={50}
              className="delete btns"
              onClick={() => AskDeleteHandler(index)}
            >
              삭제
            </Button>
          </ButtonGroup>
        </div>
      </div>
      {isDelete || commentTarget !== index ? (
        <p className={`reply_text`}>{item.comment}</p>
      ) : (
        <Input type="text" value={comment} setstate={setComment} />
      )}
    </div>
  );
};

export default ReplyItem;