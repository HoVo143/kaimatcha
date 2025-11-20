/* eslint-disable prettier/prettier */
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import Image from "next/image";
import ProductSlider from "./ProductSlider";
import HeroCarousel from "./hero-carousel";
import { getCollections, getCollectionProducts } from "../../lib/shopify";
import SectionDivider from "../ui/divider-section";
import ScrollReveal from "../ui/scroll-reveal";

export default async function HomeSection() {
  const collections = await getCollections();

  // Lấy 5 collection đầu tiên
  // const topCollections = collections.slice(0, 5);
  const topCollections = collections.filter(
    (c) => c.handle && c.handle.trim() !== ""
  );
  // .slice(0, 5);

  // Get latest teaware products
  const teawareProducts = await getCollectionProducts({
    collection: "teaware",
    sortKey: "CREATED_AT",
    reverse: true, // newest first
  });

  const topProducts = teawareProducts.slice(0, 6);
  // bg-[#F6F6F6]
  return (
    <main className="main-home flex-1 bg-white text-[#2c2c2c]">
      {/* Hero Banner Carousel */}
      <HeroCarousel />
      {/* Text */}
      <ScrollReveal direction="up" delay={100}>
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
              artisans—each piece a quiet expression of ritual, purity, and
              calm.
            </p>
          </div>
        </section>
      </ScrollReveal>

      {/* hr */}
      <SectionDivider />

      {/* products */}
      <ScrollReveal direction="up" delay={200}>
        <ProductSlider topProducts={topProducts} />
      </ScrollReveal>

      {/* hr */}
      <SectionDivider />

      {/* Our Collection */}
      <section className="w-full py-6 md:py-24">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <ScrollReveal direction="up" delay={100}>
            <h2 className="text-3xl md:text-4xl font-medium mb-8 uppercase">
              Our Collection
            </h2>
          </ScrollReveal>

          <div className="grid gap-2 md:gap-12 grid-cols-2 md:grid-cols-3 max-w-6xl mx-auto">
            {topCollections
              .filter((collection) =>
                ["matcha", "goods", "teaware"].includes(
                  collection.handle.toLowerCase()
                )
              )
              .map((collection, index) => (
                <ScrollReveal
                  key={collection.id}
                  direction="up"
                  delay={100 + index * 100}
                >
                  <div className="group relative overflow-hidden">
                    <Link href={`/collections/${collection.handle}`}>
                      {collection.image?.url && (
                        <Image
                          src={collection.image.url}
                          alt={collection.title}
                          width={400}
                          height={400}
                          className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      )}
                      <div className="absolute inset-0 transition-colors" />
                      <div className="absolute inset-0 flex items-center justify-center uppercase ">
                        <h3 className="text-white text-xxl font-medium tracking-wide text-center drop-shadow-lg underline-center">
                          {collection.title}
                        </h3>
                      </div>
                    </Link>
                  </div>
                </ScrollReveal>
              ))}
          </div>
        </div>
      </section>

      {/* Sale / CTA Section */}
      <ScrollReveal direction="fade" delay={100}>
        <section className="relative w-full">
          <Image
            src="https://cdn.shopify.com/s/files/1/0682/6636/0920/files/Kai_Matcha_Brand_Identity_System_1.jpg?v=1762323474"
            alt="Matcha Banner"
            width={1600}
            height={600}
            className="w-full h-[50vh] object-cover md:h-[60vh]"
          />
          <div className="absolute pb-4 md:pb-24 inset-0 bg-black/40 flex flex-col items-center justify-center text-center md:items-end md:justify-end md:text-end text-white px-10 md:px-22">
            <ScrollReveal direction="up" delay={100}>
              <h1 className="text-2xl md:text-4xl font-medium tracking-normal">
                Signature Tea Collection
              </h1>
              <p className="mt-4 max-w-[500px] text-sm md:text-lg">
                Discover our master blender’s exclusive creations, available
                only at Herbal Haven. Limited quantities, infinite
                possibilities.
              </p>
              <p>
                <Link
                  href="/collections/matcha"
                  className="tracking-wider uppercase text-link mt-2 inline-flex h-10 items-start justify-start underline text-sm font-medium hover:text-emerald-400 transition-colors"
                >
                  Explore matcha
                </Link>
              </p>
            </ScrollReveal>
          </div>
        </section>
      </ScrollReveal>
    </main>
  );
}
