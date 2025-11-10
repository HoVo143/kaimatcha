import { Product } from "../../lib/shopify/types";
import Price from "../grid/parts/price";
import VariantSelector from "./variant-selector";
import Prose from "../ui/prose";
import { AddToCart } from "../cart/add-to-cart";
import Link from "next/link";
import { GridTileImage } from "../grid/tile";
import { getProductRecommendations } from "../../lib/shopify";

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
              {showTopRow && (
                <div className="text-md text-neutral-700 basis-2/6">
                  <p className="showTopRow-wrapper">
                    <span className="uppercase text-sm">medium:</span>
                    <span className="italic">{medium}</span>
                  </p>
                  <p className="showTopRow-wrapper">
                    <span className="uppercase text-sm">origin:</span>
                    <span className="italic">{origin}</span>
                  </p>
                  <p className="showTopRow-wrapper">
                    <span className="uppercase text-sm">Size:</span>
                    <span className="italic">{size}</span>
                  </p>
                  <p className="showTopRow-wrapper">
                    <span className="uppercase text-sm">capacity:</span>
                    <span className="italic"> {capacity}</span>
                  </p>
                  <p className="showTopRow-wrapper">
                    <span className="uppercase text-sm">Weight:</span>
                    <span className="italic">{netWeight}</span>
                  </p>
                </div>
              )}
            </div>
            <div>
              <RelatedPRoducts
                currentProduct={product} // sản phẩm hiện tại đang xem
                currentCollectionHandle={product.collections?.[0]?.handle}
                currentMedium={medium}
                currentOrigin={origin}
                currentSize={size}
              />
            </div>
            <VariantSelector
              options={product.options}
              variants={product.variants}
            />
          </div>
          <div className="basis-2/6">
            <AddToCart product={product} />
          </div>
        </div>
      ) : (
        <div className="font-text-product-detail">
          {showTopRow && (
            <div
              className="flex justify-between text-md text-neutral-700 border-b border-b-neutral-300 py-3
      border-t border-t-neutral-300 uppercase"
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

            {/* <div className="border-t border-t-neutral-300 mt-3 pt-3">
          {product.collections && product.collections?.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2 text-sm text-neutral-600">
              <span className="font-medium text-neutral-700">Collections:</span>
              {product.collections.map((c) => (
                <Link
                  key={c.id}
                  href={`/collections/${c.handle}`}
                  className="text-emerald-700 hover:underline"
                >
                  {c.title}
                </Link>
              ))}
            </div>
          )}
        </div> */}
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
          {/* {product.descriptionHtml ? (
        <Prose
          className="mb-6 text-sm leading-light "
          html={product.descriptionHtml}
        />
      ) : null} */}
          <div className="products-price flex items-center justify-center gap-5 py-6 font-medium text-lg text-black">
            <Price
              amount={product.priceRange.maxVariantPrice.amount}
              currencyCode={product.priceRange.maxVariantPrice.currencyCode}
            />
            {/* <div>
            {sku && (
              <span className="text-lg font-normal text-neutral-500">
                SKU: {sku}
              </span>
            )}
          </div> */}
          </div>
          <div className="mb-6">
            <RelatedPRoducts
              currentProduct={product} // sản phẩm hiện tại đang xem
              currentCollectionHandle={product.collections?.[0]?.handle}
              currentMedium={medium}
              currentOrigin={origin}
              currentSize={size}
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
  currentSize,
}: {
  currentProduct: Product;
  currentCollectionHandle?: string;
  currentMedium?: string;
  currentOrigin?: string;
  currentSize?: string;
}) {
  const relatedProducts = await getProductRecommendations(currentProduct.id);

  if (!relatedProducts || !currentCollectionHandle) return null;

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
    const sameSize =
      currentSize &&
      metafields.some((m) => m?.key === "size" && m.value === currentSize);

    return sameCollection && sameMedium && sameOrigin && sameSize;
  });
  // .slice(0, 4); // Lấy tối đa 4 sản phẩm liên quan

  // Thêm luôn sản phẩm hiện tại vào đầu danh sách
  const finalProducts = [currentProduct, ...filteredProducts];

  // const colClasses: Record<number, string> = {
  //   6: "grid-cols-6",
  //   7: "grid-cols-7",
  //   8: "grid-cols-8",
  //   9: "grid-cols-9",
  //   10: "grid-cols-10",
  // };

  // const cols = finalProducts.length;
  // const gridClass = colClasses[cols] || "grid-cols-6";

  return (
    <div className="md:px-0">
      <ul
        className="grid grid-cols-6 max-w-[450px]"
        style={
          finalProducts.length > 6
            ? {
                gridTemplateColumns: `repeat(${finalProducts.length}, minmax(0, 1fr))`,
              }
            : undefined
        }
      >
        {finalProducts.map((product) => (
          <li
            key={product.handle}
            className="aspect-square flex-1 relative group mb-2"
          >
            <Link
              className="relative h-full w-full"
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
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
