// app/api/shopify/customer/route.ts
import { NextResponse } from "next/server";
import { getCustomerQuery } from "@/lib/shopify/queries/customer";
import { shopifyFetch } from "@/lib/shopify/customer";


// Trong GET:
export async function GET(req: Request) {
  const token = req.headers.get("x-shopify-token");
  if (!token) return NextResponse.json({ customer: null });

  const res = await shopifyFetch({
    query: getCustomerQuery,
    variables: { accessToken: token }, // bây giờ được chấp nhận
  });

  return NextResponse.json({ customer: res.body.data.customer });
}
