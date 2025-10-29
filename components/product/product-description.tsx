import { Product } from "../../lib/shopify/types";
import Price from "../price";
import VariantSelector from "./variant-selector";
import Prose from "../prose";
import { AddToCart } from "../cart/add-to-cart";
import Link from "next/link";

export function ProductDescription({ product }: { product: Product }) {
  const firstVariant = product.variants?.[0];
  const sku = firstVariant?.sku;

  return (
    <>
      <div className="mb-6 flex flex-col border-b border-b-neutral-300 pb-6 ">
        <h1 className="mb-3 text-2xl md:text-4xl font-medium capitalize">{product.title}</h1>
        
        <div className="flex items-center justify-start gap-5">
          <div className="font-bold text-lg text-emerald-800">
            <Price
              amount={product.priceRange.maxVariantPrice.amount}
              currencyCode={product.priceRange.maxVariantPrice.currencyCode}
            />
          </div>
          <div>
            {sku && (
              <span className="text-lg font-normal text-neutral-500">
                SKU: {sku}
              </span>
            )}          
          </div>            
        </div>    
        <div className="border-t border-t-neutral-300 mt-3 pt-3">
          {product.collections && product.collections?.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2 text-sm text-neutral-600">
              <span className="font-medium text-neutral-700">Collections:</span>
              {product.collections.map((c) => (
                <Link
                  key={c.id}
                  href={`/search/${c.handle}`}
                  className="text-emerald-700 hover:underline"
                >
                  {c.title}
                </Link>
              ))}
            </div>
          )}          
        </div>

      </div>
      <VariantSelector options={product.options} variants={product.variants} />
      {product.descriptionHtml ? (
        <Prose
          className="mb-6 text-sm leading-light "
          html={product.descriptionHtml}
        />
      ) : null}
      <AddToCart product={product} />
    </>
  );
}