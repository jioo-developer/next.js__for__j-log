import { db } from "@/app/Firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { useReplyProps } from "../useSetReplyHandler";

async function replyDeleteHandler({ id, replyId, comment }: useReplyProps) {
  const replyDocRef = doc(db, "post", id, "reply", replyId as string);
  await deleteDoc(replyDocRef);
}

export default replyDeleteHandler;
