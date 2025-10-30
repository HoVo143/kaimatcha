"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { Menu } from "../../../lib/shopify/types";
import MobileMenu from "./mobile-menu";
import LogoSquare from "./logo-square";
import Search from "./search";
import NavbarClient from "./account-client";
import CartModal from "../../cart/modal";
import NavActiveLink from "../../ui/nav-active-link";

export default function HeaderClient({ menu }: { menu: Menu[] }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={clsx(
        "sticky top-0 z-999 flex items-center justify-between p-4 lg:px-6 backdrop-blur-sm transition-all duration-500",
        scrolled ? "bg-white text-black shadow-md" : "bg-black text-white"
      )}
    >
      {/* Mobile menu */}
      <div className="block flex-none md:hidden">
        <MobileMenu menu={menu} />
      </div>

      {/* Logo mobile */}
      <Link
        href="/"
        prefetch={true}
        className="md:hidden absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0 flex items-center justify-center"
      >
        <LogoSquare />
      </Link>

      {/* Main items */}
      <div className="flex w-full items-center justify-center mx-auto">
        <div className="flex w-full md:w-1/3">
          {menu.length > 0 ? (
            <ul className="hidden gap-6 text-sm md:flex md:items-center">
              {menu.map((item) => (
                <li key={item.title}>
                  <NavActiveLink
                    title={item.title}
                    href={`/${item.path}`}
                    scrolled={scrolled} // có ảnh hưởng màu khi scroll
                    variant="header"
                  />
                </li>
              ))}
              {/* {menu.map((item: Menu) => (
                <li key={item.title}>
                  <Link
                    href={`/${item.path}`}
                    prefetch={true}
                    className={clsx(
                      "uppercase underline-offset-4 hover:text-emerald-600 hover:underline transition-colors duration-300",
                      scrolled ? "text-black" : "text-white"
                    )}
                  >
                    {item.title}
                  </Link>
                </li>
              ))} */}
            </ul>
          ) : null}
        </div>

        <div className="hidden md:flex justify-center md:w-1/3">
          <Link
            href={"/"}
            prefetch={true}
            className="flex w-full items-center justify-center md:w-auto"
          >
            <LogoSquare />
          </Link>
        </div>

        <div className="justify-end items-center flex md:w-1/3 md:gap-5">
          {/* Search */}
          <div className="hidden md:flex">
            <Search />
          </div>

          {/* Account */}
          <NavbarClient />

          {/* cart */}
          <CartModal />
        </div>
      </div>
    </nav>
  );
}
