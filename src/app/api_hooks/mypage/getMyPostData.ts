import { QueryObserverResult, useQuery } from "@tanstack/react-query";
import { authService, db } from "@/app/Firebase";
import { collection, query, orderBy, getDocs, doc } from "firebase/firestore";
import { FirebaseData } from "../detail/getDetailHook";

async function getMyData() {
  const collectionRef = collection(db, "post");
  const queryData = query(collectionRef, orderBy("timeStamp", "asc"));
  const snapshot = await getDocs(queryData);
  if (snapshot.docs.length > 0) {
    const postArray = await Promise.all(
      snapshot.docs.map(async (doc) => {
        // 각 문서의 'reply' 하위 컬렉션을 가져옴
        const replyCollectionRef = collection(doc.ref, "reply");
        const replySnapshot = await getDocs(replyCollectionRef);

        // 'reply' 컬렉션에 문서가 있는 경우에만 해당 문서에 'reply' 배열을 추가
        const replies = replySnapshot.docs.length;

        return {
          ...doc.data(),
          id: doc.id,
          replies: replies,
        };
      })
    );
    return postArray;
  } else {
    return [];
  }
}

const useMyDataQueryHook = () => {
  const { data, isLoading, error }: QueryObserverResult<FirebaseData[], Error> =
    useQuery({
      queryKey: ["getPost"],
      queryFn: getMyData,
      staleTime: 1 * 60 * 1000, // 1분
      notifyOnChangeProps: ["data"],
    });

  const myData = data ? data : [];
  const user = authService.currentUser?.uid;
  const result = myData.filter((item) => item.id === user);

  return { isLoading, myData: result, error };
};

export default useMyDataQueryHook;
