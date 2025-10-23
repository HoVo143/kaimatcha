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
    <div className="relative pb-3 flex h-11 w-11 items-center justify-center text-white transition-colors cursor-pointer">
      <ShoppingCartIcon
        className={clsx(
          "h-6 transition-all ease-in-out hover:scale-110",
          className
        )}
      />

      {quantity ? (
        <div className="absolute right-0 top-0 mr-0 -mt-1 h-4 w-4 rounded bg-emerald-600 text-[11px] font-medium text-white cursor-pointer">
          {quantity}
        </div>
      ) : null}
    </div>
  );
}