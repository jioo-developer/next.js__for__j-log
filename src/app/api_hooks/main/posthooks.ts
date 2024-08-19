import { db } from "@/app/Firebase";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  getDocs,
} from "firebase/firestore";

export async function getPostData() {
  try {
    const collectionRef = collection(db, "post");
    const queryData = query(collectionRef, orderBy("timeStamp", "asc"));
    const snapshot = await getDocs(queryData);

    if (snapshot.docs.length > 0) {
      const postArray = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      return postArray;
    } else {
      return new Error("검색되는 게시글이 없습니다.");
    }
  } catch (error) {
    return new Error("오류 : 게시글이 조회되지 않습니다");
  }
}
