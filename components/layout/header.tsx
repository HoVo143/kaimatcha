import { getMenu } from "../../lib/shopify";
import HeaderClient from "./header/navbar-client-wrapper";

export async function Navbar() {
  const menu = await getMenu("menu-header");
  const teawareSubmenu = await getMenu("dropdown-teaware-type");
  const teawareSubmenuMedium = await getMenu("dropdown-teaware-medium");
  const goodsSubmenu = await getMenu("dropdown-goods-type");
  const goodsSubmenuMedium = await getMenu("dropdown-goods-medium");

  return (
    <HeaderClient
      menu={menu}
      teawareSubmenu={teawareSubmenu}
      teawareSubmenuMedium={teawareSubmenuMedium}
      goodsSubmenu={goodsSubmenu}
      goodsSubmenuMedium={goodsSubmenuMedium}
    />
  );
}
