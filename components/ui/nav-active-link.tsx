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

  // style base chung // class css ở globals.css
  const baseStyle = clsx("underline-center");

  // style riêng từng loại
  const variantStyle =
    variant === "header"
      ? clsx(
          isActive &&
            (scrolled
              ? "underline underline-offset-5 text-emerald-700"
              : "underline underline-offset-5 text-emerald-300"),
          scrolled
            ? "text-black hover:text-emerald-600"
            : "text-white hover:text-emerald-400"
        )
      : clsx(
          isActive && "underline underline-offset-7 text-emerald-700",
          "text-black hover:text-emerald-600"
        );

  return (
    <Link href={href} prefetch={true} className={clsx(baseStyle, variantStyle)}>
      {title}
    </Link>
  );
}
