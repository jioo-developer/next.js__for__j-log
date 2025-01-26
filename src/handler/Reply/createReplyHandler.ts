import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { timeData } from "@/app/handler/commonHandler";
import { authService, db } from "../../../Firebase";
import { useReplyProps } from "@/app/handler/Reply/useMutationHandler";
import { User } from "firebase/auth";

interface propsType extends useReplyProps {
  user: {
    name: string;
    profile: string;
    uid: string;
  };
}

export const createReplyHandler = async ({ user, id, comment }: propsType) => {
  const currentUser = authService.currentUser as User;
  const commentData = {
    replyrer: user.name ? user.name : currentUser.displayName,
    comment: comment,
    date: `${timeData.year}년${timeData.month}월${timeData.day}일`,
    profile: user.profile ? user.profile : "/img/default.svg",
    uid: user.uid,
    timeStamp: serverTimestamp(),
  };

  const replyCollectionRef = collection(db, "post", id, "reply");

  await addDoc(replyCollectionRef, commentData);
  return commentData;
};

export default createReplyHandler;
