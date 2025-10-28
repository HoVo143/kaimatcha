/* eslint-disable jsx-a11y/alt-text */
import clsx from "clsx";
import Image from "next/image";
import Label from "../label";
// import { Product } from "../../lib/shopify/types";

export function GridTileImage({
  isInteractive = true,
  active,
  label,
  // product,
  ...props
}: {
  isInteractive?: boolean;
  active?: boolean;
  label?: {
    title: string;
    amount: string;
    currencyCode: string;
    position?: "bottom" | "center";
  };
  // product: Product;
} & React.ComponentProps<typeof Image>) {
  return (
    <>
      <div
       className={clsx(
        "group relative overflow-hidden flex flex-col h-full w-full items-center justify-center rounded-lg"
      )}
      >
        {props.src ? (
          <>
            <Image
              className={clsx(" h-full w-full object-contain ", {
                "transition duration-300 ease-in-out group-hover:scale-105":
                  isInteractive,
              })}
              {...props}
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
          </>
        ) : null}
        {/* <div
            className="
            absolute bottom-2 md:bottom-4 left-1/5 md:left-1/2 -translate-x-1/2
            md:opacity-0 md:translate-y-6
            md:group-hover:opacity-100 md:group-hover:translate-y-0
            md:transition-all md:duration-500 md:ease-out"
        >
            <QuickAddToCart  product={product} />
        </div> */}
      </div>
                     
      {label ? (
        <Label
          title={label.title}
          amount={label.amount}
          currencyCode={label.currencyCode}
          // position={label.position}
        />
      ) : null}
    </>
  );
}