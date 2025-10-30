import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";

export default function OpenCart({
  className,
  quantity,
}: {
  className?: string;
  quantity?: number;
}) {
  return (
    <div className="relative flex h-9 w-10 md:h-11 md:w-11 items-center justify-center  transition-colors cursor-pointer">
      <ShoppingCartIcon
        id="cart-icon"
        className={clsx(
          "h-6 hover:scale-110 hover:text-emerald-600",
          className
        )}
      />

      {quantity ? (
        <div className="absolute right-0 top-0 mr-0 h-4 w-4 rounded bg-emerald-600 text-[11px] font-medium text-white cursor-pointer">
          {quantity}
        </div>
      ) : null}
    </div>
  );
}
