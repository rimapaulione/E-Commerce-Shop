"use client";

import { useState } from "react";
import { useFormState } from "react-dom";
import { Product } from "@prisma/client";
import Image from "next/image";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SubmitButton } from "@/components/ui/submitButton";
import { formatCurrency } from "@/lib/formatters";
import { addProduct, updateProduct } from "../../_actions/products";

export default function ProductForm({ product }: { product?: Product | null }) {
  const [price, setPrice] = useState<number | undefined>(product?.priceInCents);
  const [error, action] = useFormState(
    product == null ? addProduct : updateProduct.bind(null, product.id),
    {}
  );
  return (
    <form className="space-y-6" action={action}>
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          type="text"
          id="name"
          name="name"
          required
          defaultValue={product?.name || ""}
        />

        {error.name && <div className="text-destructive">{error.name}</div>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="price">Price In Cents</Label>
        <Input
          type="number"
          id="price"
          name="price"
          required
          value={price}
          onChange={(e) => setPrice(Number(e.target.value) || undefined)}
        />
        {error.price && <div className="text-destructive">{error.price}</div>}
        <div className="text-muted-foreground">
          {price ? formatCurrency(price / 100) : 0}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          required
          defaultValue={product?.description || ""}
        />
        {error.description && (
          <div className="text-destructive">{error.description}</div>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="file">File</Label>
        <Input type="file" id="file" name="file" required={product == null} />
        {product != null && (
          <div className="text-muted-foreground">{product.filePath}</div>
        )}
        {error.file && <div className="text-destructive">{error.file}</div>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="image">Image</Label>
        <Input type="file" id="image" name="image" required={product == null} />
        {product != null && (
          <Image
            src={`https://mybuckettestproject.s3.eu-west-1.amazonaws.com/e-commerce/photo/${product.imagePath}`}
            alt="Product Image"
            height="200"
            width="200"
          />
        )}
        {error.image && <div className="text-destructive">{error.image}</div>}
      </div>
      <SubmitButton />
    </form>
  );
}
