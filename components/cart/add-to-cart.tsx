/* eslint-disable prettier/prettier */
"use client";

import { Product, ProductVariant } from "../../lib/shopify/types";
import { useProduct } from "../product/product-context";
import clsx from "clsx";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import { addItem } from "./actions";
import { useCart } from "./cart-context";
import { useActionState, useState } from "react";
import { ShoppingCart } from "lucide-react";

export function SubmitButton({
  availableForSale,
  selectedVariantId,
}: {
  availableForSale: boolean;
  selectedVariantId: string | undefined;
}) {
  const baseClasses =
    "relative text-nowrap flex w-full items-center justify-center rounded-xs cursor-pointer p-4 tracking-wide font-medium overflow-hidden transition-all duration-500";
  const normalClasses =
    "bg-white text-black hover:text-black border border-neutral-200";
  const disabledClasses = "cursor-not-allowed opacity-60 hover:opacity-60";

  // --- Hover animation layer ---
  const hoverEffect =
    "before:absolute before:inset-0 before:bg-gray-200 before:translate-x-[-100%] before:transition-transform before:duration-500 hover:before:translate-x-0 before:z-0";

  // --- Text layer ---
  const textLayer = "relative z-10 flex gap-2 items-center justify-center";

  if (!availableForSale) {
    return (
      <button
        disabled
        className={clsx(baseClasses, normalClasses, disabledClasses)}
      >
        Out of Stock
      </button>
    );
  }

  if (!selectedVariantId) {
    return (
      <button
        aria-label="Please select an option"
        disabled
        className={clsx(baseClasses, normalClasses, disabledClasses)}
      >
        <div className={textLayer}>
          <ShoppingCart className="h-6 md:h-5" />
          <span className="hidden md:inline">Add To Cart</span>
        </div>
      </button>
    );
  }

  return (
    <button
      aria-label="Add to cart"
      className={clsx(baseClasses, normalClasses, hoverEffect)}
    >
      <div className={textLayer}>
        <ShoppingCart className="h-6 md:h-5" />
        <span className="hidden md:inline">Add To Cart</span>
      </div>
    </button>
  );
}

export function AddToCart({
  product,
  purchaseType,
  purchasePrice,
}: {
  product: Product;
  purchaseType?: string;
  purchasePrice?: number;
}) {
  const { variants, availableForSale } = product;
  const { addCartItem } = useCart();
  const { state } = useProduct();
  const [quantity, setQuantity] = useState(1);
  const [message, formAction] = useActionState(addItem, null);

  const variant = variants.find((variant: ProductVariant) =>
    variant.selectedOptions.every(
      (option) => option.value === state[option.name.toLowerCase()]
    )
  );
  const selectedVariantId =
    variant?.id || (variants.length === 1 ? variants[0]?.id : undefined);
  const finalVariant = variants.find((v) => v.id === selectedVariantId);

  // Determine sellingPlanId - if purchaseType is not "oneTime", it's a plan ID
  const sellingPlanId =
    purchaseType && purchaseType !== "oneTime" ? purchaseType : undefined;

  return (
    <form
      action={async () => {
        if (!finalVariant) return;
        addCartItem(
          finalVariant,
          product,
          quantity,
          sellingPlanId,
          purchasePrice
        );
        await formAction({
          selectedVariantId: selectedVariantId!,
          quantity,
          sellingPlanId,
        });
      }}
      className="space-y-3"
    >
      <div className="flex items-center gap-1 md:gap-2 products-price md:px-0 w-full">
        <div className="flex items-center border border-neutral-200 justify-center max-w-[150] rounded-xs">
          <button
            type="button"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            aria-label="Decrease quantity"
            className="px-4 py-5 cursor-pointer 
            transition duration-500 ease-in-out hover:bg-gray-200 hover:text-white rounded-l-xs"
          >
            <MinusIcon className="h-4 w-4" />
          </button>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
            aria-label="Quantity"
            // onWheel={(e) => {
            //   if (document.activeElement === e.currentTarget) e.preventDefault();
            // }}
            // onKeyDown={(e) => {
            //   if (e.key === "ArrowUp" || e.key === "ArrowDown") e.preventDefault();
            // }}

            className="w-14 text-center text-lg"
            min={1}
            max={99}
          />
          <button
            type="button"
            onClick={() => setQuantity(quantity + 1)}
            aria-label="Increase quantity"
            className="px-4 py-5 cursor-pointer 
            transition duration-500 ease-in-out hover:bg-gray-200 hover:text-white rounded-r-xs"
          >
            <PlusIcon className="h-4 w-4" />
          </button>
        </div>

        <SubmitButton
          availableForSale={availableForSale}
          selectedVariantId={selectedVariantId}
        />
      </div>
      <p className="sr-only" role="status" aria-label="polite">
        {message}
      </p>
    </form>
  );
}
