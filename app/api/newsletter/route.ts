/* eslint-disable prettier/prettier */
import { NextRequest, NextResponse } from "next/server";
import { ensureStartWith } from "../../../lib/utils";
import { SHOPIFY_GRAPHQL_API_ADMIN_CUSTOMERS_ENDPOINT } from "../../../lib/constants";

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

  // Gọi Shopify Admin API
  const shopifyAccessToken = process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN;
  const shopifyDomainAdmin = process.env.SHOPIFY_STORE_DOMAIN_ADMIN
    ? ensureStartWith(process.env.SHOPIFY_STORE_DOMAIN_ADMIN, "https://")
    : "";
  const endpoint = `${shopifyDomainAdmin}${SHOPIFY_GRAPHQL_API_ADMIN_CUSTOMERS_ENDPOINT}`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": shopifyAccessToken,
    },
    body: JSON.stringify({
      query: `
        mutation customerCreate($input: CustomerInput!) {
          customerCreate(input: $input) {
            userErrors { field message }
            customer {
              id
              email
              emailMarketingConsent {
                marketingState
                marketingOptInLevel
                consentUpdatedAt
              }
            }
          }
        }
      `,
      variables: {
        input: {
          email,
          firstName: "Newsletter",
          lastName: "Subscriber",
          emailMarketingConsent: {
            marketingState: "SUBSCRIBED",
            marketingOptInLevel: "SINGLE_OPT_IN",
            consentUpdatedAt: new Date().toISOString(),
          },
        },
      },
    }),
  });

  const data = await response.json();

  if (data.errors || data.data?.customerCreate?.userErrors?.length) {
    console.error("Shopify GraphQL error:", JSON.stringify(data, null, 2));
    return NextResponse.json({ error: data }, { status: 500 });
  }

  return NextResponse.json({ success: true, customer: data.data.customerCreate.customer });
}