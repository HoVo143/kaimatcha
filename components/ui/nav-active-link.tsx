"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

interface NavLinkProps {
  title: string;
  href: string;
  scrolled?: boolean; // chỉ header dùng
  variant?: "header" | "footer"; // phân biệt kiểu
}

function isExactActive(pathname: string, href: string) {
  // Bỏ dấu "/" cuối để tránh mismatch
  const cleanPath = pathname.replace(/\/$/, "");
  const cleanHref = href.replace(/\/$/, "");

  // Nếu là root collections → chỉ active đúng /collections
  if (cleanHref === "/collections") return cleanPath === cleanHref;

  // Còn lại thì match chính xác
  return cleanPath === cleanHref;
}

export default function NavActiveLink({
  title,
  href,
  scrolled,
  variant = "header",
}: NavLinkProps) {
  const pathname = usePathname();
  //   const isActive =
  //     pathname === href || (pathname.startsWith(href) && href !== "/");

  const isActive = isExactActive(pathname, href);

  // style base chung
  const baseStyle =
    "underline-offset-4 hover:underline transition-colors duration-300";

  // style riêng từng loại
  const variantStyle =
    variant === "header"
      ? clsx(
          isActive &&
            (scrolled
              ? "underline text-emerald-700"
              : "underline text-emerald-300"),
          scrolled
            ? "text-black hover:text-emerald-600"
            : "text-white hover:text-emerald-400"
        )
      : clsx(
          isActive && "underline text-emerald-700",
          "text-black hover:text-emerald-600"
        );

  return (
    <Link href={href} prefetch={true} className={clsx(baseStyle, variantStyle)}>
      {title}
    </Link>
  );
}
