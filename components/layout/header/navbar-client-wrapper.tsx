/* eslint-disable prettier/prettier */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState, useRef } from "react";
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

interface HeaderClientProps {
  menu: Menu[];
  teawareSubmenu: Menu[];
  teawareSubmenuMedium: Menu[];
}

export default function HeaderClient({
  menu,
  teawareSubmenu,
  teawareSubmenuMedium,
}: HeaderClientProps) {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const [menuHover, setMenuHover] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  //  Logic scroll + kiểm tra trang matcha
  useEffect(() => {
    const handleScroll = () => {
      // Nếu đang ở /collections/matcha → chỉ đổi khi scroll > 50
      if (pathname === "/collections/matcha") {
        setScrolled(window.scrollY > 50);
      }
      // Nếu ở các trang collections khác → luôn trắng
      else if (
        pathname.startsWith("/collections") ||
        pathname.startsWith("/product")
      ) {
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

  // Set animation delay for desktop menu items dynamically
  useEffect(() => {
    if (menuHover === "Teaware" && dropdownRef.current) {
      const menuItems =
        dropdownRef.current.querySelectorAll(".desktop-menu-item");
      menuItems.forEach((el) => {
        const htmlEl = el as HTMLElement;
        const delay = htmlEl.dataset.delay || "0";
        htmlEl.style.setProperty(
          "--item-delay",
          `${parseFloat(delay) * 0.05}s`
        );
      });
    }
  }, [menuHover]);

  //  Xác định trạng thái để đổi className

  const isMatchaPage =
    pathname === "/collections/matcha" ||
    pathname === "/" ||
    pathname === "/exhibition";
  // const isMatchaPage =
  //   pathname === "/collections/matcha" || pathname.startsWith("/product/");

  const navStyle = {
    backgroundColor:
      scrolled || menuHover
        ? "white" // nền trắng mờ khi scroll
        : isMatchaPage
          ? "transparent" // Matcha chưa scroll → trong suốt
          : "rgba(0, 0, 0, 0.9)", // Trang khác → đen mờ
    color: scrolled || menuHover ? "black" : isMatchaPage ? "white" : "white",
    // boxShadow: scrolled ? "0 2px 10px rgba(0,0,0,0.08)" : "none",
    transition:
      "background-color 0.6s ease, color 0.6s ease, box-shadow 0.6s ease, backdrop-filter 0.6s ease",
  };

  return (
    <>
      <div
        className={clsx(
          "font-family-text-canela w-full text-center text-[10px] md:text-[13px] py-2 transition-all duration-300 uppercase tracking-wider",
          scrolled ? "bg-neutral-200 text-neutral-500" : "bg-black text-white"
        )}
      >
        Free US shipping over $50
      </div>
      <nav
        // className={clsx(
        //   isMatchaPage
        //     ? "fixed top-0 left-0 w-full z-999" // Matcha: overlay cố định trên
        //     : "sticky top-0 z-999", // Các trang khác: giữ layout chuẩn
        //   // Layout & animation
        //   "flex items-center justify-between p-4 lg:px-10 transition-all duration-500 ease-in-out",
        //   // Màu chữ
        //   isMatchaPage ? "text-white" : "text-white",
        //   // Hiệu ứng blur
        //   scrolled || !isMatchaPage ? "backdrop-blur-sm" : "backdrop-blur-none!"
        // )}
        className={clsx(
          isMatchaPage
            ? "fixed top-0 left-0 w-full z-999"
            : "sticky top-0 z-999",
          isMatchaPage && !scrolled ? "mt-8 md:mt-9" : "mt-0",
          // chỉ áp dụng flex layout ở mobile, bỏ ở desktop
          "flex items-center justify-between lg:block",
          "p-4 lg:px-10 transition-all duration-500 ease-in-out",
          isMatchaPage ? "text-white" : "text-white",
          scrolled || !isMatchaPage ? "backdrop-blur-sm" : "backdrop-blur-none!"
        )}
        style={navStyle}
        onMouseLeave={() => setMenuHover(null)}
      >
        {/* Mobile menu */}
        <div className="block flex-none md:hidden">
          <MobileMenu
            menu={menu}
            teawareSubmenu={teawareSubmenu}
            teawareSubmenuMedium={teawareSubmenuMedium}
          />
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
              <ul className="font-family-text-canela hidden gap-6 text-xs md:flex md:items-center uppercase">
                {menu.map((item) => (
                  <li
                    key={item.title}
                    onMouseEnter={() => setMenuHover(item.title)}
                    className="relative"
                  >
                    <NavActiveLink
                      title={item.title}
                      href={`/${item.path}`}
                      scrolled={scrolled || !!menuHover}
                      variant="header"
                    />
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <div className="hidden md:flex justify-center md:w-1/3">
            <Link
              href={"/"}
              prefetch={true}
              className="flex w-full items-center justify-center md:w-auto"
            >
              <LogoSquare scrolled={scrolled || !!menuHover} />
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
        {/* Menu con hiển thị khi hover menu cha hoặc submenu */}
        <div
          ref={dropdownRef}
          className={clsx(
            "absolute left-0 top-full w-full bg-white transition-all duration-300 ease-in-out shadow-md overflow-hidden z-998",
            menuHover === "Teaware"
              ? "max-h-[600px] opacity-100 visible"
              : "max-h-0 opacity-0 invisible"
          )}
          onMouseEnter={() => setMenuHover(menuHover)} // giữ state khi hover submenu
          onMouseLeave={() => setMenuHover(null)} // chỉ tắt khi rời toàn vùng
        >
          {menuHover === "Teaware" && (
            <div className="mx-auto w-full px-10 py-12 flex flex-col md:flex-row gap-8 items-start">
              {/* Bên trái: submenu */}
              <div className="flex-1 flex justify-between gap-5">
                <div className="flex-1">
                  <h1 className="text-lg uppercase">Type</h1>
                  <div className="flex flex-col gap-3 mt-3">
                    {teawareSubmenu.map((sub, index) => (
                      <Link
                        key={sub.title}
                        href={`/${sub.path}`}
                        className="desktop-menu-item underline-center transition text-black font-medium text-2xl"
                        data-delay={index}
                      >
                        {sub.title}
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="flex-1">
                  <h1 className="text-lg uppercase">Medium</h1>
                  <div className="flex flex-col gap-3 mt-3">
                    {teawareSubmenuMedium.map((sub, index) => (
                      <Link
                        key={sub.title}
                        href={`/${sub.path}`}
                        className="desktop-menu-item underline-center transition text-black font-medium text-2xl"
                        data-delay={index}
                      >
                        {sub.title}
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="flex-1"></div>
              </div>

              {/* Bên phải: banner cố định */}
              <div className="flex-1">
                <img
                  src="https://cdn.shopify.com/s/files/1/0682/6636/0920/files/banner-exhibition.jpg?v=1762940727"
                  alt="Teaware banner"
                  className="w-full h-[50vh] object-cover rounded-xs shadow-sm"
                />
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}

{
  /* <nav
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
></nav>; */
}
