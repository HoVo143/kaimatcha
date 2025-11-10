/* eslint-disable @next/next/no-img-element */
import { QuickAddToCart } from "../../../components/ui/quick-add-to-cart";
import { GridTileImage } from "../../../components/grid/tile";
import Gallery from "../../../components/product/gallery";
import { ProductProvider } from "../../../components/product/product-context";
import { ProductDescription } from "../../../components/product/product-description";
import { HIDDEN_PRODUCT_TAG } from "../../../lib/constants";
import { getProduct, getProductRecommendations } from "../../../lib/shopify";
import { Image } from "../../../lib/shopify/types";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export async function generateMetadata({
  params,
}: {
  params: { handle: string };
}): Promise<Metadata> {
  const { handle } = await Promise.resolve(params);
  if (!handle) return notFound();

  const product = await getProduct(handle);

  if (!product) return notFound();

  const { url, width, height, altText: alt } = product.featuredImage || {};
  const indexable = !product.tags.includes(HIDDEN_PRODUCT_TAG);

  return {
    title: product.seo.title || product.title,
    description: product.seo.description || product.description,
    robots: {
      index: indexable,
      follow: indexable,
      googleBot: {
        index: indexable,
        follow: indexable,
      },
    },
    openGraph: url
      ? {
          images: [
            {
              url,
              width,
              height,
              alt,
            },
          ],
        }
      : null,
  };
}

export default async function ProductPage({
  params,
}: {
  params: { handle: string };
}) {
  const { handle } = await Promise.resolve(params);
  if (!handle) return notFound();

  const product = await getProduct(handle);
  if (!product) return notFound();
  return (
    <ProductProvider>
      <div className="mx-auto">
        {/* <div className="mx-auto max-w-screen-2xl px-4"> */}
        <div className="flex flex-col items-center lg:gap-8 ">
          {/* <div className="h-full w-full basis-full lg:basis-4/6"> */}
          <div className="h-full w-full">
            <Suspense
              fallback={
                <div className="relative aspect-square h-full max-h-[550px] w-full overflow-hidden" />
              }
            >
              <Gallery
                images={product.images.slice(0, 8).map((image: Image) => ({
                  src: image.url,
                  altText: image.altText,
                }))}
              />
            </Suspense>
          </div>
          {/* <div className="basis-full lg:basis-2/6"> */}
          <div className="w-full max-w-[550px]">
            <Suspense fallback={null}>
              <ProductDescription product={product} />
            </Suspense>
          </div>
        </div>
        {/* <RelatedPRoducts id={product.id} /> */}
        {/* hr */}
        <div className="flex max-w-[250] m-auto items-center justify-center my-8">
          <div className="grow border-t border-gray-500"></div>
          <img
            className="w-12 h-12 mx-1"
            src="https://cdn.shopify.com/s/files/1/0682/6636/0920/files/Symbol-Logo-Hr.png?v=1761278683"
            alt="Hr"
          />
          <div className="grow border-t border-gray-500"></div>
        </div>
      </div>
    </ProductProvider>
  );
}

async function RelatedPRoducts({ id }: { id: string }) {
  const relatedProducts = await getProductRecommendations(id);

  if (!relatedProducts) return null;

  return (
    <div className="pt-8 md:p-12 lg:gap-8 ">
      <h2 className="mb-4 text-3xl font-medium">Related Products</h2>
      <ul className="flex w-full gap-4 overflow-x-auto pt-1">
        {relatedProducts.map((product) => (
          <li
            key={product.handle}
            className="aspect-square w-full flex-none min-[475px]:w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 relative group mb-8 md:mb-10"
          >
            <Link
              className="relative h-full w-full"
              href={`/product/${product.handle}`}
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
                sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, (min-width: 475px) 50vw, 100vw"
              />
            </Link>
            <div
              className="
                absolute bottom-15 md:bottom-18 left-6 md:left-1/2 -translate-x-1/2
                md:opacity-0 md:translate-y-6
                md:group-hover:opacity-100 md:group-hover:translate-y-0
                md:transition-all md:duration-500 md:ease-out"
            >
              <QuickAddToCart product={product} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
