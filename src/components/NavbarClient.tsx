"use client";
import { useState, useEffect } from "react";
import { getCustomer } from "@/lib/shopify/customer";
import Link from "next/link";
import LogoutButton from "@/app/logout/page";

export default function NavbarClient({ token }: { token?: string }) {
  const [customer, setCustomer] = useState<any>(null);

  useEffect(() => {
    async function fetchCustomer() {
      if (!token) return;
      try {
        const data = await getCustomer(token);
        setCustomer(data);
      } catch (err) {
        setCustomer(null);
      }
    }
    fetchCustomer();
  }, [token]);

  return (
    <>
      {customer ? (
        <>
          <span className="text-sm text-gray-600">
            Hi, {customer.firstName || customer.email.split("@")[0]}
          </span>
          <LogoutButton />
        </>
      ) : (
        <Link
          href="/login"
          className="text-sm text-gray-700 hover:text-black"
        >
          Login
        </Link>
      )}
    </>
  );
}
