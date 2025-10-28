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
        "absolute bottom-0 left-0 flex w-full md:px-4 md:pb-4 srccontainer/label",
        {
          "lg:px-20 lg:pb-[35%]": position === "center",
        }
      )}
    >
      <div className="products-price py-1 md:py-0 w-full flex items-center flex-col md:flex-row md:rounded-full bg-white/70 font-medium text-[11px] md:text-sm text-black backdrop-blur-md">
        <h3 className="md:mr-4 md:uppercase line-clamp-2 grow md:pl-5 leading-none tracking-tight">
          {title}
        </h3>
        <Price
          className="flex-none rounded-r-full text-black mt-1 md:mt-0 md:p-3 font-bold md:border-l md:border-l-gray-100"
          amount={amount}
          currencyCode={currencyCode}
          currencyCodeClassName="hidden src[275px]/label:inline"
        />
      </div>
    </div>
  );
}