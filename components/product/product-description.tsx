import { Product } from "../../lib/shopify/types";
import Price from "../grid/parts/price";
import VariantSelector from "./variant-selector";
import Prose from "../ui/prose";
import { AddToCart } from "../cart/add-to-cart";
import Link from "next/link";
import { GridTileImage } from "../grid/tile";
import { getProducts } from "../../lib/shopify";

export function ProductDescription({ product }: { product: Product }) {
  // const firstVariant = product.variants?.[0];
  // const sku = firstVariant?.sku;
  const firstVariant = product.variants?.[0];
  const netWeight = firstVariant?.weight
    ? `${firstVariant.weight} ${firstVariant.weightUnit}`
    : "";

  const getMetafieldValue = (key: string) => {
    return product.metafields?.find((m) => m?.key === key)?.value || "";
  };

  const ceremonial = getMetafieldValue("ceremonial_type");
  const origin = getMetafieldValue("origin");
  const notes = getMetafieldValue("notes");
  const appellation = getMetafieldValue("appellation");
  const capacity = getMetafieldValue("capacity");
  const medium = getMetafieldValue("medium");
  const size = getMetafieldValue("size");

  const showTopRow = ceremonial || origin || netWeight;
  // --- Kiểm tra sản phẩm có thuộc collection "teaware" ---
  const isTeaware = product.collections?.some(
    (c) => c.handle.toLowerCase() === "teaware"
  );
  return (
    <>
      {isTeaware && product.descriptionHtml ? (
        <div className="px-6 font-text-product-detail flex flex-col md:flex-row items-center md:items-start justify-between md:gap-10">
          <div className="basis-4/6">
            <div className="flex justify-between py-6 md:px-0 border-b border-b-neutral-300">
              <h1 className="text-2xl md:text-4xl font-medium uppercase">
                {product.title}
              </h1>
              <div className="products-price font-medium text-lg text-black">
                <Price
                  amount={product.priceRange.maxVariantPrice.amount}
                  currencyCode={product.priceRange.maxVariantPrice.currencyCode}
                />
              </div>
            </div>
            <div className="py-6 md:px-0 flex justify-between gap-2 md:gap-16 flex-col md:flex-row">
              <div className="basis-4/6">
                {product.descriptionHtml ? (
                  <Prose
                    className="mb-2 text-md leading-light "
                    html={product.descriptionHtml}
                  />
                ) : null}
              </div>
              <div className="text-md text-neutral-700 basis-2/6">
                {medium && (
                  <p className="showTopRow-wrapper">
                    <span className="uppercase text-sm">Medium:</span>
                    <span className="italic">{medium}</span>
                  </p>
                )}
                {origin && (
                  <p className="showTopRow-wrapper">
                    <span className="uppercase text-sm">Origin:</span>
                    <span className="italic">{origin}</span>
                  </p>
                )}
                {size && (
                  <p className="showTopRow-wrapper">
                    <span className="uppercase text-sm">Size:</span>
                    <span className="italic">{size}</span>
                  </p>
                )}
                {capacity && (
                  <p className="showTopRow-wrapper">
                    <span className="uppercase text-sm">Capacity:</span>
                    <span className="italic">{capacity}</span>
                  </p>
                )}
                {netWeight && (
                  <p className="showTopRow-wrapper">
                    <span className="uppercase text-sm">Weight:</span>
                    <span className="italic">{netWeight}</span>
                  </p>
                )}
              </div>
            </div>
            <div>
              <RelatedPRoducts
                currentProduct={product} // sản phẩm hiện tại đang xem
                currentCollectionHandle={product.collections?.[0]?.handle}
                currentMedium={medium}
                currentOrigin={origin}
                // currentSize={size}
              />
            </div>
            <VariantSelector
              options={product.options}
              variants={product.variants}
            />
          </div>
          <div className="basis-2/6 py-6">
            <AddToCart product={product} />
          </div>
        </div>
      ) : (
        <div className="px-6 font-text-product-detail">
          {showTopRow && (
            <div
              className="flex justify-between gap-4 text-md text-neutral-700 border-b border-b-neutral-300 py-3
      border-t border-t-neutral-300 uppercase "
            >
              <p>{ceremonial}</p>
              <p>{origin}</p>
              <p>{netWeight}</p>
            </div>
          )}
          <div className="flex flex-col items-center py-6 ">
            <h1 className="text-2xl md:text-4xl font-medium uppercase">
              {product.title}
            </h1>
          </div>
          <div
            className="flex justify-between text-md text-neutral-700 border-b border-b-neutral-300 py-3
      border-t border-t-neutral-300
      "
          >
            <p>
              <span className="uppercase">Notes:</span> <br />
              <span className="italic">{notes}</span>
            </p>
            <p>
              <span className="uppercase">Appellation:</span> <br />
              <span className="italic">{appellation}</span>
            </p>
          </div>
          <VariantSelector
            options={product.options}
            variants={product.variants}
          />

          <div className="products-price flex items-center justify-center gap-5 py-6 font-medium text-lg text-black">
            <Price
              amount={product.priceRange.maxVariantPrice.amount}
              currencyCode={product.priceRange.maxVariantPrice.currencyCode}
            />
          </div>
          <div className="mb-6">
            <RelatedPRoducts
              currentProduct={product} // sản phẩm hiện tại đang xem
              currentCollectionHandle={product.collections?.[0]?.handle}
              currentMedium={medium}
              currentOrigin={origin}
              // currentSize={size}
            />
          </div>
          <AddToCart product={product} />
        </div>
      )}
    </>
  );
}

async function RelatedPRoducts({
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

  const query = `
    collection_handle:${currentCollectionHandle}
    medium:${currentMedium}
    origin:${currentOrigin}
  `;

  const relatedProducts = await getProducts({ query });
  if (!relatedProducts) return null;

  // Lọc sản phẩm liên quan đúng điều kiện
  const filteredProducts = relatedProducts.filter((p) => {
    const sameCollection = p.collections?.some(
      (c) => c.handle === currentCollectionHandle
    );
    const metafields = p.metafields || [];
    const sameMedium =
      currentMedium &&
      metafields.some((m) => m?.key === "medium" && m.value === currentMedium);
    const sameOrigin =
      currentOrigin &&
      metafields.some((m) => m?.key === "origin" && m.value === currentOrigin);

    return sameCollection && sameMedium && sameOrigin;
  });

  if (filteredProducts.length === 0) return null; //  ẩn luôn nếu không có related product

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  return (
    <div className="md:px-0">
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
                  className="absolute top-20 left-1 right-1 italic
                text-xs text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 py-1 rounded"
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
