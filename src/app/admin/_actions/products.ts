"use server";

import db from "@/db/db";
import { z } from "zod";
import fs from "fs/promises";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { S3 } from "@aws-sdk/client-s3";

const s3 = new S3({
  region: process.env.S3_REGION as string,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

const fileSchema = typeof window === "undefined" ? z.any() : z.instanceof(File);
const imageSchema = fileSchema.refine(
  (file) => file.size === 0 || file.type.startsWith("image/")
);

const addSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.coerce.number().int().min(1),
  file: fileSchema.refine((file) => file.size > 0, "Required"),
  image: imageSchema.refine((file) => file.size > 0, "Required"),
});

export async function addProduct(prevState: unknown, formData: FormData) {
  const result = addSchema.safeParse(Object.fromEntries(formData.entries()));
  if (result.success === false) {
    return result.error.formErrors.fieldErrors;
  }
  const data = result.data;

  const filePath = `${crypto.randomUUID()}-${data.file.name}`;
  const bufferedFile = await data.file.arrayBuffer();

  const imagePath = `${crypto.randomUUID()}-${data.image.name}`;
  const bufferedImage = await data.image.arrayBuffer();

  const image = await s3.putObject({
    Bucket: "mybuckettestproject",
    Key: `e-commerce/photo/${imagePath}`,
    Body: Buffer.from(bufferedImage),
    ContentType: data.image.type,
  });

  const file = await s3.putObject({
    Bucket: "mybuckettestproject",
    Key: `e-commerce/pattern/${filePath}`,
    Body: Buffer.from(bufferedFile),
    ContentType: data.file.type,
  });

  if (
    image.$metadata.httpStatusCode !== 200 ||
    file.$metadata.httpStatusCode !== 200
  ) {
    return notFound();
  }

  await db.product.create({
    data: {
      isAvailableForPurchase: false,
      name: data.name,
      description: data.description,
      priceInCents: data.price,
      filePath,
      imagePath,
    },
  });
  revalidatePath("/");
  revalidatePath("/products");
  redirect("/admin/products");
}

export async function toggleProductAvailability(
  id: string,
  isAvailableForPurchase: boolean
) {
  await db.product.update({ where: { id }, data: { isAvailableForPurchase } });
  revalidatePath("/");
  revalidatePath("/products");
}

export async function deleteProduct(id: string) {
  const product = await db.product.delete({ where: { id } });
  if (product == null) return notFound();

  const deleteFile = await s3.deleteObject({
    Bucket: "mybuckettestproject",
    Key: `e-commerce/pattern/${product.filePath}`,
  });

  const deleteImage = await s3.deleteObject({
    Bucket: "mybuckettestproject",
    Key: `e-commerce/photo/${product.imagePath}`,
  });

  if (
    deleteImage.$metadata.httpStatusCode !== 204 ||
    deleteFile.$metadata.httpStatusCode !== 204
  ) {
    return notFound();
  }

  revalidatePath("/");
  revalidatePath("/products");
}

const updateSchema = addSchema.extend({
  file: fileSchema.optional(),
  image: imageSchema.optional(),
});

export async function updateProduct(
  id: string,
  prevState: unknown,
  formData: FormData
) {
  const result = updateSchema.safeParse(Object.fromEntries(formData.entries()));
  if (result.success === false) {
    return result.error.formErrors.fieldErrors;
  }
  const data = result.data;
  const product = await db.product.findUnique({ where: { id } });

  if (product == null) return notFound();

  let filePath = product.filePath;
  if (data.file != null && data.file.size > 0) {
    await s3.deleteObject({
      Bucket: "mybuckettestproject",
      Key: `e-commerce/pattern/${product.filePath}`,
    });
    filePath = `${crypto.randomUUID()}-${data.file.name}`;
    const bufferedFile = await data.file.arrayBuffer();
    await s3.putObject({
      Bucket: "mybuckettestproject",
      Key: `e-commerce/pattern/${filePath}`,
      Body: Buffer.from(bufferedFile),
      ContentType: data.file.type,
    });
  }

  let imagePath = product.imagePath;
  if (data.image != null && data.image.size > 0) {
    await s3.deleteObject({
      Bucket: "mybuckettestproject",
      Key: `e-commerce/photo/${product.imagePath}`,
    });
    imagePath = `${crypto.randomUUID()}-${data.image.name}`;
    const bufferedImage = await data.image.arrayBuffer();
    await s3.putObject({
      Bucket: "mybuckettestproject",
      Key: `e-commerce/photo/${imagePath}`,
      Body: Buffer.from(bufferedImage),
      ContentType: data.image.type,
    });
  }

  await db.product.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description,
      priceInCents: data.price,
      filePath,
      imagePath,
    },
  });
  revalidatePath("/");
  revalidatePath("/products");
  redirect("/admin/products");
}
