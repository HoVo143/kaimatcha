/* eslint-disable prettier/prettier */
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import Image from "next/image";
import { getCollections, getProducts } from "../../lib/shopify";
import SectionDivider from "../ui/divider-section";

export default async function ExhibitionPage() {
  const collections = await getCollections();

  // Lấy 5 collection đầu tiên
  // const topCollections = collections.slice(0, 5);
  const topCollections = collections
    .filter((c) => c.handle && c.handle.trim() !== "")
    .slice(0, 5);

  // const products = await getProducts({ sortKey: "CREATED_AT", reverse: true });
  const products = await getProducts({
    sortKey: "BEST_SELLING",
    reverse: false, // không cần đảo ngược vì Shopify đã sắp giảm dần sẵn
  });

  const topProducts = products.slice(0, 6);
  // bg-[#F6F6F6]
  return (
    <div className="main-home flex-1 bg-white text-[#2c2c2c]">
      {/* Hero Banner */}
      <section className="relative w-full">
        <Image
          src="https://cdn.shopify.com/s/files/1/0682/6636/0920/files/banner-exhibition.jpg?v=1762940727"
          alt="Matcha Banner"
          width={1600}
          height={600}
          className="w-full h-[60vh] object-cover md:h-full"
        />
        <div className="absolute top-26 md:top-56 inset-0 flex flex-col items-center justify-start text-center text-white px-6">
          <h1 className="mt-2 text-xl md:text-5xl font-medium tracking-tight uppercase">
            coming soon
          </h1>
          {/* <p className="mt-2 text-md md:text-3xl font-medium "></p> */}
        </div>
      </section>
    </div>
  );
}
