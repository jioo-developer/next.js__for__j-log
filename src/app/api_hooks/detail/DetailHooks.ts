import { doc, DocumentData, getDoc } from "firebase/firestore";
import { db } from "@/app/Firebase";
import { FirebaseData } from "./getDetailHooks";

export async function getDetailHandler(pageId: string) {
  try {
    const docRef = doc(db, "post", pageId);
    const snapshot = await getDoc(docRef);

    if (snapshot.exists()) {
      return snapshot.data() as FirebaseData;
    } else {
      return new Error("페이지 정보를 불러 올 수 없습니다.");
    }
  } catch (error) {
    return new Error("페이지 정보를 불러 올 수 없습니다.");
  }
}
