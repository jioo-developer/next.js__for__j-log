import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  User,
} from "firebase/auth";
import { authService } from "../../../Firebase";

async function originDeleteHandler(password: string) {
  const user = authService.currentUser as User;

  const credential = await EmailAuthProvider.credential(
    user.email as string,
    password
  );
  return await reauthenticateWithCredential(user, credential);
}

export default originDeleteHandler;
