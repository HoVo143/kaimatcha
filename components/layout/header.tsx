import { getMenu } from "../../lib/shopify";
import HeaderClient from "./header/navbar-client-wrapper";

export async function Navbar() {
  const menu = await getMenu("menu-header");
  const teawareSubmenu = await getMenu("dropdown-menu-teaware");
  const goodsSubmenu = await getMenu("dropdown-menu-goods");

  return (
    <HeaderClient
      menu={menu}
      teawareSubmenu={teawareSubmenu}
      goodsSubmenu={goodsSubmenu}
    />
  );
}
