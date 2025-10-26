"use client";
import { createUrl } from "../../../lib/utils";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef } from "react";

export default function Search() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const val = e.target as HTMLFormElement;
    const search = val.search as HTMLInputElement;
    const newParams = new URLSearchParams(searchParams.toString());

    if (search.value) {
      newParams.set("q", search.value);
    } else {
      newParams.delete("q");
    }

    router.push(createUrl("/search", newParams));
  }
  return (
    <form
      onSubmit={onSubmit}
      className="w-max-[550px] relative w-80 lg:w-80 xl:w-70 bord "
    >
      <input
        ref={inputRef}
        key={searchParams?.get("q")}
        type="text"
        name="search"
        placeholder="Search for products..."
        autoComplete="off"
        defaultValue={searchParams?.get("q") || ""}
        onFocus={(e) => e.target.scrollIntoView({ behavior: "auto", block: "nearest" })}
        className="text-md w-full py-2 text-white placeholder:text-neutral-300 md:text-sm border-b border-b-gray-500"
      />
      <div className="absolute right-0 top-0 mr-3 flex h-full items-center pb-2.5">
        <MagnifyingGlassIcon className="h-6 text-white" />
      </div>
    </form>
  );
}

export function SearchSkeleton() {
  return (
    <form className="w-max-[550px] relative w-80 lg:w-80 xl:w-80">
      <input
        type="text"
        placeholder="Search for products..."
        className="w-full rounded-lg px-4 py-2 text-sm text-black placeholder:text-neutral-500 "
      />
      <div className="absolute right-0 top-0 mr-3 flex h-full items-center">
        <MagnifyingGlassIcon className="h-4" />
      </div>
    </form>
  );
}