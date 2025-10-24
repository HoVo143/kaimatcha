"use client";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import Link from "next/link";
import LogoutButton from "@/app/logout/page";

export default function NavbarClient() {
  const [customer, setCustomer] = useState<any>(null);

  useEffect(() => {
    async function fetchCustomer() {
      const token = Cookies.get("shopify_customer_token");

      if (!token) return setCustomer(null);

      const res = await fetch("/api/shopify/customer", {
        headers: { "x-shopify-token": token },
      });
      const data = await res.json();
      setCustomer(data.customer);
    }

    fetchCustomer();
  }, []);

      console.log('customer', customer);

  return (
    <>
      {customer ? (
        <>
          <span className="text-sm text-gray-700">Hi, {customer.firstName || customer.email.split("@")[0]}</span>
          <LogoutButton />
        </>
      ) : (
        <Link href="/login" className="text-sm text-gray-700 hover:text-black">Login</Link>
      )}
    </>
  );
}
