import { db } from "@/app/Firebase";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { useReplyProps } from "@/app/handler/Reply/useMutationHandler";

const ReplyUpdate = async ({ id, replyId, comment }: useReplyProps) => {
  const collectionRef = collection(doc(collection(db, "post"), id), "reply");
  const snapshot = await getDocs(collectionRef);
  if (snapshot && !snapshot.empty) {
    const filterDocs = snapshot.docs.filter((item) => item.id === replyId);
    const docRef = doc(collectionRef, filterDocs[0].id);
    await updateDoc(docRef, { comment: comment });
    return comment;
  }
};

export default ReplyUpdate;
