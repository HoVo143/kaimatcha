// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import clsx from "clsx";

// export default function FooterLink({
//   title,
//   href,
// }: {
//   title: string;
//   href: string;
// }) {
//   const pathname = usePathname();

//   const isActive =
//     pathname === href || (pathname.startsWith(href) && href !== "/");

//   const DynamicTag = isActive ? "p" : Link;

//   return (
//     <li className="mt-2 flex text-sm text-black">
//       <DynamicTag
//         href={href}
//         className={clsx(
//           "w-full underline-offset-4 hover:underline transition-colors",
//           isActive && "underline text-black font-medium"
//         )}
//       >
//         {title}
//       </DynamicTag>
//     </li>
//   );
// }
