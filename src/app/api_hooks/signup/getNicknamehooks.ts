import { db } from "@/app/Firebase";
import { QueryObserverResult, useQuery } from "@tanstack/react-query";
import { collection, getDocs } from "firebase/firestore";

async function getNickName() {
  try {
    const snapshot = await getDocs(collection(db, "nickname"));
    const data = snapshot.docs.map((doc) => ({ ...doc.data() }));

    if (data.length > 0) {
      return data;
    } else {
      throw new Error("사용 가능한 닉네임 입니다.");
    }
  } catch (error) {
    throw new Error("닉네임이 조회 되지 않습니다.");
  }
}

const useNickQueryHook = () => {
  const { data, error }: QueryObserverResult<string[], Error> = useQuery({
    queryKey: ["getNickname"],
    queryFn: getNickName,
  });

  const nicknameData = data;

  return { nicknameData, error };
};

export default useNickQueryHook;
