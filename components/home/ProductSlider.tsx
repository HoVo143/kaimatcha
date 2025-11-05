"use client";
import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import Price from "../grid/parts/price";
import { QuickAddToCart } from "../ui/quick-add-to-cart";

export default function ProductSlider({ topProducts }: { topProducts: any[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth } = scrollRef.current;
    const scrollAmount = clientWidth * 0.8;
    scrollRef.current.scrollTo({
      left:
        direction === "left"
          ? scrollLeft - scrollAmount
          : scrollLeft + scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section className="w-full py-6 md:py-24 relative">
      <div className="container mx-auto px-4 md:px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-medium mb-4 uppercase">
          Featured Tea Blends
        </h2>
        <p className="text-muted-foreground max-w-[300px] text-sm md:text-xl md:max-w-[500px] mx-auto mb-2">
          Carefully curated selections from our master tea blenders, each
          crafted with love and respect for nature
        </p>
        <p>
          <Link
            href="/collections"
            className="text-sm underline font-medium hover:text-emerald-700 transition-colors mb-12 inline-block uppercase"
          >
            View all
          </Link>
        </p>

        {/* Nút scroll */}
        <button
          onClick={() => scroll("left")}
          className="hidden md:flex absolute cursor-pointer left-28 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white rounded-full shadow p-2 z-10 transition"
        >
          <ChevronLeftIcon className="w-6 h-6 text-gray-700" />
        </button>
        <button
          onClick={() => scroll("right")}
          className="hidden md:flex absolute cursor-pointer right-28 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white rounded-full shadow p-2 z-10 transition"
        >
          <ChevronRightIcon className="w-6 h-6 text-gray-700" />
        </button>

        {/* Container scroll */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto px-2 scrollbar-hide cursor-grab active:cursor-grabbing scroll-smooth"
        >
          {topProducts.map((product) => (
            <div
              // className="products-price group relative max-w-[250] md:max-w-[450] shrink-0 overflow-hidden rounded-2xl shadow-md bg-white"
              key={product.id}
              className="products-price max-w-[250] md:max-w-[450] shrink-0 "
            >
              <div className="group relative overflow-hidden rounded-2xl shadow-md">
                <Link href={`/product/${product.handle}`}>
                  <Image
                    src={product.featuredImage?.url || ""}
                    alt={product.title}
                    width={400}
                    height={400}
                    className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                </Link>
                <div
                  className="
                      absolute bottom-2 md:bottom-4 left-1/9 md:left-1/2 -translate-x-1/2
                      md:opacity-0 md:translate-y-6
                      md:group-hover:opacity-100 md:group-hover:translate-y-0
                      md:transition-all md:duration-500 md:ease-out
                    "
                >
                  <QuickAddToCart product={product} />
                </div>
              </div>
              <div className="mt-4">
                <h3 className=" text-black text-base md:text-lg font-medium tracking-wide uppercase">
                  {product.title}
                </h3>
                <Price
                  className="text-black text-sm font-medium tracking-wide mt-2"
                  amount={product.priceRange?.minVariantPrice?.amount}
                  currencyCode={
                    product.priceRange?.minVariantPrice?.currencyCode
                  }
                  currencyCodeClassName="hidden src[275px]/label:inline"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
