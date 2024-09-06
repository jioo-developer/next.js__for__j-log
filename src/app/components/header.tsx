"use client";
import "@/app/_asset/header.scss";
import { authService } from "../Firebase";
import useUserQueryHook from "@/app/api_hooks/login/getUserHook";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { User } from "next-auth";
import { popuprHandler } from "../handler/error/ErrorHandler";

const activePathName = ["/pages/member/mypage", "/pages/detail", "/pages/main"];

function Header() {
  const [tabState, setTab] = useState(false);
  const { data, refetch } = useUserQueryHook();
  const [displayName, setName] = useState("");

  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  function closeTab(e?: ChangeEvent<HTMLInputElement>) {
    setTab(e ? true : false);
  }

  function logout() {
    try {
      authService.signOut();
      queryClient.clear();
      router.push("/pages/login");
    } catch {
      popuprHandler({ message: "로그아웃에 실패하였습니다" });
    }
  }

  useEffect(() => {
    closeTab();
  }, [pathname]);

  useEffect(() => {
    setName(data?.displayName as string);
  }, [data]);

  const isActive = activePathName.some((path) => pathname.startsWith(path));

  return (
    <>
      {isActive && data && (
        <header>
          <div className="title" onClick={() => router.push("/pages/main")}>
            {displayName}.log
          </div>
          <label className="menu" htmlFor="menuToggle">
            <input
              type="checkbox"
              id="menuToggle"
              checked={tabState}
              onChange={(e: ChangeEvent<HTMLInputElement>) => closeTab(e)}
            />
            <figure>
              <Image
                width={40}
                height={40}
                src={data.photoURL ? data.photoURL : "/img/default.svg"}
                alt="프로필 이미지"
                className="profile"
                referrerPolicy="no-referrer"
              />
            </figure>
            <Image
              width={10}
              height={10}
              src="/img/arrow.svg"
              alt="arrow"
              className="arrow"
            />
          </label>
          <ul className="sub_menu">
            <li onClick={() => router.push("/pages/member/mypage")}>설정</li>
            <li onClick={() => logout()}>로그아웃</li>
          </ul>
        </header>
      )}
    </>
  );
}

export default Header;
