import clsx from "clsx";

const Price = ({
  amount,
  className,
  currencyCode = "USD",
  showCurrencyCode = false, // ✅ Thêm tuỳ chọn để ẩn/hiện
  currencyCodeClassName,
}: {
  amount: string;
  className?: string;
  currencyCode?: string;
  showCurrencyCode?: boolean;
  currencyCodeClassName?: string;
} & React.ComponentProps<"p">) => {
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
    currencyDisplay: "narrowSymbol",
    minimumFractionDigits: 2,
  }).format(parseFloat(amount));

  return (
    <p suppressHydrationWarning className={className}>
      {formatted}
      {showCurrencyCode && (
        <span className={clsx("ml-1 inline", currencyCodeClassName)}>
          {currencyCode}
        </span>
      )}
    </p>
  );
};

export default Price;

// import clsx from "clsx";

// const Price = ({
//   amount,
//   className,
//   currencyCode = "USD",
//   currencyCodeClassName,
// }: {
//   amount: string;
//   className?: string;
//   currencyCode: string;
//   currencyCodeClassName?: string;
// } & React.ComponentProps<"p">) => (
//   <p suppressHydrationWarning={true} className={className}>
//     {`${new Intl.NumberFormat(undefined, {
//       style: "currency",
//       currency: currencyCode,
//       currencyDisplay: "narrowSymbol",
//     }).format(parseFloat(amount))}`}
//     <span
//       className={clsx("ml-1 inline", currencyCodeClassName)}
//     >{`${currencyCode}`}</span>
//   </p>
// );

// export default Price;