import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { timeData } from "@/app/handler/commonHandler";
import { db } from "@/app/Firebase";
import { useReplyProps } from "@/app/handler/detail-reply/useMutationHandler";

interface propsType extends useReplyProps {
  user: {
    name: string;
    profile: string;
    uid: string;
  };
}

export const createReplyHandler = async ({ user, id, comment }: propsType) => {
  const commentData = {
    replyrer: user.name,
    comment: comment,
    date: `${timeData.year}년${timeData.month}월${timeData.day}일`,
    profile: user.profile,
    uid: user.uid,
    timeStamp: serverTimestamp(),
  };

  const replyCollectionRef = collection(db, "post", id, "reply");

  await addDoc(replyCollectionRef, commentData);
  return commentData;
};

export default createReplyHandler;
