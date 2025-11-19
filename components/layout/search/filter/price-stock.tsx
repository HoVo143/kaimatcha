// /components/layout/search/filter/price-stock-client.tsx
"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function FilterPriceStockClient({
  onFilterStart,
}: {
  onFilterStart?: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [stock, setStock] = useState(""); // "in" | "out" | ""

  // Khi URL thay đổi, cập nhật state form
  useEffect(() => {
    setMinPrice(searchParams.get("price_min") || "");
    setMaxPrice(searchParams.get("price_max") || "");
    setStock(searchParams.get("stock") || "");
    // }, [searchParams?.toString()]);
  }, [searchParams]);

  // const applyFilters = (useReplace = false) => {
  const applyFilters = () => {
    // Lấy param hiện tại (giữ các param khác như q, sort nếu muốn)
    const params = new URLSearchParams(searchParams?.toString() || "");

    if (minPrice) params.set("price_min", String(minPrice));
    else params.delete("price_min");

    if (maxPrice) params.set("price_max", String(maxPrice));
    else params.delete("price_max");

    if (stock) params.set("stock", stock);
    else params.delete("stock");

    // const qs = params.toString();
    // const to = qs ? `${pathname}?${qs}` : pathname;

    // if (useReplace) router.replace(to);
    // else router.push(to);

    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname);
  };

  // Tự động apply
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      applyFilters();
    }, 400); // đợi 0.4s

    return () => clearTimeout(delayDebounce);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minPrice, maxPrice, stock]);

  // Khi user đổi filter → bật loading NGAY
  const handleChangeMin = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterStart?.(); // bật loading ngay lập tức
    setMinPrice(e.target.value.replace(/[^0-9]/g, ""));
  };

  const handleChangeMax = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterStart?.();
    setMaxPrice(e.target.value.replace(/[^0-9]/g, ""));
  };

  const handleChangeStock = (value: string) => {
    onFilterStart?.();
    setStock(value);
  };

  const clearFilters = () => {
    onFilterStart?.();
    setMinPrice("");
    setMaxPrice("");
    setStock("");
    const params = new URLSearchParams(searchParams?.toString() || "");
    params.delete("price_min");
    params.delete("price_max");
    params.delete("stock");
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  };

  // Chỉ show nút Clear khi có ít nhất 1 filter đang dùng
  const hasFilters = useMemo(() => {
    return minPrice !== "" || maxPrice !== "" || stock !== "";
  }, [minPrice, maxPrice, stock]);

  return (
    <div className="flex flex-col gap-4 text-sm text-black">
      <div>
        <h3 className="mb-2 text-xs text-neutral-500 uppercase tracking-wide">
          Stock status
        </h3>
        <div className="flex md:flex-col gap-6 md:gap-2">
          {[
            { label: "In stock", value: "in" },
            { label: "Out of stock", value: "out" },
            { label: "All", value: "" },
          ].map((item) => (
            <label
              key={item.value || "all"}
              onClick={() => handleChangeStock(item.value)}
              className="flex items-center gap-2 cursor-pointer select-none"
            >
              <span
                className={`
          flex items-center justify-center h-5 w-5 rounded-sm border transition-all duration-200
          ${stock === item.value ? "border-gray-500" : "border-gray-400"}
        `}
              >
                <span
                  className={`
            h-3.5 w-3.5 rounded-sm transition-all duration-200
            ${stock === item.value ? "bg-green-700" : "bg-transparent"}
          `}
                />
              </span>
              <span
                className={`text-sm ${
                  stock === item.value
                    ? "text-black font-medium"
                    : "text-gray-600"
                }`}
              >
                {item.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-xs text-neutral-500 uppercase tracking-wide">
          Price range
        </h3>
        {/* --- SLIDER --- */}
        <div className="relative w-full h-5 mt-2 mb-3">
          <div className="absolute top-1/2 left-0 w-full h-[3px] bg-gray-200 rounded"></div>
          <div
            className="absolute top-1/2 h-[3px] bg-emerald-950 rounded"
            style={{
              left: `${(Number(minPrice || 0) / 500) * 100}%`,
              right: `${100 - (Number(maxPrice || 500) / 500) * 100}%`,
            }}
          ></div>

          <input
            type="range"
            min={0}
            max={500}
            step={1}
            value={minPrice || 0}
            onChange={(e) => {
              onFilterStart?.();
              const val = Math.min(
                Number(e.target.value),
                Number(maxPrice) - 1
              );
              setMinPrice(val.toString());
            }}
            aria-label="Minimum price"
            className="absolute w-full h-5 appearance-none bg-transparent pointer-events-none
             [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full
               [&::-webkit-slider-thumb]:bg-emerald-950 cursor-pointer"
          />

          <input
            type="range"
            min={0}
            max={500}
            step={1}
            value={maxPrice || 500}
            onChange={(e) => {
              onFilterStart?.();
              const val = Math.max(
                Number(e.target.value),
                Number(minPrice) + 1
              );
              setMaxPrice(val.toString());
            }}
            aria-label="Maximum price"
            className="absolute w-full h-5 appearance-none bg-transparent pointer-events-none
             [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full
               [&::-webkit-slider-thumb]:bg-emerald-950 cursor-pointer"
          />
        </div>

        {/* --- INPUT FIELDS --- */}
        <div className="flex items-center gap-2">
          <input
            type="number"
            inputMode="numeric"
            min={0}
            placeholder="Min"
            value={minPrice}
            onChange={handleChangeMin}
            // onChange={(e) => setMinPrice(e.target.value.replace(/[^0-9]/g, ""))}
            className="w-1/2 rounded border border-black/30 px-2 py-1 text-sm"
          />
          <span>–</span>
          <input
            type="number"
            inputMode="numeric"
            min={0}
            placeholder="Max"
            onChange={handleChangeMax}
            value={maxPrice}
            // onChange={(e) => setMaxPrice(e.target.value.replace(/[^0-9]/g, ""))}
            className="w-1/2 rounded border border-black/30 px-2 py-1 text-sm"
          />
        </div>
        <div className="flex gap-2 mt-2 w-full">
          {/* <button
            onClick={() => applyFilters(false)}
            className="rounded bg-black text-white px-3 py-1 text-xs hover:bg-neutral-800"
          >
            Apply
          </button> */}
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="rounded w-full hover:bg-black hover:text-white border border-black/30 px-3 py-1 text-xs cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
