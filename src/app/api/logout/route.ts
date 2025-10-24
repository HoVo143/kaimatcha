import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const baseDomain = process.env.NEXT_PUBLIC_BASE_URL
    ? new URL(process.env.NEXT_PUBLIC_BASE_URL).hostname
    : undefined;

  const response = NextResponse.redirect("/login");

  response.cookies.set("shopify_customer_token", "", {
    httpOnly: true,
    path: "/",
    domain: baseDomain, // bắt buộc match domain login
    maxAge: 0,
  });

  return response;
}
