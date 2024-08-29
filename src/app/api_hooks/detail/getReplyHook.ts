import { popuprHandler } from "@/app/common/handler/error/ErrorHandler";
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

export const getReplyHandler = async (id: string) => {
  const collectionRef = collection(doc(collection(db, "post"), id), "reply");
  const snapshot = await getDocs(collectionRef);

  if (snapshot.docs.length > 0) {
    const replyData = snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    return replyData;
  } else {
    throw new Error("페이지의 댓글을 불러오는 중 오류가 발생했습니다.");
  }
};

export const useReplyQueryHook = (pageId: string) => {
  const { data, isLoading, error }: QueryObserverResult<replyType[], Error> =
    useQuery({
      queryKey: ["getReply", pageId],
      queryFn: async (queryKey) => {
        const keyParams = queryKey.queryKey[1] as string;
        return await getReplyHandler(keyParams);
      },
      staleTime: 1 * 60 * 1000, // 1분
      notifyOnChangeProps: ["data"],

      enabled: !!pageId,
      initialData: [],
    });
  const replyData = data;

  if (error) {
    popuprHandler({ message: error.message });
    window.location.href = "/";
  }
  return { replyData, isLoading, error };
};
