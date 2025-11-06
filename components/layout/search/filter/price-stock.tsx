// /components/layout/search/filter/price-stock-client.tsx
"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function FilterPriceStockClient() {
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

  const clearFilters = () => {
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
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="stock"
              value="in"
              checked={stock === "in"}
              onChange={(e) => setStock(e.target.value)}
            />
            <span>In stock</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="stock"
              value="out"
              checked={stock === "out"}
              onChange={(e) => setStock(e.target.value)}
            />
            <span>Out of stock</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="stock"
              value=""
              checked={stock === ""}
              onChange={() => setStock("")}
            />
            <span>All</span>
          </label>
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-xs text-neutral-500 uppercase tracking-wide">
          Price range
        </h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            inputMode="numeric"
            min={0}
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value.replace(/[^0-9]/g, ""))}
            className="w-1/2 rounded border border-black/30 px-2 py-1 text-sm"
          />
          <span>–</span>
          <input
            type="number"
            inputMode="numeric"
            min={0}
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value.replace(/[^0-9]/g, ""))}
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
              className="rounded w-full border border-black/30 px-3 py-1 text-xs"
            >
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
