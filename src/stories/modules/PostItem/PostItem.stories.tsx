import React from "react";
import "@/app/globals.css";
import "@/app/_asset/home.scss";
import PostItem from "./PostItem"; // 경로를 실제 PostItem 파일 경로로 수정하세요.
import { FirebaseData } from "@/app/api_hooks/detail/getDetailHook"; // FirebaseData 타입을 가져옵니다.
import {
  AppRouterContext,
  AppRouterInstance,
} from "next/dist/shared/lib/app-router-context.shared-runtime";

export default {
  title: "Components/PostItem",
  component: PostItem,
  tags: ["autodocs"],
};

const mockData: FirebaseData = {
  pageId: "1",
  title: "포스트 제목",
  text: "이것은 포스트의 내용을 보여주는 예시 텍스트입니다.",
  date: "2024-11-02",
  url: ["/img/no-image.jpg"], // 예시 이미지 URL
  profile: "/img/default.svg", // 예시 프로필 이미지 URL
  user: "user123",
  favorite: 42,
} as unknown as FirebaseData;

export const Default = () => {
  return (
    <AppRouterContext.Provider value={{} as AppRouterInstance}>
      <div className="in_wrap">
        <div className="post_section">
          <PostItem item={mockData} index={0} />
        </div>
      </div>
    </AppRouterContext.Provider>
  );
};
