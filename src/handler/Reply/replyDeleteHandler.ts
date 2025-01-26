import { db } from "../../../Firebase";
import { deleteDoc, doc } from "firebase/firestore";

async function ReplyDelete({ id, replyId }: { id: string; replyId: string }) {
  const replyDocRef = doc(db, "post", id, "reply", replyId as string);
  await deleteDoc(replyDocRef);
}

export default ReplyDelete;
