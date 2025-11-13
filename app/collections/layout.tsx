/* eslint-disable @next/next/no-img-element */
"use client";

import Collections from "../../components/layout/search/collections";
import FilterList from "../../components/layout/search/filter";
import { sorting } from "../../lib/constants";
import { useEffect, useMemo, useState } from "react";
import { Funnel, ChevronDown } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import Image from "next/image";
import BannerSection from "../../components/ui/banner-section";
import SectionDivider from "../../components/ui/divider-section";
import LoadingBar from "../../components/ui/loading-bar-pages";

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

  // Callback bật loading khi click filter
  const handleFilterStart = () => {
    setIsLoading(true);
  };

  // Lấy segment cuối cùng của pathname
  const currentCollection = useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);
    const lastSegment = segments[segments.length - 1];
    if (!lastSegment || lastSegment === "collections") return "All Products";

    // Chuyển slug sang chữ có dấu cách + viết hoa đầu
    return lastSegment
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }, [pathname]);

  return (
    <>
      <div className="mx-auto flex flex-col pb-4 text-black md:mt-0 overflow-hidden">
        {/* --- COLLECTION TITLE --- */}
        {pathname === "/collections/matcha" ? (
          <>
            <div className="relative w-full h-[130px] md:h-[220px] overflow-hidden">
              <img
                src="/Matcha_Web_Banner.png"
                alt="Matcha Banner"
                className="w-full h-full object-cover object-[center_30%]"
              />
              {/* Overlay đen mờ */}
              <div className="absolute inset-0 bg-black/20"></div>

              <div className="absolute inset-0 flex items-end pb-3  md:pb-6 justify-center">
                <h1 className="text-white text-xl md:text-4xl uppercase tracking-wide drop-shadow-lg">
                  {currentCollection}
                </h1>
              </div>
            </div>
            <div className="text-collections p-8 md:p-12 text-center tracking-wide text-black">
              <h1 className="text-sm md:text-3xl uppercase">
                Ceremonial-Grade Matcha
              </h1>
              <p className="mt-2 text-sm md:text-lg font-extralight">
                Single-origin matcha from Uji, Japan—crafted for calm and
                ritual.
              </p>
            </div>
          </>
        ) : (
          <div className="p-6 md:p-9 text-2xl md:text-4xl text-center tracking-wide text-gray-800 uppercase ">
            {currentCollection}
          </div>
        )}

        {/* --- BUTTONS --- */}
        <div className="flex justify-between gap-3 px-5 md:px-10 border border-gray-100">
          <button
            onClick={() => setShowCollections((prev) => !prev)}
            className="text-sm md:text-base text-start cursor-pointer md:border-r border-r-gray-100 w-[200px] h-full py-6"
          >
            <span className="flex items-center justify-start gap-2">
              <Funnel className="h-4 w-4 text-gray-500" />
              {showCollections ? "Hide Filters" : "Show Filters"}
              <ChevronDown
                className={`w-4 h-4 text-gray-500 transition-transform duration-300 ease-in-out ${
                  showCollections ? "rotate-180" : "rotate-0"
                }`}
              />
            </span>
          </button>
          <button
            onClick={() => setShowSort((prev) => !prev)}
            className="text-sm md:text-base text-end cursor-pointer md:border-l border-l-gray-100 w-[200px] h-full py-6"
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
        <LoadingBar isLoading={isLoading} />

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

        {/* --- THE DIFFERENCE --- */}
        {pathname === "/collections/matcha" && (
          <>
            <BannerSection
              image="https://cdn.shopify.com/s/files/1/0682/6636/0920/files/kai_matcha_7_1.jpg?v=1762530011"
              title="The Difference"
              text="Experience the depth of our Matcha—deeper color, finer texture, unmatched purity."
              gradientBottom
              objectPosition="center 18%"
              centerContent={false} // căn trái như hiện tại
            />

            <BannerSection
              image="https://cdn.shopify.com/s/files/1/0682/6636/0920/files/Banner.png?v=1762588669"
              title="Brewing Guide"
              text="Learn how to make the perfect matcha."
              linkLabel="Coming soon"
              centerContent={true} // căn giữa toàn bộ
              gradientTop
            />
          </>
        )}
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
      <SectionDivider />
    </>
  );
}
