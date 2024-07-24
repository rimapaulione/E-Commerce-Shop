import { Suspense } from "react";
import {
  ProductsCard,
  ProductsCardSkeleton,
} from "@/components/ui/productsCard";
import { getActiveProducts } from "@/db/products/getProducts";

export default function ProductPage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Suspense
        fallback={
          <>
            <ProductsCardSkeleton />
            <ProductsCardSkeleton />
            <ProductsCardSkeleton />
            <ProductsCardSkeleton />
            <ProductsCardSkeleton />
            <ProductsCardSkeleton />
          </>
        }
      >
        <ProductSuspense />
      </Suspense>
    </div>
  );
}

async function ProductSuspense() {
  const activeProducts = await getActiveProducts();

  return activeProducts.map((product) => (
    <ProductsCard key={product.id} {...product} />
  ));
}
