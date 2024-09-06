import { db } from "@/app/Firebase";
import { User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { popupMessageStore } from "@/app/store/common";
import { quitError } from "../deleteDB";

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
    return quitError();
  }
}

export async function isCredential(user: User) {
  try {
    const accountType = await isLoginType(user);
    popupMessageStore.setState({ isClick: false });
    return accountType;
  } catch {
    return quitError();
  }
}
