import { authService } from "../../../Firebase";
import {
  GoogleAuthProvider,
  reauthenticateWithPopup,
  User,
} from "firebase/auth";

async function SocialDeleteHandler() {
  const user = authService.currentUser as User; // 현재 로그인한 사용자 가져오기
  const googleProvider = new GoogleAuthProvider(); // Google 인증 제공자 생성

  return await reauthenticateWithPopup(user, googleProvider);
}

export default SocialDeleteHandler;
