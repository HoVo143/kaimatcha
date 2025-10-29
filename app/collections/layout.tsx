import Collections from "../../components/layout/search/collections";
import FilterList from "../../components/layout/search/filter";
import { sorting } from "../../lib/constants";

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="mx-auto flex max-w-screen-2xl flex-col gap-3 md:gap-8 px-4 pb-4 text-black md:flex-row mt-5 md:mt-0">
        <div className="order-first w-full flex-none md:max-w-[125px] md:sticky md:top-28 self-start">
          <Collections />
        </div>
        <div className="mt-7 order-last min-h-screen w-full md:order-0 md:overflow-y-auto scrollbar-hide">
          {children}
        </div>
        <div className="order-0 flex-none w-full md:order-last md:w-[125px] md:sticky md:top-28 self-start">
          <FilterList list={sorting} title="Sort by" />
        </div>
      </div>
    </>
  );
}