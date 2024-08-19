import { FirebaseData } from "@/app/api_hooks/detail/getDetailHooks";
import { db } from "@/app/Firebase";
import { doc, updateDoc } from "firebase/firestore";

export type detailPropsType = {
  pageData: FirebaseData;
  id: string;
};

export default async function useFavorite({ pageData, id }: detailPropsType) {
  const postRef = doc(db, "post", id);

  await updateDoc(postRef, {
    favorite: (pageData as FirebaseData).favorite + 1,
  });
}
