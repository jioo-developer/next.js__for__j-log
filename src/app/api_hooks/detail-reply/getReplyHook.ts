import { db } from "@/app/Firebase";
import { QueryObserverResult, useQuery } from "@tanstack/react-query";
import { collection, doc, getDocs } from "firebase/firestore";

export type replyType = {
  comment: string;
  uid: string;
  replyrer: string;
  date: string;
  timestamp: { second: number; nanoseconds: number };
  profile: string;
  id: string;
};

const getReplyHandler = async (id: string) => {
  const collectionRef = collection(doc(collection(db, "post"), id), "reply");
  const snapshot = await getDocs(collectionRef);
  console.log(snapshot);
  if (snapshot.docs.length > 0) {
    const docData = snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    return docData;
  } else {
    return null;
  }
};

export const useReplyQueryHook = (pageId: string) => {
  const { data, isLoading, error }: QueryObserverResult<replyType[]> = useQuery(
    {
      queryKey: ["getReply", pageId],
      queryFn: async (queryKey) => {
        const keyParams = queryKey.queryKey[1] as string;
        return await getReplyHandler(keyParams);
      },
      staleTime: 1 * 60 * 1000, // 1분
      notifyOnChangeProps: ["data"],
      enabled: !!pageId,
    }
  );

  return { replyData: data, isLoading, error };
};
