"use client";
import Link from "next/link";
import { UserIcon  } from "@heroicons/react/24/outline";

export default function NavbarClient() {
  return (
    <>
      <Link href="https://shopify.com/68266360920/account/orders"> <UserIcon  className="mt-1.5 md:mt-1 h-6 w-6 text-white" /></Link>
    </>
  );
}
