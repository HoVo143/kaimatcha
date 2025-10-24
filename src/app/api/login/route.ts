import { NextResponse } from "next/server";
import { loginCustomer } from "@/lib/shopify/customer";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const { customerAccessToken, customerUserErrors } = await loginCustomer({ email, password });

  if (customerUserErrors?.length > 0) {
    return NextResponse.json({ message: customerUserErrors[0].message }, { status: 400 });
  }

  // Lưu token vào cookie
  const res = NextResponse.json({ message: "Login success" });
  res.cookies.set("shopify_customer_token", customerAccessToken.accessToken, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7, // 7 ngày
    path: "/",
  });

  return res;
}
