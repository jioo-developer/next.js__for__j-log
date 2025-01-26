import { authService, db } from "../../../Firebase";
import { QueryObserverResult, useQuery } from "@tanstack/react-query";
import { User } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";

async function getCashData() {
  const user = authService.currentUser as User;
  const snapshot = await getDocs(collection(db, "cash"));

  if (snapshot.docs.length > 0) {
    const filterDocs = snapshot.docs.filter((item) => item.id === user.uid);
    return filterDocs.map((doc) => ({ ...doc.data() }));
  } else {
    throw new Error("캐시충전을 한 이력이 없습니다.");
  }
}

type CashItem = {
  cash: number;
  item: number;
};

const useCashQueryHook = () => {
  const {
    data,
    error,
    isLoading,
    refetch,
  }: QueryObserverResult<CashItem[], Error> = useQuery({
    queryKey: ["getCash"],
    queryFn: getCashData,
    staleTime: 1 * 60 * 1000, // 1분
    notifyOnChangeProps: ["data"],
    refetchOnMount: "always",
  });

  const CashData = data ? data : [];

  return { CashData, error, isLoading, refetch };
};

export default useCashQueryHook;
