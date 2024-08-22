import { authService, db } from "@/app/Firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

type propsType = {
  email: string;
  password: string;
  nickname: string;
};

const signupHandler = async ({ email, password, nickname }: propsType) => {
  // 회원생성로직
  const createUser = await createUserWithEmailAndPassword(
    authService,
    email,
    password
  );
  // 회원생성로직

  const user = createUser.user;

  if (user) {
    // Firestore에 닉네임 저장
    await setDoc(doc(db, "nickname", user.uid), {
      id: user.uid,
      nickname: nickname,
    });

    // 사용자 프로필 업데이트
    await updateProfile(user, {
      displayName: nickname,
    });
  }
};

export default signupHandler;
