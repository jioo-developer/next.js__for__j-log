import React from "react";
import SkeletonItem from "./SkeletonItem"; // 경로를 실제 PostItem 파일 경로로 수정하세요.

export default {
  title: "Components/SkeletonItem",
  component: SkeletonItem,
  tags: ["autodocs"],
};

export const Skeleton = () => {
  return <SkeletonItem />;
};
