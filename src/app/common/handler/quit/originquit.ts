import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  User,
} from "firebase/auth";
import { userProps } from "../../type/commonType";
import { authService } from "@/app/Firebase";

async function originDeleteHandler({ data, password }: userProps) {
  const user = authService.currentUser as User;
  const credential = EmailAuthProvider.credential(
    data.email as string,
    password
  );
  return await reauthenticateWithCredential(user, credential);
}

export default originDeleteHandler;
