"use client";
import { CartItem } from "../../lib/shopify/types";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { removeItem } from "./actions";
import { useActionState } from "react";
import Swal from "sweetalert2";

export function DeleteItemButton({
  item,
  optimisticUpdate,
}: {
  item: CartItem;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  optimisticUpdate: any;
}) {
  const [message, formAction] = useActionState(removeItem, null);
  const merchandiseId = item.merchandise.id;
  const actionWithVariant = formAction.bind(null, merchandiseId);

  
  async function handleDelete() {
    const result = await Swal.fire({
      title: "Remove item?",
      text: `Do you want to remove "${item.merchandise.product.title}" from your cart?`,
      icon: "warning",
      background: `
        linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)),
        url("https://cdn.shopify.com/s/files/1/0682/6636/0920/files/14.png?v=1761554661")
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
    await actionWithVariant();

    Swal.fire({
      background: `
        linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)),
        url("https://cdn.shopify.com/s/files/1/0682/6636/0920/files/banner_14.png?v=1761554025")
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
    <form
     action={handleDelete}
    >
      <button
        type="submit"
        aria-label="Remove cart item"
        className="flex h-6 w-6 items-center justify-center rounded-full bg-red-600 cursor-pointer"
      >
        <XMarkIcon className="mx-px h-4 w-4 text-white " />
      </button>
      <p aria-live="polite" className="sr-only" role="status">
        {message}
      </p>
    </form>
  );
}