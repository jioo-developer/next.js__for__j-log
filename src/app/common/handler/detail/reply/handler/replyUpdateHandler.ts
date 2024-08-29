import { db } from "@/app/Firebase";
import { doc, setDoc } from "firebase/firestore";
import { useReplyProps } from "../useSetReplyHandler";

const replyUpdateHandler = async ({ id, replyId, comment }: useReplyProps) => {
  const replyDocRef = doc(db, "post", id, "reply", replyId as string);
  await setDoc(replyDocRef, { comment: comment }, { merge: true });
  return comment;
};

export default replyUpdateHandler;
