"use client";
import Link from "next/link";
import { UserIcon } from "@heroicons/react/24/outline";

export default function NavbarClient() {
  return (
    <>
      <Link href="https://shopify.com/68266360920/account/orders">
        {" "}
        <UserIcon className="ml-2 h-6 w-6 hover:text-emerald-600 hover:scale-110" />
      </Link>
    </>
  );
}
