"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function NavbarClient() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("customer_token");
    if (token) setIsLoggedIn(true);
  }, []);

  return (
    <>
      {/* {isLoggedIn ? (
        <Link href="https://shopify.com/68266360920/account/orders">Account</Link>
      ) : (
        <Link href="/api/shopify/login">Login</Link>
      )} */}
      <Link className="text-white" href="https://shopify.com/68266360920/account/orders">Account</Link>
    </>
  );
}
