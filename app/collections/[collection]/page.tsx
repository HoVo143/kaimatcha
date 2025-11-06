import Grid from "../../../components/grid";
import ProductGridItems from "../../../components/product/product-grid-items";
import { defaultSort, sorting } from "../../../lib/constants";
import { getCollectionProducts } from "../../../lib/shopify";

export default async function CategoryPage(props: {
  params: Promise<{ collection: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await props.params;
  const searchParams = (await props.searchParams) || {};

  const { sort, price_min, price_max, stock } = searchParams as {
    [key: string]: string;
  };

  const { sortKey, reverse } =
    sorting.find((item) => item.slug === sort) || defaultSort;

  // --- Gọi API lấy toàn bộ sản phẩm của collection ---
  const products = await getCollectionProducts({
    collection: params.collection,
    sortKey,
    reverse,
  });

  // --- Xử lý lọc theo giá và tồn kho ---
  const filteredProducts = products.filter((product) => {
    const price = Number(product?.priceRange?.minVariantPrice?.amount ?? 0);

    // Lọc theo giá
    if (price_min && price < Number(price_min)) return false;
    if (price_max && price > Number(price_max)) return false;

    // Lọc theo tồn kho
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

  return (
    <section>
      {filteredProducts.length === 0 ? (
        <p className="py-3 text-lg h-100 md:h-full">{`No products found in this collection`}</p>
      ) : (
        <Grid className="grid-cols-2 sm:grid-cols-2 lg:grid-cols-3">
          <ProductGridItems products={filteredProducts} />
        </Grid>
      )}
    </section>
  );
}
