"use client";

import { Product, ProductVariant } from "../../lib/shopify/types";
import { useProduct } from "../product/product-context";
import clsx from "clsx";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import { addItem } from "./actions";
import { useCart } from "./cart-context";
import { useActionState, useState } from "react";
import { ShoppingCart } from "lucide-react";

function SubmitButton({
  availableForSale,
  selectedVariantId,
}: {
  availableForSale: boolean;
  selectedVariantId: string | undefined;
}) {
  const buttonClasses =
    "relative flex w-full items-center justify-center rounded-md bg-black hover:bg-black/85 cursor-pointer p-4 tracking-wide text-white";
  const disabledClasses = "cursor-not-allowed opacity-60 hover:opacity-60";

  if (!availableForSale) {
    return (
      <button disabled className={clsx(buttonClasses, disabledClasses)}>
        Out of Stock
      </button>
    );
  }

  if (!selectedVariantId) {
    return (
      <button
        aria-label="Please select an option"
        disabled
        className={clsx(buttonClasses, disabledClasses)}
      >
        <div className="flex gap-2 items-center justify-center">
          <ShoppingCart className="h-5" />
          Add To Cart
        </div>
      </button>
    );
  }

  return (
    <button
      aria-label="Add to cart"
      className={clsx(buttonClasses, {
        "hover:opacity-90": true,
      })}
    >
      <div className="flex gap-2 items-center justify-center">
        <ShoppingCart className="h-5" />
        Add To Cart
      </div>
    </button>
  );
}

export function AddToCart({ product }: { product: Product }) {
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
  const finalVariant = variants.find(
    (v) => v.id === selectedVariantId
  );

  return (
    <form
      action={async () => {
        if (!finalVariant) return;
        addCartItem(finalVariant, product, quantity);
        await formAction(selectedVariantId);
      }}
      className="space-y-3"
    >
      <div className="flex items-center border border-neutral-200 justify-center max-w-[150] p-auto rounded-md">
        <button
          type="button"
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          className="w-full px-4 py-3 cursor-pointer 
          transition duration-500 ease-in-out hover:bg-black hover:text-white rounded-l-md"
        >
          <MinusIcon className="h-4 w-4" />
        </button>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
          // onWheel={(e) => {
          //   if (document.activeElement === e.currentTarget) e.preventDefault();
          // }}
          // onKeyDown={(e) => {
          //   if (e.key === "ArrowUp" || e.key === "ArrowDown") e.preventDefault();
          // }}

          className="w-14 text-center"
          min={1}
          max={99}
        />
        <button
          type="button"
          onClick={() => setQuantity(quantity + 1)}
          className="w-full px-4 py-3 cursor-pointer 
          transition duration-500 ease-in-out hover:bg-black hover:text-white rounded-r-md"
        >
          <PlusIcon className="h-4 w-4" />
        </button>
      </div>

      <SubmitButton
        availableForSale={availableForSale}
        selectedVariantId={selectedVariantId}
      />
      <p className="sr-only" role="status" aria-label="polite">
        {message}
      </p>
    </form>
  );
}