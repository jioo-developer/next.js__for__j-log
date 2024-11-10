import { QueryObserverResult, useQuery } from "@tanstack/react-query";
import { authService, db } from "@/app/Firebase";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { FirebaseData } from "../detail/getDetailHook";
import { User } from "firebase/auth";

async function getMyData() {
  const collectionRef = collection(db, "post");
  const queryData = query(collectionRef, orderBy("timestamp", "asc"));
  const snapshot = await getDocs(queryData);
  if (!snapshot.empty) {
    const user = authService.currentUser as User;
    const filter = snapshot.docs.filter((doc) => {
      return doc.data().writer === user.uid;
    });

    if (filter.length > 0) {
      const result = await Promise.all(
        filter.map(async (doc) => {
          const isReply = collection(doc.ref, "reply");
          const snapshot = await getDocs(isReply);
          let replyLength = 0;
          if (!snapshot.empty) {
            replyLength = snapshot.docs.length;
          }
          return {
            ...doc.data(),
            id: doc.id,
            replyLength: replyLength > 0 && replyLength,
          };
        })
      );
      return result;
    }
  } else {
    return [];
  }
}

const useMyDataQueryHook = () => {
  const { data, isLoading, error }: QueryObserverResult<FirebaseData[], Error> =
    useQuery({
      queryKey: ["getMyData"],
      queryFn: getMyData,
      staleTime: 1 * 60 * 1000, // 1분
      notifyOnChangeProps: ["data"],
      refetchOnMount: "always",
      retry: 3,
    });

  const myData = data ? data : [];

  return { myData, isLoading, error };
};

export default useMyDataQueryHook;
