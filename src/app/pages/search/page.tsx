import { searchStore } from "@/app/store/common";
import { Input } from "@/stories/atoms/Input";
import { useRouter } from "next/navigation";
import { useState } from "react";

const SearchPage = () => {
  const [search, setSearch] = useState("");

  const router = useRouter();

  function goSearch() {
    router.push("/pages/main");
    searchStore.setState({ searchText: search });
  }

  return (
    <Input
      type="text"
      setstate={setSearch}
      enter={{ isEnter: true, func: goSearch }}
    />
  );
};

export default SearchPage;
