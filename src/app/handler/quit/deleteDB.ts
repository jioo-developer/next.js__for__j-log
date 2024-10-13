import { User } from "firebase/auth";
import { authService, db, storageService } from "@/app/Firebase";
import { deleteObject, ref } from "firebase/storage";
import { deleteDoc, doc, setDoc } from "firebase/firestore";

export async function deleteUserDB() {
  const user = authService.currentUser as User;
  const imageRef = ref(storageService, `${user.uid}`); // Storage 참조 생성

  const deletePromises = [
    setDoc(doc(db, "delete", `${user.uid}`), {
      상태: "탈퇴",
      id: user.uid,
      nickname: user.displayName,
    }), // 상태 문서 설정
    deleteDoc(doc(db, "nickname", `${user.uid}`)), // 닉네임 문서 삭제
    deleteObject(imageRef), // 이미지 삭제
  ];

  Promise.all(deletePromises);
}
