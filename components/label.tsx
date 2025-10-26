import clsx from "clsx";
import Price from "./price";

export default function Label({
  title,
  amount,
  currencyCode,
  position = "bottom",
}: {
  title: string;
  amount: string;
  currencyCode: string;
  position?: "bottom" | "center";
}) {
  return (
    <div
      className={clsx(
        "absolute bottom-0 left-0 flex w-full px-4 pb-4 srccontainer/label",
        {
          "lg:px-20 lg:pb-[35%]": position === "center",
        }
      )}
    >
      <div className="products-price flex items-center rounded-full bg-white/70 font-medium text-[10px] md:text-sm text-black backdrop-blur-md">
        <h3 className="mr-4 md:uppercase line-clamp-2 grow pl-5 leading-none tracking-tight">
          {title}
        </h3>
        <Price
          className="flex-none rounded-r-full text-black p-3 font-bold border-l border-l-gray-100"
          amount={amount}
          currencyCode={currencyCode}
          currencyCodeClassName="hidden src[275px]/label:inline"
        />
      </div>
    </div>
  );
}