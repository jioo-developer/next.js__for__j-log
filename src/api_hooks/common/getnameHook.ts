import { db } from "../../../Firebase";
import { QueryObserverResult, useQuery } from "@tanstack/react-query";
import { collection, getDocs } from "firebase/firestore";

async function getNickName() {
  const snapshot = await getDocs(collection(db, "nickname"));
  if (snapshot.docs.length > 0) {
    return snapshot.docs.map((doc) => ({ ...doc.data() }));
  } else {
    throw new Error("닉네임 DB가 조회되지 않습니다");
  }
}

const useNameQueryHook = () => {
  const {
    data,
    error,
    isLoading,
    refetch,
  }: QueryObserverResult<string[], Error> = useQuery({
    queryKey: ["getNickname"],
    queryFn: getNickName,
    select: (data) => {
      return data.map((item) => item.nickname);
    },
    staleTime: 1 * 60 * 1000, // 1분
    notifyOnChangeProps: ["data"],
  });

  const nicknameData = data ? data : [];

  return { nicknameData, error, isLoading, refetch };
};

export default useNameQueryHook;
