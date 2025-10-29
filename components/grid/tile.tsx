/* eslint-disable jsx-a11y/alt-text */
import clsx from "clsx";
import Image from "next/image";
import Label from "./parts/label";

export function GridTileImage({
  isInteractive = true,
  active,
  label,
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
} & React.ComponentProps<typeof Image>) {
  return (
    <>
      <div
       className={clsx(
        "group relative overflow-hidden flex flex-col h-full w-full items-center justify-center rounded-lg bg-white",
          {
            "border-3 border-emerald-600 bg-white": active, // border nổi bật khi active
            "border border-transparent": !active, // border trong suốt khi không active
          }
      )}
      >
        {props.src ? (
          <>
            <Image
              className={clsx(" h-full w-full object-contain", {
                "transition duration-300 ease-in-out group-hover:scale-105":
                  isInteractive,
              })}
              {...props}
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
          </>
        ) : null}

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