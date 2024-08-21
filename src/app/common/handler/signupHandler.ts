import { authService, db } from "@/app/Firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

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
      });
    }
    return user;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export default signupHandler;
