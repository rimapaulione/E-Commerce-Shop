import db from "@/db/db";
import { cache } from "@/lib/cache";

export async function getProductsData() {
  const [activeProducts, inactiveProducts] = await Promise.all([
    db.product.count({ where: { isAvailableForPurchase: true } }),
    db.product.count({ where: { isAvailableForPurchase: false } }),
  ]);

  return { activeProducts, inactiveProducts };
}

export async function getAllProducts() {
  const products = await db.product.findMany({
    select: {
      id: true,
      name: true,
      priceInCents: true,
      isAvailableForPurchase: true,
      _count: { select: { orders: true } },
    },
    orderBy: { name: "asc" },
  });
  return products;
}

export async function getProductById(id: string) {
  const product = await db.product.findUnique({ where: { id } });
  return product;
}

export const getNewestProducts = cache(
  () => {
    return db.product.findMany({
      where: { isAvailableForPurchase: true },
      orderBy: { createdAt: "desc" },
      take: 6,
    });
  },
  ["/", "getNewestsProducts"],
  { revalidate: 60 * 60 * 24 }
);

export const getMostPopularProducts = cache(
  () => {
    return db.product.findMany({
      where: { isAvailableForPurchase: true },
      orderBy: { orders: { _count: "desc" } },
      take: 6,
    });
  },
  ["/", "getMostPopularProducts"],
  { revalidate: 60 * 60 * 24 }
);

export const getActiveProducts = cache(() => {
  return db.product.findMany({
    where: { isAvailableForPurchase: true },
    orderBy: { name: "asc" },
  });
}, ["/products", "getActiveProducts"]);
