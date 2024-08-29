"use client";
import "@/app/_asset/header.scss";
import { authService } from "../Firebase";
import useUserQueryHook from "@/app/api_hooks/login/getUserHook";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";

const activePathName = ["/pages/member/mypage", "/pages/detail", "/pages/main"];

function Header() {
  const [tabState, setTab] = useState(false);
  const { data, refetch } = useUserQueryHook();
  const [displayName, setName] = useState("");

  const router = useRouter();
  const pathname = usePathname();

  function closeTab(e?: ChangeEvent<HTMLInputElement>) {
    setTab(e ? true : false);
  }

  function logout() {
    authService.signOut().then(() => {
      refetch();
      router.push("/pages/login");
    });
  }

  useEffect(() => {
    closeTab();
  }, [pathname]);

  useEffect(() => {
    setName(data?.displayName as string);
  }, [data]);

  return (
    <>
      {activePathName.includes(pathname) && data && (
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
