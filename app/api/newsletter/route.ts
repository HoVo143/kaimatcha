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

  // Thử tạo customer mới trước
  const createResponse = await fetch(endpoint, {
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

  const createData = await createResponse.json();

  // Nếu tạo thành công, return
  if (!createData.errors && !createData.data?.customerCreate?.userErrors?.length && createData.data?.customerCreate?.customer) {
    return NextResponse.json({ 
      success: true, 
      customer: createData.data.customerCreate.customer 
    });
  }

  // Nếu email đã tồn tại, tìm customer và update
  const emailExists = createData.data?.customerCreate?.userErrors?.some(
    (error: { field: string[]; message: string }) => {
      const message = error.message?.toLowerCase() || "";
      return (
        message.includes("email") || 
        message.includes("already exists") ||
        message.includes("already been taken") ||
        message.includes("taken") ||
        (error.field?.includes("email") && message.includes("taken"))
      );
    }
  );

  if (emailExists) {
    // Query customer bằng email
    const queryResponse = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": shopifyAccessToken,
      },
      body: JSON.stringify({
        query: `
          query getCustomerByEmail($query: String!) {
            customers(first: 1, query: $query) {
              edges {
                node {
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
          }
        `,
        variables: {
          query: `email:${email}`,
        },
      }),
    });

    const queryData = await queryResponse.json();

    if (queryData.errors || !queryData.data?.customers?.edges?.length) {
      console.error("Shopify GraphQL error:", JSON.stringify(queryData, null, 2));
      return NextResponse.json({ error: "Customer not found" }, { status: 500 });
    }

    const customerId = queryData.data.customers.edges[0].node.id;

    // Update customer email marketing consent để subscribe newsletter
    const updateResponse = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": shopifyAccessToken,
      },
      body: JSON.stringify({
        query: `
          mutation customerEmailMarketingConsentUpdate($input: CustomerEmailMarketingConsentUpdateInput!) {
            customerEmailMarketingConsentUpdate(input: $input) {
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
            customerId,
            emailMarketingConsent: {
              marketingState: "SUBSCRIBED",
              marketingOptInLevel: "SINGLE_OPT_IN",
              consentUpdatedAt: new Date().toISOString(),
            },
          },
        },
      }),
    });

    const updateData = await updateResponse.json();

    if (updateData.errors || updateData.data?.customerEmailMarketingConsentUpdate?.userErrors?.length) {
      console.error("Shopify GraphQL error:", JSON.stringify(updateData, null, 2));
      return NextResponse.json({ error: updateData }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      alreadyExists: true,
      customer: updateData.data.customerEmailMarketingConsentUpdate.customer 
    });
  }

  // Nếu có lỗi khác, return error
  console.error("Shopify GraphQL error:", JSON.stringify(createData, null, 2));
  return NextResponse.json({ error: createData }, { status: 500 });
}