"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { UserIcon  } from "@heroicons/react/24/outline";

export default function NavbarClient() {
  return (
    <>
      {/* {isLoggedIn ? (
        <Link href="https://shopify.com/68266360920/account/orders">Account</Link>
      ) : (
        <Link href="/api/shopify/login">Login</Link>
      )} */}
      <Link href="https://shopify.com/68266360920/account/orders"> <UserIcon  className="mt-1 h-6 w-6 text-white" /></Link>
    </>
  );
}
