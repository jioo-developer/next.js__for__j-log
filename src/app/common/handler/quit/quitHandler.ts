import { authService, db, storageService } from "@/app/Firebase";
import { deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { userProps } from "../../type/commonType";
import { User } from "firebase/auth";

export async function LoginTypeCheck({ data, password }: userProps) {
  const docRef = doc(db, "nickname", `${data.uid}-G`);
  const docSnap = await getDoc(docRef);
  const socialPW = docSnap.data();

  if (socialPW) {
    // socialPw 이 있으면
    if (password === socialPW.password) {
      return "social";
    } else {
      return "origin";
    }
  } else {
    return false;
  }
}

export async function deleteUserDB(type?: string) {
  const user = authService.currentUser as User;
  const imageRef = ref(storageService, `${user.uid}`); // Storage 참조 생성

  const deletePromises = [
    setDoc(doc(db, "delete", `${user.uid}`), {
      상태: "탈퇴",
      nickname: user.displayName,
    }), // 상태 문서 설정
    deleteDoc(doc(db, "nickname", `${user.displayName}`)), // 닉네임 문서 삭제
    deleteObject(imageRef), // 이미지 삭제
  ];

  if (type === "social") {
    deletePromises.push(
      // 소셜 계정과 관련된 추가 문서 삭제
      deleteDoc(doc(db, "nickname", `${user.uid}-G`))
    );
  }

  Promise.all(deletePromises);
}
