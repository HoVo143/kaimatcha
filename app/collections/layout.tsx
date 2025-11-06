"use client";

import Collections from "../../components/layout/search/collections";
import FilterList from "../../components/layout/search/filter";
import { sorting } from "../../lib/constants";
import { useEffect, useState } from "react";
import { Funnel, ChevronDown } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showCollections, setShowCollections] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Auto loading khi mở page
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [pathname, searchParams.toString()]);

  // // Khi URL đổi -> sản phẩm render xong -> tắt loading
  // useEffect(() => {
  //   if (isLoading) {
  //     const timer = setTimeout(() => setIsLoading(false), 300);
  //     return () => clearTimeout(timer);
  //   }
  // }, [pathname, searchParams]);

  // Callback bật loading khi click filter
  const handleFilterStart = () => {
    setIsLoading(true);
  };

  return (
    <>
      <div className="mx-auto flex flex-col pb-4 text-black mt-5 md:mt-0 overflow-hidden">
        {/* --- BUTTONS --- */}
        <div className="flex justify-between gap-3 px-5 md:px-10 border border-gray-100">
          <button
            onClick={() => setShowCollections((prev) => !prev)}
            className="text-sm text-start cursor-pointer border-r border-r-gray-100 w-[120px] md:w-[150px] h-full pr-6 py-6"
          >
            <span className="flex items-center justify-start gap-2">
              <Funnel className="h-4 w-4 text-gray-500" />
              {showCollections ? "Hide Filters" : "Show Filters"}
            </span>
          </button>
          <button
            onClick={() => setShowSort((prev) => !prev)}
            className="text-sm text-end cursor-pointer border-l border-l-gray-100 w-[120px] md:w-[150px] h-full py-6"
          >
            <span className="flex items-center justify-end gap-2">
              {showSort ? "Hide Sort" : "Show Sort"}
              <ChevronDown
                className={`w-4 h-4 text-gray-500 transition-transform duration-300 ease-in-out ${
                  showSort ? "rotate-180" : "rotate-0"
                }`}
              />
            </span>
          </button>
        </div>

        {/* --- LOADING BAR --- */}
        <div
          className={`transition-all duration-300 ${
            isLoading ? "h-[5px] opacity-100" : "h-0 opacity-0"
          } w-full relative overflow-hidden bg-gray-100`}
        >
          {isLoading && <div className="loading-bar" />}
        </div>

        {/* --- MAIN AREA --- */}
        <div className="flex justify-between relative overflow-hidden">
          {/* LEFT FILTER (Collections - MOBILE) */}
          <div
            className={`absolute md:hidden top-0 left-0 z-150 bg-white shadow-md rounded-lg p-4 transition-all duration-500 ease-in-out transform
            ${showCollections ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0 pointer-events-none"}
            w-full`}
          >
            <Collections onFilterStart={handleFilterStart} />
          </div>

          {/* CONTENT */}
          <div className="w-full order-1 p-5 md:p-10">{children}</div>

          {/* RIGHT SORT FILTER (mobile popup) */}
          <div
            className={`absolute md:hidden top-0 right-0 z-50 bg-white shadow-md rounded-lg p-4 transition-all duration-500 ease-in-out transform
            ${showSort ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 pointer-events-none"}
            w-full`}
          >
            <FilterList
              list={sorting}
              onFilterStart={handleFilterStart}
              title="Sort by"
            />
          </div>

          {/* --- DESKTOP SORT (slide từ phải sang trái) --- */}
          <div
            className={`hidden md:block absolute top-0 right-0 z-50 bg-white shadow-lg p-4 transition-all
            duration-500 ease-in-out transform md:w-[225px]
            ${showSort ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 pointer-events-none"}`}
          >
            <FilterList
              list={sorting}
              onFilterStart={handleFilterStart}
              title="Sort by"
            />
          </div>

          {/* --- DESKTOP COLLECTIONS (slide mượt, không chiếm chỗ khi ẩn) --- */}
          <div
            className={`
              hidden md:flex md:sticky md:top-0 self-start 
              border-r border-b border-r-gray-100 border-b-gray-100
              overflow-hidden transition-all duration-500 ease-in-out
              ${showCollections ? "max-w-[400px] opacity-100" : "max-w-0 opacity-0"}
            `}
            style={{ transitionProperty: "max-width, opacity" }}
          >
            <div
              className={`
                w-[400px] transform transition-transform duration-500 ease-in-out
                ${showCollections ? "translate-x-0" : "-translate-x-full"}
              `}
            >
              <div className="pl-10 pr-5 rounded-sm">
                <Collections onFilterStart={handleFilterStart} />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="mx-auto flex justify-between gap-3 md:gap-8 px-5 md:px-10 pb-4 text-black md:flex-row mt-5 md:mt-0">
        <div className="order-first w-full flex-none md:max-w-[125px] md:sticky md:top-28 self-start">
          <Collections />
        </div>
        <div className="mt-7 order-last min-h-screen w-full md:order-0 md:overflow-y-auto scrollbar-hide">
          {children}
        </div>
        <div className="order-0 flex-none w-full md:order-last md:w-[125px] md:sticky md:top-28 self-start">
          <FilterList list={sorting} title="Sort by" />
        </div>
      </div> */}
    </>
  );
}
