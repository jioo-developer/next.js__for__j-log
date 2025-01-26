import { db } from "../../../Firebase";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { useReplyProps } from "@/app/handler/Reply/useMutationHandler";

const ReplyUpdate = async ({
  id,
  replyId,
  comment,
}: useReplyProps): Promise<string | Error> => {
  const collectionRef = collection(db, "post", id, "reply");
  const snapshot = await getDocs(collectionRef);
  if (snapshot && !snapshot.empty) {
    const filterDocs = snapshot.docs.filter((item) => item.id === replyId);
    const docRef = doc(collectionRef, filterDocs[0].id);
    await updateDoc(docRef, { comment: comment });
    return comment;
  } else {
    throw new Error("수정 하시려는 댓글의 데이터가 없습니다.");
  }
};

export default ReplyUpdate;
