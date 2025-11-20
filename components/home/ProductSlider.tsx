"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import Price from "../grid/parts/price";
import { QuickAddToCart } from "../ui/quick-add-to-cart";
import { Product } from "../../lib/shopify/types";

function ProductItem({ product }: { product: Product }) {
  const secondImage = product.images?.[1]?.url;
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="products-price max-w-[250] md:max-w-[450] shrink-0 w-[250px] md:w-[450px]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="group relative overflow-hidden aspect-square w-full">
        <Link
          href={`/product/${product.handle}`}
          className="block w-full h-full"
        >
          <div className="relative w-full h-full aspect-square">
            {/* First image (default) */}
            <Image
              src={product.featuredImage?.url || ""}
              alt={product.title}
              fill
              sizes="(max-width: 768px) 250px, 450px"
              className={`object-cover transition-opacity duration-500 ${
                isHovered && secondImage ? "opacity-0" : "opacity-100"
              }`}
              priority={false}
            />
            {/* Second image (on hover) */}
            {secondImage && (
              <Image
                src={secondImage}
                alt={product.title}
                fill
                sizes="(max-width: 768px) 250px, 450px"
                className={`absolute inset-0 object-cover transition-opacity duration-500 ${
                  isHovered ? "opacity-100" : "opacity-0"
                }`}
                priority={false}
              />
            )}
          </div>
          <div className="absolute inset-0 transition-colors pointer-events-none" />
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
          currencyCode={product.priceRange?.minVariantPrice?.currencyCode}
          currencyCodeClassName="hidden src[275px]/label:inline"
        />
      </div>
    </div>
  );
}

export default function ProductSlider({
  topProducts,
}: {
  topProducts: Product[];
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

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

        {/* Wrapper for scroll container and buttons */}
        <div
          className="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Nút scroll */}
          <button
            onClick={() => scroll("left")}
            aria-label="Scroll left"
            className={`hidden md:flex absolute cursor-pointer left-28 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white rounded-full shadow p-2 z-10 transition-opacity duration-300 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          >
            <ChevronLeftIcon className="w-6 h-6 text-gray-700" />
          </button>
          <button
            onClick={() => scroll("right")}
            aria-label="Scroll right"
            className={`hidden md:flex absolute cursor-pointer right-28 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white rounded-full shadow p-2 z-10 transition-opacity duration-300 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          >
            <ChevronRightIcon className="w-6 h-6 text-gray-700" />
          </button>

          {/* Container scroll */}
          <div
            ref={scrollRef}
            className="flex gap-2 md:gap-20 overflow-x-auto px-2 scrollbar-hide cursor-grab active:cursor-grabbing scroll-smooth"
          >
            {topProducts.map((product) => (
              <ProductItem key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
