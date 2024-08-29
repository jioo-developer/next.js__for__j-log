import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { timeData } from "../../../commonHandler";
import { db } from "@/app/Firebase";
import { useReplyProps } from "../useSetReplyHandler";
import { User } from "firebase/auth";

interface propsType extends useReplyProps {
  data: User;
}

const createReplyHandler = async ({ data, id, comment }: propsType) => {
  const commentData = {
    replyrer: data.displayName,
    comment: comment,
    date: `${timeData.year}년${timeData.month}월${timeData.day}일`,
    profile: data.photoURL,
    uid: data.uid,
    timeStamp: serverTimestamp(),
  };

  const replyCollectionRef = collection(db, "post", id, "reply");

  await addDoc(replyCollectionRef, commentData);
  return commentData;
};

export default createReplyHandler;
