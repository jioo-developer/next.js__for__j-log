"use client";
import React from "react";
import "@/app/_asset/css/404.css";
import { Button } from "@/stories/atoms/Button";
import { useRouter } from "next/navigation";

const ErrorPage = () => {
  const router = useRouter();
  return (
    <div id="notfound">
      <div className="notfound">
        <h1>페이지를 찾을 수 없습니다.</h1>
        <Button
          width={111}
          height={50}
          theme="success"
          onClick={() => router.push("/pages/main")}
        >
          돌아가기
        </Button>
      </div>
    </div>
  );
};

export default ErrorPage;
