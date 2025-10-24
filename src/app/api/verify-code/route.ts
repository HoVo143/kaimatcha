import { NextResponse } from "next/server";
import { otpStore } from "@/lib/otpStore";
import {
  customerCreateMutation,
  customerAccessTokenCreateMutation,
} from "@/lib/shopify/queries/customer";
import { shopifyFetch } from "@/lib/shopify/customer";

export async function POST(req: Request) {
  const { email, code } = await req.json();
  const record = otpStore.get(email);

  if (!record || record.code !== code || Date.now() > record.expires) {
    return NextResponse.json({ message: "Invalid or expired code" }, { status: 400 });
  }

  otpStore.delete(email);
  const defaultPassword = process.env.SHOPIFY_DEFAULT_PASS || "default@123";

  await shopifyFetch({
    query: customerCreateMutation,
    variables: { input: { email, password: defaultPassword } },
  });

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

 
  // **Chỉ trả JSON kèm token** cho client
  const response = NextResponse.json({
    message: "Login success",
    token,
    redirectUrl: "https://shopify.com/68266360920/account/orders",
  });

  // Cookie chỉ set cho domain của bạn để Navbar nhận biết
  response.cookies.set("shopify_customer_token", token, {
    httpOnly: false,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
