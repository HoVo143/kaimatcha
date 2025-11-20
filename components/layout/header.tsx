import { getMenu } from "../../lib/shopify";
import HeaderClient from "./header/navbar-client-wrapper";

export async function Navbar() {
  const menu = await getMenu("menu-header");
  const teawareSubmenu = await getMenu("dropdown-teaware-type");
  const teawareSubmenuMedium = await getMenu("dropdown-teaware-medium");

  return (
    <HeaderClient
      menu={menu}
      teawareSubmenu={teawareSubmenu}
      teawareSubmenuMedium={teawareSubmenuMedium}
    />
  );
}
