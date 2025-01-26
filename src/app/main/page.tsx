"use client";
import React, { useEffect, useState } from "react";
import userQueryHook from "@/app/api_hooks/login/getUserHook";
import SkeletonItem from "@/stories/modules/utils/SkeletonItem";
import PostItem from "@/stories/modules/PostItem/PostItem";
import usePostQueryHook from "@/app/api_hooks/main/getPostHook";
import { searchStore } from "@/store/common";
import { FirebaseData } from "@/app/api_hooks/detail/getDetailHook";

const MainPage = () => {
  const [postState, setState] = useState<FirebaseData[]>([]);

  const { data, isLoading } = userQueryHook();
  const { postData } = usePostQueryHook();

  const searchInfo = {
    params: searchStore().searchText,
    isSearch: searchStore().searchText !== "" ? true : false,
  };

  useEffect(() => {
    if (searchInfo.isSearch) {
      const target = searchInfo.params;
      const filterArray = postData.filter(
        (item) => item.title === target || item.text === target
      );
      setState(filterArray);
    }
  }, [searchInfo.isSearch]);

  // 검색 결과만 추출해서 return 하는 함수

  const fallbackHandler = () => {
    return [1, 2, 3].map((item) => {
      return <SkeletonItem key={item} />;
    });
  };
  // skeleton 랜더링 함수

  const showDataHandler = () => {
    if (data) {
      const array = searchInfo.isSearch ? postState : postData;
      return array.map((item, index) => {
        return <PostItem item={item} index={index} key={index} />;
      });
    }
  };
  // 게시글 랜더링 함수

  return (
    <div className="post_section">
      {isLoading ? fallbackHandler() : showDataHandler()}
    </div>
  );
};

export default MainPage;
