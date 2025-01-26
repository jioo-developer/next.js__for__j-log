import type { Metadata } from "next";
import "./globals.css";
import "@/app/_asset/theme.scss";
import "@/app/_asset/home.scss";
import "@/app/_asset/common.scss";
import { childrenProps } from "@/type/commonType";
import ReactQueryProvider from "../provider/ReactQueryProvider";
import Header from "../components/atoms/Header";
import { ReturnPopup } from "@/app/handler/error/ErrorHandler";
import MiddleWareProvider from "../provider/middlewareProvider";

export const metadata: Metadata = {
  title: "J-LOG",
  description: "벨로그 클론코딩 프로젝트",
  keywords: ["벨로그", "클론코딩", "커뮤니티"], // SEO 키워드 목록
  creator: "JIOO",
  icons: {
    icon: "/img/default.svg", // 기본 아이콘 경로
  },
};

export default function RootLayout({ children }: childrenProps) {
  return (
    <html lang="ko">
      <body>
        <ReactQueryProvider>
          <MiddleWareProvider>
            <div className="wrap">
              <div className="in_wrap">
                <Header />
                {children}
                <ReturnPopup />
              </div>
            </div>
          </MiddleWareProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
