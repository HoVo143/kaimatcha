import { getMenu } from "../../../lib/shopify";
import { Menu } from "../../../lib/shopify/types";
import Link from "next/link";
import MobileMenu from "./mobile-menu";
import Search from "./search";
import LogoSquare from "../../logo-square";
import CartModal from "../../cart/modal";
import NavbarClient from "./account-client";

export async function Navbar() {
  const menu = await getMenu("main-menu");

  return (
    <nav className="flex items-center justify-between p-4 lg:px-6 sticky top-0 backdrop-blur-sm z-999 bg-black">
      {/* Mobile menu icon */}
      <div className="block flex-none md:hidden">
        <MobileMenu menu={menu} />
      </div>
      {/* Logo — khi mobile */}
      <Link
        href="/"
        prefetch={true}
        className="md:hidden absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0 flex items-center justify-center"
      >
        <LogoSquare />
      </Link>

      {/* Right side desktop items */}
      <div className="flex w-full items-center justify-center" style={{margin:'0 auto'}}>
        <div className="flex w-full md:w-1/3">
         
          {menu.length > 0 ? (
            <ul className="hidden gap-6 text-sm md:flex md:items-center">
              {menu.map((item: Menu) => (
                <li key={item.title}>
                  <Link
                    href={`/${item.path}`}
                    prefetch={true}
                    className="text-white uppercase underline-offset-4 hover:text-emerald-600 hover:underline"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        <div className="hidden md:flex justify-center md:w-1/3">
           <Link
            href={"/"}
            prefetch={true}
            className="flex w-full items-center justify-center md:w-auto"
          >
            <LogoSquare />

          </Link>

        </div>
        <div className="justify-end flex md:w-1/3 md:gap-5">
          {/* Search */}
          <div className="hidden md:flex">
            <Search />
          </div>

          {/* Account */}
          <NavbarClient />

          {/* cart */}
          <CartModal />
        </div>
      </div>
    </nav>
  );
}