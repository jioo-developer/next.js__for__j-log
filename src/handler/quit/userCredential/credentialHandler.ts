import { User } from "firebase/auth";

export default async function isCredential(user: User) {
  if (user.providerData[0].providerId === "password") {
    return "origin";
  } else {
    return "sosial";
  }
}
