import { authService, db, storageService } from "@/app/Firebase";
import { deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { User } from "firebase/auth";
import { popuprHandler } from "../error/ErrorHandler";

export async function LoginTypeCheck(data: User) {
  const user = data;
  const docRef = doc(db, "nickname", user.uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    if (docSnap.data().service !== "password") {
      return "sosial";
    } else {
      return "origin";
    }
  } else {
    popuprHandler({ message: "회원가입 도중 에러가 발생하였습니다" });
    throw new Error("회원가입 도중 에러가 발생하였습니다");
  }
}

export async function deleteUserDB(isSosial?: boolean) {
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

  if (isSosial) {
    deletePromises.push(
      // 소셜 계정과 관련된 추가 문서 삭제
      deleteDoc(doc(db, "nickname", `${user.uid}-G`))
    );
  }

  Promise.all(deletePromises).then(() => {
    authService.signOut().then(() => {
      window.location.reload();
    });
  });
}
