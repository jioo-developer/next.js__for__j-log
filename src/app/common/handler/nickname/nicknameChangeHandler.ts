import nicknameHandler from "./nicknameCheckHandler";
import { deleteDoc, doc, setDoc } from "firebase/firestore";
import { authService, db } from "@/app/Firebase";
import { updateProfile, User } from "firebase/auth";
import { changeHanlderType, userData } from "@/app/common/type/commonType";
import { errorHandler } from "../error/ErrorHandler";

async function NickNameChangeHandler({
  data,
  nicknameData,
  nickname,
}: changeHanlderType) {
  if (nicknameHandler({ nicknameData, nickname })) {
    errorHandler("이미 사용중인 닉네임 입니다.");
  } else {
    const user = data as userData;
    const userNameRef = doc(db, "nickname", user.displayName as string);
    const newTitleDocRef = doc(db, "nickname", nickname);

    await deleteDoc(userNameRef);

    await setDoc(newTitleDocRef, { nickname: nickname });

    await updateProfile(authService.currentUser as User, {
      displayName: nickname,
    });
  }
}

export default NickNameChangeHandler;
