"use client";
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
    <div className="is__white_bg input_wrap">
      <Input
        type="text"
        setstate={setSearch}
        enter={{ isEnter: true, func: goSearch }}
        placeholder="검색어를 입력하세요"
        width={768}
        height={70}
        fontSize={24}
      />
    </div>
  );
};

export default SearchPage;
