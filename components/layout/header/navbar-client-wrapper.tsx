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
import { usePathname } from "next/navigation";

export default function HeaderClient({ menu }: { menu: Menu[] }) {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  //  Logic scroll + kiểm tra trang matcha
  useEffect(() => {
    const handleScroll = () => {
      // Nếu đang ở /collections/matcha → chỉ đổi khi scroll > 50
      if (pathname === "/collections/matcha") {
        setScrolled(window.scrollY > 50);
      }
      // Nếu ở các trang collections khác → luôn trắng
      else if (pathname.startsWith("/collections")) {
        setScrolled(true);
      }
      // Các trang còn lại → bình thường (đen → trắng)
      else {
        setScrolled(window.scrollY > 50);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  //  Xác định trạng thái để đổi className
  const isMatchaPage = pathname === "/collections/matcha";
  // const isMatchaPage =
  //   pathname === "/collections/matcha" || pathname.startsWith("/product/");

  return (
    <nav
      className={clsx(
        isMatchaPage && !scrolled
          ? "absolute top-0 left-0 w-full z-999"
          : "sticky top-0 z-999",
        "flex items-center justify-between p-4 lg:px-10 backdrop-blur-sm transition-all duration-500",
        scrolled
          ? "bg-white text-black"
          : isMatchaPage
            ? "bg-transparent! backdrop-blur-none! text-white shadow-none"
            : "bg-black text-white"
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
        <LogoSquare scrolled={scrolled} />
      </Link>

      {/* Main items */}
      <div className="flex w-full items-center justify-center mx-auto">
        <div className="flex w-full md:w-1/3">
          {menu.length > 0 ? (
            <ul className="text-collections hidden gap-6 text-xs md:flex md:items-center uppercase">
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
            <LogoSquare scrolled={scrolled} />
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
