import { QueryObserverResult, useQuery } from "@tanstack/react-query";
import { db } from "../../../Firebase";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { FirebaseData } from "../detail/getDetailHook";
import { popuprHandler } from "@/app/handler/error/ErrorHandler";

async function getPostData() {
  const collectionRef = collection(db, "post");
  const queryData = query(collectionRef, orderBy("timestamp", "asc"));
  const snapshot = await getDocs(queryData);
  if (!snapshot.empty) {
    const postArray = snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    return postArray;
  } else {
    popuprHandler({ message: "조회되는 게시글이 없습니다." });
    return [];
  }
}

const usePostQueryHook = () => {
  const { data, isLoading, error }: QueryObserverResult<FirebaseData[], Error> =
    useQuery({
      queryKey: ["getPost"],
      queryFn: getPostData,
      staleTime: 1 * 60 * 1000, // 1분
      notifyOnChangeProps: ["data"],
      refetchOnMount: "always",
    });

  let postData = data ? data : [];

  if (postData.length > 0) {
    const filterPriority = postData.filter((item) => item.priority);
    const nonePriority = postData.filter((item) => !item.priority);
    const result = [...filterPriority, ...nonePriority];
    postData = result;
  } else {
    postData = [];
  }
  return { postData, isLoading, error };
};

export default usePostQueryHook;
