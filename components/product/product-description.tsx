import { Product } from "../../lib/shopify/types";
import Price from "../grid/parts/price";
import VariantSelector from "./variant-selector";
import Prose from "../ui/prose";
import { AddToCart } from "../cart/add-to-cart";
import Link from "next/link";

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

  const showTopRow = ceremonial || origin || netWeight;

  return (
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
      <VariantSelector options={product.options} variants={product.variants} />
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
      <AddToCart product={product} />
    </div>
  );
}
