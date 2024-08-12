import { authService, db } from "@/app/Firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const signupHandler = (email, password, nickname) => {
  createUserWithEmailAndPassword(authService, email, password).then(
    async (result) => {
      const user = result.user;
      if (user) {
        await setDoc(doc(db, "nickname", nickname), {
          nickname: nickname,
        });

        await updateProfile(user, {
          displayName: nickname,
          photoURL: "./img/default.svg",
        });
        return user;
      } else {
        return false;
      }
    }
  );
};

export default signupHandler;
