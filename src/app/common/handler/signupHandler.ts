import { authService, db } from "@/app/Firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { errorHandler } from "./error/ErrorHandler";

const signupHandler = async (
  email: string,
  password: string,
  nickname: string
) => {
  try {
    const createUser = await createUserWithEmailAndPassword(
      authService,
      email,
      password
    );
    const user = createUser.user;

    if (user) {
      // Firestore에 닉네임 저장
      await setDoc(doc(db, "nickname", nickname), {
        nickname: nickname,
      });

      // 사용자 프로필 업데이트
      await updateProfile(user, {
        displayName: nickname,
        photoURL: "/img/default.svg",
      });
    }
    return user;
  } catch {
    errorHandler("회원가입 도중 에러가 발생하였습니다.");
  }
};

export default signupHandler;
