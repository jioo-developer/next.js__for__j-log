import { authService, db } from "@/app/Firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { objType } from "./sosialLogin";

export async function onGoogle() {
  const provider = new GoogleAuthProvider();
  const result = (await signInWithPopup(authService, provider)).user;
  const { userId, userName, service } = {
    userId: result.uid,
    userName: result.displayName as string,
    service: result.providerData[0].providerId,
  };
  return { userId, userName, service };
}

export async function isSecondpw(id: string) {
  const docRef = await doc(db, "nickname", id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists() && docSnap.data().service) {
    return true;
  } else {
    return false;
  }
}

export async function secondPassword(params: objType) {
  await setDoc(doc(db, "nickname", params.id), {
    id: params.id,
    password: params.pw,
    nickname: params.name,
    service: params.service,
    // 닉네임을 넣는 이유는 해당 uid가 어떤 유저의 것인지 알기 위함
    // 만약 nickname이 null 일 때 uid를 대신 넣어주기
  });
}
