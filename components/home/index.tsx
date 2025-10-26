/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import Image from "next/image";
import ProductSlider from "./ProductSlider";
import { getCollections, getProducts } from "../../lib/shopify";

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

  return (
    <main className="flex-1 bg-[#f9f5ea] text-[#2c2c2c]">      
      {/* Hero Banner */}
      <section className="relative w-full">
        <Image
          src="https://cdn.shopify.com/s/files/1/0682/6636/0920/files/14.png?v=1761554661"
          alt="Matcha Banner"
          width={1600}
          height={600}
          className="w-full h-[95vh] object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-start text-center text-white px-6 py-40">
          <h1 className="text-4xl md:text-6xl font-medium tracking-tight">
            Pure Nature,
            <br />
            Perfect Harmony
          </h1>
          <p className="mt-4 max-w-[700px] text-lg md:text-xl">
            Discover our collection of ethically sourced, organic teas 
            <br />
             that nurture both body and soul
          </p>
          <Link
            href="/search/matcha"
            className="mt-6 underline inline-flex h-10 items-center justify-center px-6 text-sm font-medium hover:text-emerald-600 transition-colors"
          >
            Explore matcha
          </Link>
        </div>
      </section>
      {/* Text */}
      <section className="w-full flex flex-col items-center justify-start text-center mt-20 my-14">
        <div className="text-3xl text-home leading-relaxed">
            <p>
              We are the{" "}
              <img
                className="cursor-pointer inline align-middle h-16 w-h-16 mx-1 transition-transform duration-300 hover:scale-110"
                src="https://cdn.shopify.com/s/files/1/0682/6636/0920/files/yellow.png?v=1761193966"
                alt="tea"
              />{" "}
              premier tea brand specializing <br />
              in artisanal teas {" "}
              <img
                className="cursor-pointer inline rounded-full align-middle h-12 w-h-12 mx-1 transition-transform duration-300 hover:scale-110"
                src="https://cdn.shopify.com/s/files/1/0682/6636/0920/files/7.png?v=1761022127"
                alt="tea"
              />{" "} sourced directly from <br />
              Korean estates and curating {" "}
              <img
                className="cursor-pointer inline align-middle h-16 w-h-16 mx-1 transition-transform duration-300 hover:scale-110"
                src="https://cdn.shopify.com/s/files/1/0682/6636/0920/files/removebg.png?v=1761280097"
                alt="tea"
              />{" "} handcrafted <br />
              teaware by Korean artists.
            </p>
          </div>
      </section>

      {/* hr */}
      <div className="flex max-w-[250] m-auto items-center justify-center mt-20 my-5">
        <div className="grow border-t border-gray-500"></div>
        {/* <SparklesIcon className="w-6 h-6 mx-4 text-gray-500" /> */}
        <img 
          className="w-12 h-12 mx-1" 
          src="https://cdn.shopify.com/s/files/1/0682/6636/0920/files/Symbol-Logo-Hr.png?v=1761278683" 
          alt="Hr" 
          />
        <div className="grow border-t border-gray-500"></div>
      </div>

      {/* products */}
      <ProductSlider topProducts={topProducts} />
      {/* <section className="w-full py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-medium mb-4">Our Products</h2>
          <p className="text-muted-foreground max-w-[700px] mx-auto mb-2">
            Carefully curated selections from our master tea blenders, each
            <br />
            crafted with love and respect for nature
          </p>
          <Link
              href="/search"
              className=" text-sm underline font-medium hover:text-emerald-700 transition-colors mb-12"
            >
              View all
          </Link>
          <p className="mb-12"></p>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
            {topProducts.map((product) => (
              <div
                key={product.id}
                className="group relative overflow-hidden rounded-2xl shadow-md bg-white"
              >
                <Link href={`/product/${product.handle}`}>
                  <Image
                    src={product.featuredImage?.url || ""}
                    alt={product.title}
                    width={400}
                    height={400}
                    className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                  <h3 className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white text-xxl font-medium tracking-wide">
                    {product.title}
                  </h3>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* hr */}
      <div className="flex max-w-[250] m-auto items-center justify-center my-8">
        <div className="grow border-t border-gray-500"></div>
        <img 
          className="w-12 h-12 mx-1" 
          src="https://cdn.shopify.com/s/files/1/0682/6636/0920/files/Symbol-Logo-Hr.png?v=1761278683" 
          alt="Hr" 
          />
        <div className="grow border-t border-gray-500"></div>
      </div>
      
      {/* Our Collection */}
     <section className="w-full py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-medium mb-8">Our Collection</h2>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5 max-w-8xl mx-auto">
          {topCollections.map((collection) => (
            <div
              key={collection.id}
              className="group relative overflow-hidden"
            >
              <Link href={`/search/${collection.handle}`}>
                <Image
                  src={collection.image?.url || ""}
                  alt={collection.title}
                  width={400}
                  height={400}
                  className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 transition-colors" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h3 className="text-white text-xxl font-medium tracking-wide text-center drop-shadow-lg">
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
          src="https://cdn.shopify.com/s/files/1/0682/6636/0920/files/13.png?v=1761022128"
          alt="Matcha Banner"
          width={1600}
          height={600}
          className="w-full h-[80vh] object-cover"
        />
        <div className="absolute pt-24 inset-0 bg-black/40 flex flex-col items-start justify-start text-start text-white px-22">
          <h1 className="text-xxl md:text-2xl font-medium tracking-tight">
            Signature Tea Collection
          </h1>
          <p className="mt-4 max-w-[700px] text-xxl md:text-xxl">
            Discover our master blender’s exclusive creations, available only at
            <br />
            Herbal Haven. Limited quantities, infinite possibilities.
          </p>
          <Link
            href="/search/matcha"
            className="mt-2 inline-flex h-10 items-start justify-start underline text-sm font-medium hover:text-emerald-400 transition-colors"
          >
            Explore matcha
          </Link>
        </div>
      </section>
    </main>
  );
}
