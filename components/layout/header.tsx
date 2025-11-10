import { getMenu } from "../../lib/shopify";
import HeaderClient from "./header/navbar-client-wrapper";

export async function Navbar() {
  const menu = await getMenu("menu-header");
  return <HeaderClient menu={menu} />;
}
