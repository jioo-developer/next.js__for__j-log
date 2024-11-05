"use client";
import "@/app/_asset/header.scss";
import useUserQueryHook from "@/app/api_hooks/login/getUserHook";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import SearchIcon from "@/stories/modules/utils/SearchIcon";
import { searchStore } from "../store/common";
import { useLogOut } from "../handler/commonHandler";

const activePathName = [
  "/pages/member/mypage",
  "/pages/detail",
  "/pages/main",
  "/pages/member/myBoard",
];

function Header() {
  const { data, refetch, isLoading } = useUserQueryHook();
  const [displayName, setName] = useState("");

  const router = useRouter();
  const pathname = usePathname();
  const ref = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!isLoading && data) {
      setName(data.displayName as string);
    }
  }, [data, isLoading]);

  useEffect(() => {
    if (ref.current?.checked) {
      ref.current.checked = false;
    }
  }, [pathname]);

  const LogOutHandler = useLogOut();

  const isActive = activePathName.some((path) =>
    new RegExp(`^${path}`).test(pathname)
  );

  return (
    <>
      {isActive && data && (
        <header>
          <div
            className="title"
            onClick={() => {
              router.push("/pages/main");
              searchStore.setState({ searchText: "" });
            }}
          >
            {displayName}.log
          </div>
          <div className="ui_wrap">
            <button
              className="go__poster"
              onClick={() => router.push("/pages/editor")}
            >
              새&nbsp;글&nbsp;작성
            </button>
            <button onClick={() => router.push("/pages/search")}>
              <SearchIcon />
            </button>
            <label className="menu" htmlFor="menuToggle">
              <input type="checkbox" id="menuToggle" ref={ref} />
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
              <li onClick={() => router.push("/pages/member/myBoard")}>
                내 게시글
              </li>
              <li onClick={() => router.push("/pages/member/mypage")}>설정</li>
              <li onClick={() => LogOutHandler()}>로그아웃</li>
            </ul>
          </div>
        </header>
      )}
    </>
  );
}

export default Header;
