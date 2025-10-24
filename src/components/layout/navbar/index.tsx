import { getMenu } from "@/lib/shopify";
import { Menu } from "@/lib/shopify/types";
import Link from "next/link";
import MobileMenu from "./mobile-menu";
import Search from "./search";
import LogoSquare from "@/components/logo-square";
import CartModal from "@/components/cart/modal";
import { cookies } from "next/headers";
import { getCustomer } from "@/lib/shopify/customer";

export async function Navbar() {
  const menu = await getMenu("main-menu");

  const cookieStore = cookies();
  const token = (await cookieStore).get("shopify_customer_token")?.value;

  let customer = null;
  if (token) {
    try {
      customer = await getCustomer(token);
    } catch (err) {
      console.error("Error fetching customer:", err);
    }
  }

  return (
    <nav className="flex items-center justify-between p-4 lg:px-16 sticky top-0 backdrop-blur-sm z-999 bg-black">
      <div className="block flex-none md:hidden">
        <MobileMenu menu={menu} />
      </div>
      <div className="flex w-full items-center justify-center container" style={{margin:'0 auto'}}>
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
            className="flex w-full items-center justify-center md:w-auto"
          >
            <LogoSquare />

          </Link>

        </div>
        <div className="hidden justify-end md:flex md:w-1/3 gap-5">
          {/* Search */}
          <Search />
          {/* login */}
          {customer ? (
            <>
              <span className="text-sm text-gray-600">
                Hi, {customer.firstName || customer.email.split("@")[0]}
              </span>
              <form action="/api/logout" method="post">
                <button
                  type="submit"
                  className="text-sm text-gray-700 hover:text-black"
                >
                  Logout
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/login"
              className="text-sm text-gray-700 hover:text-black"
            >
              Login
            </Link>
          )}

          {/* cart */}
          <CartModal />
        </div>
      </div>
    </nav>
  );
}