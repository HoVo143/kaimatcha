"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { ListItem, type PathFilterItem } from ".";
import Link from "next/link";
import { createUrl } from "../../../../lib/utils";
import type { SortFilterItem } from "../../../../lib/constants";
import clsx from "clsx";

function PathFilterItem({ item }: { item: PathFilterItem }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const active = pathname === item.path;
  const newParams = new URLSearchParams(searchParams.toString());
  const DynamicTag = active ? "p" : Link;

  newParams.delete("q");

  return (
    <li className="mt-2 flex text-black " key={item.title}>
      <DynamicTag
        href={createUrl(item.path, newParams)}
        className={clsx("w-full text-sm underline-offset-4 hover:underline ", {
          "underline underline-offset-4": active,
        })}
      >
        {item.title}
      </DynamicTag>
    </li>
  );
}

function SortFilterItem({
  item,
  onFilterStart,
}: {
  item: SortFilterItem;
  onFilterStart?: () => void;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const active = searchParams.get("sort") === item.slug;
  const q = searchParams.get("q");

  // const href = createUrl(
  //   pathname,
  //   new URLSearchParams({
  //     ...(q && { q }),
  //     ...(item.slug && item.slug.length && { sort: item.slug }),
  //   })
  // );
  // Lấy toàn bộ query hiện có, rồi chỉ thay sort
  const newParams = new URLSearchParams(searchParams.toString());

  // Giữ lại tất cả param khác (price_min, price_max, stock, q)
  if (item.slug && item.slug.length) newParams.set("sort", item.slug);
  else newParams.delete("sort");

  const href = createUrl(pathname, newParams);
  const DynamicTag = active ? "p" : Link;

  return (
    <li className="mt-2 flex text-sm md:text-lg text-black " key={item.title}>
      <DynamicTag
        prefetch={!active ? false : undefined}
        href={href}
        onClick={() => {
          if (onFilterStart) onFilterStart(); //  bật loading ngay khi click
        }}
        className={clsx("w-full hover:underline hover:underline-offset-4", {
          "underline underline-offset-4": active,
        })}
      >
        {item.title}
      </DynamicTag>
    </li>
  );
}

export function FilterItem({
  item,
  onFilterStart,
}: {
  item: ListItem;
  onFilterStart?: () => void;
}) {
  return "path" in item ? (
    <PathFilterItem item={item} />
  ) : (
    <SortFilterItem item={item} onFilterStart={onFilterStart} />
  );
}
