import { CartItem } from "../../lib/shopify/types";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { updateItemQuantity } from "./actions";
import { useActionState } from "react";
import Swal from "sweetalert2";

function SubmitButton({ type }: { type: "plus" | "minus" }) {
  return (
    <button
      type="submit"
      aria-label={
        type === "plus" ? "Increase item quantity" : "Reduce item quantity"
      }
      className={clsx(
        "ease flex h-full min-w-9 cursor-pointer max-w-9 flex-none items-center justify-center rounded-full p-2 transition-all duration-200 hover:border-neutral-800 hover:opacity-80",
        {
          "ml-auto": type === "minus",
        }
      )}
    >
      {type === "plus" ? (
        <PlusIcon className="h-4 w-4 " />
      ) : (
        <MinusIcon className="h-4 w-4 " />
      )}
    </button>
  );
}

export function EditItemQuantityButton({
  item,
  type,
  optimisticUpdate,
}: {
  item: CartItem;
  type: "plus" | "minus";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  optimisticUpdate: any;
}) {
  const [message, formAction] = useActionState(updateItemQuantity, null);
  const payload = {
    merchandiseId: item.merchandise.id,
    quantity: type === "plus" ? item.quantity + 1 : item.quantity - 1,
  };
  const actionWithVariant = formAction.bind(null, payload);

  async function handleUpdate() {
    if (type === "minus" && item.quantity === 1) {
      await Swal.fire({
        title: "Quantity limit",
        text: "You must have at least one item in your cart. To remove it, please use the delete button instead.",
        background: `
          linear-gradient(rgb(0 0 0 / 58%), rgb(0 0 0 / 58%)),
          url("https://cdn.shopify.com/s/files/1/0682/6636/0920/files/12.png?v=1761022125")
          center / cover no-repeat
        `,
        confirmButtonText: "OK",
        confirmButtonColor: "#6a994e", // matcha green tone
      });
      return;
    }

    optimisticUpdate(payload.merchandiseId, type);
    await actionWithVariant();
  }

  return (
    <form action={handleUpdate}>
      <SubmitButton type={type} />
      <p aria-label="polite" className="sr-only" role="status">
        {message}
      </p>
    </form>
  );
}
