import { db } from "@/app/Firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { useReplyProps } from "@/app/handler/Reply/useMutationHandler";

async function ReplyDelete({ id, replyId }: useReplyProps) {
  const replyDocRef = doc(db, "post", id, "reply", replyId as string);
  await deleteDoc(replyDocRef);
}

export default ReplyDelete;
