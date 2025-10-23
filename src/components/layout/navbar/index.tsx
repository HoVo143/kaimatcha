import { getMenu } from "@/lib/shopify";
import { Menu } from "@/lib/shopify/types";
import Link from "next/link";
import MobileMenu from "./mobile-menu";
import Search from "./search";
import LogoSquare from "@/components/logo-square";
import CartModal from "@/components/cart/modal";

export async function Navbar() {
  const menu = await getMenu("main-menu");
  return (
    <nav className="flex items-center justify-between p-4 lg:px-16 sticky top-0 backdrop-blur-sm z-999 bg-black">
      <div className="block flex-none md:hidden">
        <MobileMenu menu={menu} />
      </div>
      <div className="flex w-full items-center">
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
        <div className="flex justify-center md:w-1/3">
           <Link
            href={"/"}
            prefetch={true}
            className="mr-2 flex w-full items-center justify-center md:w-auto lg:mr-6"
          >
            <LogoSquare />

          </Link>

        </div>
        <div className="hidden justify-end md:flex md:w-1/3 gap-5">
          {/* Search */}
          <Search />

          {/* cart */}
          <CartModal />
        </div>
      </div>
    </nav>
  );
}