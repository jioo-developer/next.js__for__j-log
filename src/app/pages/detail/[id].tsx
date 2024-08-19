import "@/app/_asset/detail.scss";
import useDetailQueryHook from "@/app/api_hooks/detail/getDetailHooks";
import useUserQueryHook from "@/app/api_hooks/login/getUserHook";
import { useSearchParams } from "next/navigation";

const DetailPage = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") as string;

  const { data } = useUserQueryHook();
  const { postData, isLoading, postRefetch } = useDetailQueryHook(id);
};

export default DetailPage;
