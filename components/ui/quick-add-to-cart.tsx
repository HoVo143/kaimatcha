"use client";

import { useCart } from "../cart/cart-context";
import { useActionState } from "react";
import { addItem } from "../cart/actions";
import clsx from "clsx";
import { Product, ProductVariant } from "../../lib/shopify/types";
import { PackageX, ShoppingCart } from "lucide-react";

export function QuickAddToCart({ product }: { product: Product }) {
  const { addCartItem } = useCart();
  const [message, formAction] = useActionState(addItem, null);

  if (!product) return null;

  // Lấy variant đầu tiên làm mặc định
  const firstVariant: ProductVariant | undefined = product.variants?.[0];
  if (!firstVariant) return null;

  const selectedVariantId = firstVariant?.id;

  const buttonClasses =
    "cursor-pointer relative flex w-full items-center justify-center rounded-full bg-white p-2 md:p-3 tracking-wide text-black text-sm";
  const disabledClasses = "cursor-not-allowed opacity-60 hover:opacity-60";

  if (!product.availableForSale) {
    return (
      <button disabled className={clsx(buttonClasses, disabledClasses)}>
        <PackageX className="h-6 w-6 text-red-500" />
        <span className="hidden md:inline ml-1">Out of Stock</span>
      </button>
    );
  }

  return (
    <form
      action={async () => {
        if (!selectedVariantId || !firstVariant) return;
        addCartItem(firstVariant, product);
        await formAction(selectedVariantId);
      }}
    >
      <button
        aria-label="Add to cart"
        className={clsx(buttonClasses, {
          "hover:opacity-90": product.availableForSale,
        })}
        disabled={!selectedVariantId}
      >

        {/* Text cho desktop */}
        <span className="hidden md:inline">Quick Add</span>

        {/* Icon cho mobile */}
        <ShoppingCart className="block md:hidden h-5 w-5" />
      </button>

      {/* Screen-reader message */}
      <p className="sr-only" role="status" aria-label="polite">
        {message}
      </p>
    </form>
  );
}
