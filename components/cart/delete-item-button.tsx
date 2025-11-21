"use client";
import { CartItem } from "../../lib/shopify/types";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { removeItem } from "./actions";
import { useActionState, useTransition } from "react";
import Swal from "sweetalert2";

export function DeleteItemButton({
  item,
  optimisticUpdate,
  variant = "icon",
}: {
  item: CartItem;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  optimisticUpdate: any;
  variant?: "icon" | "text";
}) {
  const [message, formAction] = useActionState(removeItem, null);
  const merchandiseId = item.merchandise.id;
  const actionWithVariant = formAction.bind(null, merchandiseId);
  const [isPending, startTransition] = useTransition();

  async function handleDelete() {
    const result = await Swal.fire({
      title: "Remove item?",
      text: `Do you want to remove "${item.merchandise.product.title}" from your cart?`,
      background: `
        linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)),
        url("https://cdn.shopify.com/s/files/1/0682/6636/0920/files/Kai_Matcha_Brand_Identity_System_1.jpg?v=1762323474")
        center / cover no-repeat
      `,
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, remove it",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      customClass: {
        title: "text-lg font-semibold text-white",
      },
    });

    if (!result.isConfirmed) return;

    optimisticUpdate(merchandiseId, "delete");
    // await actionWithVariant();

    startTransition(() => {
      actionWithVariant();
    });

    Swal.fire({
      background: `
        linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)),
        url("https://cdn.shopify.com/s/files/1/0682/6636/0920/files/Kai_Matcha_Brand_Identity_System_1.jpg?v=1762323474")
        center / cover no-repeat
      `,
      icon: "success",
      title: "Removed!",
      text: `"${item.merchandise.product.title}" has been removed.`,
      showConfirmButton: false,
      timer: 1200,
    });
  }

  return (
    <form action={handleDelete}>
      <button
        type="submit"
        aria-label="Remove cart item"
        disabled={isPending}
        className={
          variant === "text"
            ? "text-xs cursor-pointer text-neutral-500 hover:text-neutral-700 transition-colors disabled:opacity-50"
            : "flex h-6 w-6 items-center justify-center rounded-full bg-red-600 cursor-pointer disabled:opacity-50"
        }
      >
        {variant === "text" ? (
          "REMOVE"
        ) : (
          <XMarkIcon className="mx-px h-4 w-4 text-white " />
        )}
      </button>
      <p aria-live="polite" className="sr-only" role="status">
        {message}
      </p>
    </form>
  );
}
