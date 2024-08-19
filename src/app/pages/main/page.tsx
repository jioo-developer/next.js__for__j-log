"use client";
import React from "react";
import userQueryHook from "@/app/api_hooks/login/getUserHook";
import { useRouter } from "next/navigation";
import SkeletonItem from "@/app/components/skeletonItem";
import PostItem from "@/app/components/PostItem";
import usePostQueryHook from "@/app/api_hooks/main/getPosthooks";

const MainPage = () => {
  const router = useRouter();
  const { data, isLoading } = userQueryHook();
  const { postData } = usePostQueryHook();

  setTimeout(() => {
    if (!isLoading) {
      if (!data) {
        router.push("/pages/login");
      }
    }
  }, 100);

  const skeletonRendering = () => {
    return [1, 2, 3].map((item) => {
      return <SkeletonItem key={item} />;
    });
  };

  const Rendering = () => {
    if (data && postData && postData.length > 0) {
      return postData.map((item, index) => {
        return <PostItem item={item} index={index} key={index} />;
      });
    } else {
      skeletonRendering();
    }
  };

  return (
    <div className="post_section">
      {isLoading ? skeletonRendering() : Rendering()}
    </div>
  );
};

export default MainPage;
