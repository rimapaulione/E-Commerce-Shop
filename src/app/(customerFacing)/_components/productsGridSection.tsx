import { Button } from "@/components/ui/button";
import {
  ProductsCard,
  ProductsCardSkeleton,
} from "@/components/ui/productsCard";

import { Product } from "@prisma/client";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

type ProductsGridSectionProps = {
  title: string;
  productsFetcher: () => Promise<Product[]>;
};

export default function ProductsGridSection({
  productsFetcher,
  title,
}: ProductsGridSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <h2 className="text-3xl font-bold">{title}</h2>
        <Button asChild variant="outline">
          <Link href="/products" className="space-x-2">
            <span> View All</span>
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Suspense
          fallback={
            <>
              <ProductsCardSkeleton />
              <ProductsCardSkeleton />
              <ProductsCardSkeleton />
            </>
          }
        >
          <ProductSuspense productsFetcher={productsFetcher} />
        </Suspense>
      </div>
    </div>
  );
}

async function ProductSuspense({
  productsFetcher,
}: {
  productsFetcher: () => Promise<Product[]>;
}) {
  return (await productsFetcher()).map((product) => (
    <ProductsCard key={product.id} {...product} />
  ));
}
