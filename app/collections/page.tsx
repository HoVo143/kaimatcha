import Grid from "../../components/grid";
import ProductGridItems from "../../components/product/product-grid-items";
import { defaultSort, sorting } from "../../lib/constants";
import { getProducts } from "../../lib/shopify";

export const metadata = {
  title: "All Products",
  description: "Browse all products in the store.",
};

export default async function SearchPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;

  // const { sort, q: searchValue } = (searchParams || {}) as {
  //   [key: string]: string;
  // };
  const {
    sort,
    q: searchValue,
    price_min,
    price_max,
    stock,
  } = (searchParams || {}) as {
    [key: string]: string;
  };

  const { sortKey, reverse } =
    sorting.find((item) => item.slug === sort) || defaultSort;

  // --- Lấy tất cả sản phẩm ---
  const products = await getProducts({
    sortKey,
    reverse,
    query: searchValue,
  });

  // --- Lọc theo giá và tồn kho ---
  const filteredProducts = products.filter((product) => {
    const price = Number(product?.priceRange?.minVariantPrice?.amount ?? 0);

    if (price_min && price < Number(price_min)) return false;
    if (price_max && price > Number(price_max)) return false;

    if (stock === "in") {
      const hasAvailableVariant = product.variants?.some(
        (v) => v.availableForSale
      );
      if (!hasAvailableVariant) return false;
    }

    if (stock === "out") {
      const allOut = product.variants?.every((v) => !v.availableForSale);
      if (!allOut) return false;
    }

    return true;
  });

  const resultsText = products.length > 1 ? "results" : "result";

  return (
    <>
      {searchValue ? (
        <p className="mb-4">
          {filteredProducts.length === 0
            ? "There are no products that match"
            : `Showing ${filteredProducts.length} ${resultsText} for `}
          <span>&quot;{searchValue}&quot;</span>
        </p>
      ) : null}

      {filteredProducts.length > 0 ? (
        <Grid className="grid-cols-2 sm:grid-cols-2 lg:grid-cols-3">
          <ProductGridItems products={filteredProducts} />
        </Grid>
      ) : (
        <p className="py-3 text-lg h-100 md:h-full">{`No products found`}</p>
      )}
      {/* {searchValue ? (
        <p className="mb-4">
          {products.length === 0
            ? "There are no products that match"
            : `Showing ${products.length} ${resultsText} for `}
          <span>&quot;{searchValue}&quot;</span>
        </p>
      ) : null}

      {products.length > 0 ? (
        <Grid className="grid-cols-2 sm:grid-cols-2 lg:grid-cols-3">
          <ProductGridItems products={products} />
        </Grid>
      ) : null} */}
    </>
  );
}

// page all products - collections
