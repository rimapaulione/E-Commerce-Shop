import {
  getMostPopularProducts,
  getNewestProducts,
} from "@/db/products/getProducts";
import ProductsGridSection from "./_components/productsGridSection";

export default function HomePage() {
  return (
    <main className="space-y-12">
      <ProductsGridSection
        productsFetcher={getMostPopularProducts}
        title="Most Populars"
      />
      <ProductsGridSection productsFetcher={getNewestProducts} title="Newest" />
    </main>
  );
}
