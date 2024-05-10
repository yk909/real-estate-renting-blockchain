"use client";

import React, { Suspense } from "react";
import Logo from "./logo";
import Search from "./Search";
import Categories from "./Categories";
import UserMenu from "./UserMenu";
import { getCurrentUser } from "@/services/user";
// import { headers } from "next/headers";
import { useGlobalState } from "@/store";

interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = () => {
  const [connectedAccount] = useGlobalState("connectedAccount");
  // const user = await getCurrentUser();
  // const heads = headers();

  // const pathname = heads.get("next-url");
  // console.log(pathname, "---------");

  return (
    <header className="top-0 left-0 w-full bg-white z-10 bg-gradient-to-r from-indigo-500 via-transparent to-pink-200 ">
      <nav className="py-3 border-b-[0px]">
        <div className="flex main-container flex-row justify-between items-center gap-3 md:gap-0 ">
          <Logo />
          <Suspense fallback={<></>}>
            <Search />
          </Suspense>
          <UserMenu user={connectedAccount} />
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
