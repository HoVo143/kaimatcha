import { Product } from "../../lib/shopify/types";
import Grid from "../grid";
import Link from "next/link";
import { GridTileImage } from "../grid/tile";
import { QuickAddToCart } from "../ui/quick-add-to-cart";

export default function ProductGridItems({
  products,
}: {
  products: Product[];
}) {
  return (
    <>
      {products.map((product) => (
        <Grid.Item
          key={product.handle}
          className="animate-fadeIn relative group mb-8 md:mb-10"
        >
          <Link
            href={`/product/${product.handle}`}
            className="relative inline-block h-full w-full"
            prefetch={true}
          >
            <GridTileImage
              alt={product.title}
              label={{
                title: product.title,
                amount: product.priceRange.maxVariantPrice.amount,
                currencyCode: product.priceRange.maxVariantPrice.currencyCode,
              }}
              src={product.featuredImage?.url}
              fill
              sizes="(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
            />
          </Link>
          <div
            className="
            absolute bottom-9 md:bottom-14 left-1/7 md:left-1/2 -translate-x-1/2
            md:opacity-0 md:translate-y-6
            md:group-hover:opacity-100 md:group-hover:translate-y-0
            md:transition-all md:duration-500 md:ease-out"
          >
            <QuickAddToCart product={product} />
          </div>
        </Grid.Item>
      ))}
    </>
  );
}
