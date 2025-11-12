/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import Image from "next/image";
import ProductSlider from "./ProductSlider";
import { getCollections, getProducts } from "../../lib/shopify";
import SectionDivider from "../ui/divider-section";

export default async function HomeSection() {
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
    <main className="main-home flex-1 bg-white text-[#2c2c2c]">
      {/* Hero Banner */}
      <section className="relative w-full">
        <Image
          src="https://cdn.shopify.com/s/files/1/0682/6636/0920/files/Banner.png?v=1762588669"
          alt="Matcha Banner"
          width={1600}
          height={600}
          className="w-full h-[60vh] object-cover md:h-full"
        />
        <div className="absolute top-26 md:top-48 inset-0 flex flex-col items-center justify-start text-center text-white px-6">
          {/* <img
            src="https://cdn.shopify.com/s/files/1/0682/6636/0920/files/Full_Logo_Horizontal_White_d8930ed5-d908-473f-906d-bffc347a58b4.png?v=1762318374"
            alt=""
            className="md:h-[120px]"
          /> */}
          <h1 className="mt-2 text-xl md:text-4xl font-medium tracking-tight">
            Single-Origin Ceremonial Matcha
          </h1>
          {/* <p className="mt-2 text-md md:text-3xl font-medium "></p> */}
          <p>
            <Link
              href="/collections/matcha"
              className="tracking-wider uppercase text-link mt-2 md:mt-8 inline-flex h-10 items-start justify-start underline text-sm font-medium hover:text-emerald-400 transition-colors"
            >
              Explore matcha
            </Link>
          </p>
        </div>
      </section>
      {/* Text */}
      <section className="w-full flex flex-col items-center justify-start text-center mt-5 md:mt-20 my-14">
        <div className="text-xl md:text-4xl text-home leading-relaxed mx-5 max-w-[340px] md:max-w-[540px]">
          <p>
            We craft premium matcha{" "}
            <img
              className="cursor-pointer inline align-middle h-11 w-h-11 md:h-16 md:w-h-16 mx-1 transition-transform duration-300 hover:scale-110"
              src="https://cdn.shopify.com/s/files/1/0682/6636/0920/files/matcha.png?v=1761193966"
              alt="tea"
            />{" "}
            from Uji, Japan, and handmade teaware{" "}
            <img
              className="cursor-pointer inline rounded-full align-middle h-8 w-h-8 md:h-12 md:w-h-12 mx-1 transition-transform duration-300 hover:scale-110"
              src="https://cdn.shopify.com/s/files/1/0682/6636/0920/files/1-1.png?v=1762248464"
              alt="tea"
            />{" "}
            by Japanese{" "}
            <img
              className="cursor-pointer inline align-middle h-11 w-h-11 md:h-16 md:w-h-16 mx-1 transition-transform duration-300 hover:scale-110"
              src="https://cdn.shopify.com/s/files/1/0682/6636/0920/files/removebg.png?v=1761280097"
              alt="tea"
            />{" "}
            artisans—each piece a quiet expression of ritual, purity, and calm.
          </p>
        </div>
      </section>

      {/* hr */}
      <SectionDivider />

      {/* products */}
      <ProductSlider topProducts={topProducts} />
      {/*  */}

      {/* hr */}
      <SectionDivider />

      {/* Our Collection */}
      <section className="w-full py-6 md:py-24">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-medium mb-8 uppercase">
            Our Collection
          </h2>

          <div className="grid gap-2 md:gap-12 grid-cols-2 lg:grid-cols-4 max-w-8xl mx-auto">
            {topCollections.map((collection) => (
              <div
                key={collection.id}
                className="group relative overflow-hidden"
              >
                <Link href={`/collections/${collection.handle}`}>
                  <Image
                    src={collection.image?.url || ""}
                    alt={collection.title}
                    width={400}
                    height={400}
                    className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 transition-colors" />
                  <div className="absolute inset-0 flex items-center justify-center uppercase ">
                    <h3 className="text-white text-xxl font-medium tracking-wide text-center drop-shadow-lg hover:underline">
                      {collection.title}
                    </h3>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sale / CTA Section */}
      <section className="relative w-full">
        <Image
          src="https://cdn.shopify.com/s/files/1/0682/6636/0920/files/Kai_Matcha_Brand_Identity_System_1.jpg?v=1762323474"
          alt="Matcha Banner"
          width={1600}
          height={600}
          className="w-full h-[50vh] object-cover md:h-[60vh]"
        />
        <div className="absolute pb-4 md:pb-24 inset-0 bg-black/40 flex flex-col items-center justify-center text-center md:items-end md:justify-end md:text-end text-white px-10 md:px-22">
          <h1 className="text-2xl md:text-4xl font-medium tracking-normal">
            Signature Tea Collection
          </h1>
          <p className="mt-4 max-w-[500px] text-sm md:text-lg">
            Discover our master blender’s exclusive creations, available only at
            Herbal Haven. Limited quantities, infinite possibilities.
          </p>
          <p>
            <Link
              href="/collections/matcha"
              className="tracking-wider uppercase text-link mt-2 inline-flex h-10 items-start justify-start underline text-sm font-medium hover:text-emerald-400 transition-colors"
            >
              Explore matcha
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
