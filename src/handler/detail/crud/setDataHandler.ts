import { authService } from "../../../../Firebase";
import { User } from "firebase/auth";
import { timeData } from "../../commonHandler";
import { serverTimestamp, Timestamp } from "firebase/firestore";

type initialData = {
  title: string;
  text: string;
  url: string[];
  fileName: string[];
  pageId: string;
};

export const setDataHandler = (data: initialData) => {
  const currentUser = authService.currentUser as User;
  const addContent = {
    user: currentUser.displayName as string,
    profile: currentUser.photoURL as string,
    date: `${timeData.year}년 ${timeData.month}월 ${timeData.day}일`,
    timestamp: serverTimestamp() as Timestamp,
    writer: currentUser.uid,
    favorite: 0,
    id: "",
  };
  const resultObj = Object.assign(data, addContent);
  return resultObj;
};

export default setDataHandler;
