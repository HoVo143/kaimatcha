/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { getMenu } from "../../lib/shopify";
import { Menu } from "../../lib/shopify/types";
import { Instagram } from "lucide-react";
import NewsletterForm from "../ui/newsletter-form";
import NavActiveLink from "../ui/nav-active-link";

export default async function Footer() {
  // Gọi 3 menu riêng biệt
  const [teaMenu, teawareMenu, aboutMenu, customerService] = await Promise.all([
    getMenu("menu-tea"),
    getMenu("menu-teaware"),
    getMenu("menu-about-us"),
    getMenu("main-menu"),
  ]);

  // Helper render cột menu
  const renderColumn = (title: string, items: Menu[]) => (
    <div className="text-sm md:text-lg">
      <h3 className="uppercase tracking-widest mb-4 text-neutral-700">
        {title}
      </h3>
      <ul className="space-y-2 leading-6 font-semibold">
        {items.map((item) => (
          <li key={item.title}>
            <NavActiveLink
              title={item.title}
              href={item.path.startsWith("/") ? item.path : `/${item.path}`}
              variant="footer" //  kiểu footer, không phụ thuộc scrolled
            />
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <footer className="w-full  bg-white text-black">
      <div className="mx-auto max-w-8xl flex flex-wrap justify-between gap-12 px-5 md:px-10 py-14">
        {/* Newsletter */}
        <div className="text-sm md:text-lg max-w-[400px]">
          <h3 className="uppercase tracking-widest mb-4 text-neutral-700">
            Keep in touch
          </h3>
          <p className="mb-6 leading-6">
            Join our newsletter to get monthly updates about our tea masters and
            artists.
          </p>

          <NewsletterForm />

          <div>
            <h4 className="uppercase tracking-widest mb-3 text-neutral-700">
              Social
            </h4>
            <div className="flex gap-3">
              <Link
                href="https://instagram.com"
                target="_blank"
                className="text-neutral-700 hover:text-black transition"
              >
                <Instagram size={18} strokeWidth={1.5} />
              </Link>
            </div>
          </div>
        </div>

        {/* Menu Columns */}
        {renderColumn("Tea", teaMenu)}
        {renderColumn("Teaware", teawareMenu)}
        {renderColumn("Customer service", customerService)}
        {renderColumn("About", aboutMenu)}

        <div className="flex justify-start max-w-[80] items-start min-h-[100] bg-white">
          <div className="relative px-3 py-8">
            {/* Viền ngoài */}
            <div className="absolute inset-0 border border-gray-400 [clip-path:polygon(0_6%,6%_0,94%_0,100%_6%,100%_94%,94%_100%,6%_100%,0_94%)]"></div>
            {/* Viền trong */}
            <div className="absolute inset-[3px] border border-gray-400 [clip-path:polygon(0_6%,6%_0,94%_0,100%_6%,100%_94%,94%_100%,6%_100%,0_94%)]"></div>

            {/* Nội dung dọc */}
            <p className="relative text-gray-700 text-sm tracking-[0.2em] [writing-mode:vertical-rl] font-serif">
              KAI MATCHA the art of tea
            </p>
          </div>
        </div>
      </div>
      <div className="m-auto w-full flex justify-center">
        <img
          className="h-12 mb-2"
          src="/logo-kaimatcha-new.svg"
          alt="logo kaimatcha"
        />
      </div>
      {/* Bottom Line */}
      <div className="bottom-line border-t border-neutral-300 text-xs text-center py-4 tracking-wide text-neutral-700 space-x-3 ">
        <span>© KAI MATCHA {new Date().getFullYear()}</span>
        <Link href="/terms-of-service" className="hover:underline">
          TERMS
        </Link>
        <Link href="/privacy-policy" className="hover:underline">
          PRIVACY POLICY
        </Link>
      </div>
    </footer>
  );
}
