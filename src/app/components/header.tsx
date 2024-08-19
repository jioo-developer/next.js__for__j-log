"use client";
import "@/app/_asset/header.scss";
import { authService } from "../Firebase";
import useUserQueryHook from "@/app/api_hooks/login/getUserHook";
import usePostQueryHook from "@/app/api_hooks/main/getPosthooks";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { globalRefetch } from "../store/common";
import { ChangeEvent, useEffect, useState } from "react";

function Header() {
  const [tabState, setTab] = useState(false);

  const { isLoading, data, refetch } = useUserQueryHook();
  const { postRefetch } = usePostQueryHook();

  const router = useRouter();
  const pathname = usePathname();

  const refetchState = globalRefetch().refetch; //삭제금지

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

  return (
    <header>
      {data ? (
        <>
          <div
            className="title"
            onClick={() => {
              router.push("/pages/main");
              postRefetch();
            }}
          >
            {data.displayName}.log
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
                src={data.photoURL as string}
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
            <li onClick={() => router.push("/pages/member/profile")}>설정</li>
            <li onClick={() => logout()}>로그아웃</li>
          </ul>
        </>
      ) : isLoading ? null : (
        <div className="not-login-logo">J-LOG</div>
      )}
    </header>
  );
}

export default Header;
