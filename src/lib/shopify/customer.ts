import { SHOPIFY_GRAPHQL_API_ENDPOINT } from "../constants";
import { isShopifyError } from "../type-guards";
import { ensureStartWith } from "../utils";
import {
  customerCreateMutation,
  customerAccessTokenCreateMutation,
  getCustomerQuery,
} from "./queries/customer";

const domain = process.env.SHOPIFY_STORE_DOMAIN
  ? ensureStartWith(process.env.SHOPIFY_STORE_DOMAIN, "https://")
  : "";
const endpoint = `${domain}${SHOPIFY_GRAPHQL_API_ENDPOINT}`;
const key = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
type ExtractVariables<T> = T extends { variables: object }
  ? T["variables"]
  : Record<string, any>;

export async function shopifyFetch<T>({
  cache = "no-store", // ✅ nên để no-store cho auth (đăng nhập, đăng ký)
  headers,
  query,
  tags,
  variables,
}: {
  cache?: RequestCache;
  headers?: HeadersInit;
  query: string;
  tags?: string[];
  variables?: ExtractVariables<T>;
}): Promise<{ status: number; body: any }> {
  try {
    const result = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": key,
        ...headers,
      },
      body: JSON.stringify({
        query,
        variables,
      }),
      cache,
      ...(tags && { next: { tags } }),
    });

    const body = await result.json();

    if (body.errors) {
      console.error("Shopify GraphQL Error:", body.errors);
      throw new Error(body.errors[0].message);
    }

    return {
      status: result.status,
      body,
    };
  } catch (error) {
    console.error("Shopify Fetch Error:", error);
    throw error;
  }
}

interface RegisterInput {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

interface LoginInput {
  email: string;
  password: string;
}

export async function registerCustomer({
  email,
  password,
  firstName,
  lastName,
}: RegisterInput) {
  const res = await shopifyFetch<{
    data: { customerCreate: unknown };
  }>({
    query: customerCreateMutation,
    variables: { input: { email, password, firstName, lastName } },
  });

  return res.body.data.customerCreate;
}

export async function loginCustomer({ email, password }: LoginInput) {
  const res = await shopifyFetch<{
    data: { customerAccessTokenCreate: unknown };
  }>({
    query: customerAccessTokenCreateMutation,
    variables: { input: { email, password } },
  });

  return res.body.data.customerAccessTokenCreate;
}

export async function getCustomer(accessToken: string) {
  const res = await shopifyFetch<{
    data: { customer: unknown };
  }>({
    query: getCustomerQuery,
    variables: { accessToken },
  });

  return res.body.data.customer;
}