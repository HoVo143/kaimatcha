import { NextResponse } from "next/server";
import { otpStore } from "@/lib/otpStore";
import { shopifyFetch } from "@/lib/shopify/customer";
import {
  customerCreateMutation,
  customerAccessTokenCreateMutation,
} from "@/lib/shopify/queries/customer";

export async function POST(req: Request) {
  const { email, code } = await req.json();
  const record = otpStore.get(email);

  if (!record || record.code !== code || Date.now() > record.expires) {
    return NextResponse.json({ message: "Invalid or expired code" }, { status: 400 });
  }

  otpStore.delete(email);

  const defaultPassword = process.env.SHOPIFY_DEFAULT_PASS || "default@123";

  // tạo customer nếu chưa có
  await shopifyFetch({
    query: customerCreateMutation,
    variables: { input: { email, password: defaultPassword } },
  });

  // tạo token
  const res = await shopifyFetch({
    query: customerAccessTokenCreateMutation,
    variables: { input: { email, password: defaultPassword } },
  });

  const data = res.body.data.customerAccessTokenCreate;
  if (data.customerUserErrors?.length > 0) {
    return NextResponse.json(
      { message: data.customerUserErrors[0].message },
      { status: 400 }
    );
  }

  const token = data.customerAccessToken.accessToken;

  const response = NextResponse.json({ message: "Login success" });
  response.cookies.set("shopify_customer_token", token, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
