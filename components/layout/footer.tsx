import Link from "next/link";
import { getMenu } from "../../lib/shopify";
import { Menu } from "../../lib/shopify/types";
import { ArrowRight, Instagram } from "lucide-react";

export default async function Footer() {
  // Gọi 3 menu riêng biệt
  const [teaMenu, teawareMenu, aboutMenu] = await Promise.all([
    getMenu("menu-tea"),
    getMenu("menu-tea"),
    getMenu("footer"),
  ]);

  // Helper render cột menu
  const renderColumn = (title: string, items: Menu[]) => (
    <div>
      <h3 className="uppercase text-xs tracking-widest mb-4 font-medium text-neutral-700">
        {title}
      </h3>
      <ul className="space-y-2 text-sm leading-6">
        {items.map((item) => (
          <li key={item.title}>
            <Link
              href={item.path.startsWith("/") ? item.path : `/${item.path}`}
              prefetch={true}
              className="text-neutral-800 hover:text-black transition hover:underline"
            >
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <footer className="w-full border-t border-neutral-300 bg-white text-black">
      <div className="mx-auto max-w-8xl grid sm:grid-cols-2 md:grid-cols-4 gap-12 px-6 py-16">
        {/* Newsletter */}
        <div>
          <h3 className="uppercase text-xs tracking-widest mb-4 font-medium text-neutral-700">
            Keep in touch
          </h3>
          <p className="text-sm mb-6 leading-6">
            Join our newsletter to get monthly updates about our tea masters and artists.
          </p>

          <form className="mb-6">
            <div className="relative w-full">
              <input
                type="email"
                placeholder="Email"
                className="w-full border-b border-neutral-400 focus:outline-none py-1 pr-8 text-sm placeholder-neutral-600 bg-transparent"
              />
              <button
                type="submit"
                className="absolute right-0 top-0 text-neutral-600 hover:text-black"
              >
                <ArrowRight size={16} strokeWidth={1.5} />
              </button>
            </div>
          </form>

          <div>
            <h4 className="uppercase text-xs tracking-widest mb-3 font-medium text-neutral-700">
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
        {renderColumn("About", aboutMenu)}
      </div>

      {/* Bottom Line */}
      <div className="border-t border-neutral-300 text-xs text-center py-4 tracking-wide text-neutral-700 space-x-3">
        <span>© KAI MATCHA {new Date().getFullYear()}</span>
        <Link href="/terms-of-service" className="hover:underline">
          TERMS
        </Link>
        <Link href="/data-sharing-opt-out" className="hover:underline">
          PRIVACY POLICY
        </Link>
      </div>
    </footer>
  );
}
