import { QueryObserverResult, useQuery } from "@tanstack/react-query";
import { db } from "@/app/Firebase";
import { collection, query, orderBy, getDocs } from "firebase/firestore";

export type postProps = {
  user: string;
  pageId: string;
  profile: string;
  date: string;
  timestamp: { second: number; nanoseconds: number };
  title: string;
  fileName: string | string[];
  url: string[];
  favorite: number;
  text: string;
  writer: string;
  id: string;
};

async function getPostData() {
  const collectionRef = collection(db, "post");
  const queryData = query(collectionRef, orderBy("timeStamp", "asc"));
  const snapshot = await getDocs(queryData);

  if (snapshot.docs.length > 0) {
    const postArray = snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    return postArray;
  } else {
    return [];
  }
}

const usePostQueryHook = () => {
  const { data, isLoading, error }: QueryObserverResult<postProps[], Error> =
    useQuery({
      queryKey: ["getPost"],
      queryFn: getPostData,
      staleTime: 1 * 60 * 1000, // 1분
      notifyOnChangeProps: ["data"],
    });
  const postData = data ? data : [];

  return { isLoading, postData, error };
};

export default usePostQueryHook;
