"use client";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { getCustomer } from "@/lib/shopify/customer";
import Link from "next/link";
import LogoutButton from "@/app/logout/page";

export default function NavbarClient() {
  const [customer, setCustomer] = useState<any>(null);

  useEffect(() => {
    async function fetchCustomer() {
      const token = Cookies.get("shopify_customer_token"); // lấy trực tiếp từ client
      if (!token) {
        setCustomer(null);
        return;
      }
      try {
        const data = await getCustomer(token);
        setCustomer(data);
      } catch (err) {
        setCustomer(null);
      }
    }

    fetchCustomer();

    // Optional: poll hoặc subscribe để detect logout/login
    const interval = setInterval(fetchCustomer, 1000);
    return () => clearInterval(interval);
  }, []);

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
