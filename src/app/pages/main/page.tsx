"use client";
import React, { useEffect, useState } from "react";
import userQueryHook from "@/app/api_hooks/login/getUserHook";
import { useParams, useRouter } from "next/navigation";
import SkeletonItem from "@/app/components/SkeletonItem";
import PostItem from "@/app/components/PostItem";
import usePostQueryHook from "@/app/api_hooks/main/getPostHook";
import { searchStore } from "@/app/store/common";
import { FirebaseData } from "@/app/api_hooks/detail/getDetailHook";
import { popupInit, popuprHandler } from "@/app/handler/error/ErrorHandler";

const MainPage = () => {
  const [postState, setState] = useState<FirebaseData[]>([]);

  const router = useRouter();

  const { data, isLoading } = userQueryHook();
  const { postData } = usePostQueryHook();

  useEffect(() => {
    setTimeout(() => {
      if (!isLoading) {
        popupInit();
        if (!data) {
          router.push("/pages/login");
        }
      } else {
        popuprHandler({ message: "회원정보를 불러오고 있습니다" });
      }
    }, 100);
  }, [isLoading]);

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

  const fallbackHandler = () => {
    return [1, 2, 3].map((item) => {
      return <SkeletonItem key={item} />;
    });
  };

  const showDataHandler = () => {
    const array = searchInfo.isSearch ? postState : postData;
    return array.map((item, index) => {
      return <PostItem item={item} index={index} key={index} />;
    });
  };

  return (
    <div className="post_section">
      {isLoading ? fallbackHandler() : showDataHandler()}
    </div>
  );
};

export default MainPage;
