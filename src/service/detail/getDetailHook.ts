import {
  collection,
  doc,
  getDoc,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../../Firebase";
import { QueryObserverResult, useQuery } from "@tanstack/react-query";

export type FirebaseData = {
  user: string;
  pageId: string;
  profile: string;
  date: string;
  timestamp: Timestamp;
  title: string;
  fileName: string[];
  url: string[];
  favorite: number;
  text: string;
  writer: string;
  id: string;
  priority?: boolean;
  replyLength?: number;
};

async function getDetailHandler(pageId: string) {
  const collectionRef = collection(db, "post");
  // const queryData = query(collectionRef, orderBy("timeStamp", "asc"));
  // const snapshot = await getDocs(queryData);
  const snapshot = await getDocs(collectionRef);
  if (snapshot.docs.length > 0) {
    const filterDocs = snapshot.docs.filter((item) => item.id === pageId);
    const docData = filterDocs.map((doc) => doc.data());
    return docData[0];
  } else {
    return null;
  }
}

const useDetailQueryHook = (pageId: string) => {
  const { data, isLoading, error }: QueryObserverResult<FirebaseData> =
    useQuery({
      queryKey: ["getPage", pageId],
      queryFn: async (queryKey) => {
        const keyParams = queryKey.queryKey[1] as string;
        return await getDetailHandler(keyParams);
      },
      staleTime: 1 * 60 * 1000, // 1분
      notifyOnChangeProps: ["data"],
      refetchOnMount: "always",
      enabled: !!pageId,
    });

  return { pageData: data, isLoading, error };
};
export default useDetailQueryHook;
