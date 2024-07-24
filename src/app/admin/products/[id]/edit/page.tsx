import PageHeader from "@/app/admin/_components/pageHeader";
import ProductForm from "../../_components/productForm";
import { getProductById } from "@/db/products/getProducts";
import { Product } from "@prisma/client";

export default async function EditProductPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const product = await getProductById(id);

  return (
    <>
      <PageHeader>Edit Product</PageHeader>
      <ProductForm product={product}></ProductForm>
    </>
  );
}
