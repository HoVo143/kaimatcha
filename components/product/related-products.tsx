/* eslint-disable prettier/prettier */
import { getProducts } from "../../lib/shopify";
import { Product } from "../../lib/shopify/types";
import Link from "next/link";
import { GridTileImage } from "../grid/tile";

export async function RelatedProducts({
  currentProduct,
  currentCollectionHandle,
  currentMedium,
  currentOrigin,
}: {
  currentProduct: Product;
  currentCollectionHandle?: string;
  currentMedium?: string;
  currentOrigin?: string;
}) {
  if (!currentCollectionHandle) return null;

  const isMatcha = currentCollectionHandle.toLowerCase() === "matcha";

  const query = isMatcha
    ? `collection_handle:${currentCollectionHandle}`
    : `
      collection_handle:${currentCollectionHandle}
      medium:${currentMedium}
      origin:${currentOrigin}
    `;

  const relatedProducts = await getProducts({ query });
  if (!relatedProducts) return null;

  let filteredProducts = [];

  if (isMatcha) {
    filteredProducts = relatedProducts.filter((p) =>
      p.collections?.some((c) => c.handle.toLowerCase() === "matcha")
    );
  } else {
    // Lọc sản phẩm liên quan đúng điều kiện
    filteredProducts = relatedProducts.filter((p) => {
      const sameCollection = p.collections?.some(
        (c) => c.handle === currentCollectionHandle
      );
      const metafields = p.metafields || [];
      const sameMedium =
        currentMedium &&
        metafields.some(
          (m) => m?.key === "medium" && m.value === currentMedium
        );
      const sameOrigin =
        currentOrigin &&
        metafields.some(
          (m) => m?.key === "origin" && m.value === currentOrigin
        );

      return sameCollection && sameMedium && sameOrigin;
    });
  }
  if (filteredProducts.length === 0) return null; //  ẩn luôn nếu không có related product

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  return (
    <div className="px-6 py-3">
      <ul
        className="grid grid-cols-7 max-w-[550px]"
        style={
          filteredProducts.length > 6
            ? {
                gridTemplateColumns: `repeat(${filteredProducts.length}, minmax(0, 1fr))`,
              }
            : undefined
        }
      >
        {filteredProducts.map((product, index) => {
          const isActive = product.id === currentProduct.id;
          const isOutOfStock = !product.availableForSale;
          const size =
            product.metafields?.find((m) => m?.key === "size")?.value || "";

          return (
            <li
              key={product.id}
              className={`aspect-square flex-1 relative group mb-2 ${isActive ? "border" : ""}`}
            >
              <Link
                className={`relative h-full w-full block ${
                  isActive ? "opacity-100" : "opacity-80 hover:opacity-100"
                }`}
                href={`/product/${product.handle}`}
                prefetch={true}
              >
                <GridTileImage
                  alt={product.title}
                  src={product.featuredImage?.url}
                  fill
                  sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, (min-width: 475px) 50vw, 100vw"
                  hideLabel={true}
                />
                {/* Overlay đường chéo nếu out of stock */}
                {isOutOfStock && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="absolute w-full h-full bg-black/20"></div>
                    <div className="absolute w-0.5 h-full bg-gray-300 rotate-45"></div>
                  </div>
                )}

                {/* Text hover: Thứ tự + size */}
                <div
                  className={`absolute ${
                    isMatcha ? "top-18" : "top-20"
                  } text-nowrap left-1 right-1 italic text-md text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 py-1 rounded`}
                >
                  {alphabet[index] || index + 1} {size}
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
