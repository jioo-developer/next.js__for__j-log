import { db } from "@/app/Firebase";
import { User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { popupMessageStore } from "@/app/store/common";
import { popuprHandler } from "../../error/ErrorHandler";

async function isLoginType(user: User) {
  const docRef = doc(db, "nickname", user.uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    if (docSnap.data().service !== "password") {
      return "sosial";
    } else {
      return "origin";
    }
  } else {
    popuprHandler({ message: "회원탈퇴 도중 에러가 발생하였습니다" });
    return null;
  }
}

export async function isCredential(user: User) {
  try {
    const accountType = await isLoginType(user);
    popupMessageStore.setState({ isClick: false });
    return accountType;
  } catch {
    popuprHandler({ message: "회원탈퇴 도중 에러가 발생하였습니다" });
    return null;
  }
}
