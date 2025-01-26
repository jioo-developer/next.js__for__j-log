import { User } from "firebase/auth";
import { db, storageService } from "../../../Firebase";
import { deleteObject, listAll, ref } from "firebase/storage";
import { deleteDoc, doc, getDoc } from "firebase/firestore";

export default async function deleteUserDB(user: User) {
  const imageRef = ref(storageService, `${user.uid}`); // Storage 참조 생성
  // 파일이 존재하는지 확인
  const result = await listAll(imageRef);

  // 파일이 존재할 경우에만 삭제 작업 수행
  if (result.items.length > 0 || result.prefixes.length > 0) {
    const deleteData = result.items.map((item) => deleteObject(item));
    await Promise.all(deleteData);
  }
  const docRef = doc(db, "nickname", `${user.uid}`);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    await deleteDoc(docRef);
  }
}
