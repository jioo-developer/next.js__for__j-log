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
      throw new Error("해당 페이지 정보를 찾을 수 없습니다.");
    }
  } catch (error) {
    throw new Error("페이지 정보를 불러오는 중 오류가 발생했습니다.");
  }
}
