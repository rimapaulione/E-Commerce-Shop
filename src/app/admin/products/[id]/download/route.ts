import db from "@/db/db";
import { notFound } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import { S3 } from "@aws-sdk/client-s3";

const s3 = new S3({
  region: process.env.S3_REGION as string,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

export async function GET(
  req: NextRequest,
  { params: { id } }: { params: { id: string } }
) {
  const product = await db.product.findUnique({
    where: { id },
    select: { filePath: true, name: true },
  });
  if (product == null) return notFound();

  const data = await s3.getObject({
    Bucket: "mybuckettestproject",
    Key: `e-commerce/pattern/${product.filePath}`,
  });
  if (data.$metadata.httpStatusCode !== 200) {
    return notFound();
  }

  const size = data.ContentLength as number;
  const file = data.Body as BodyInit;
  const extension = product.filePath.split(".").pop();

  return new NextResponse(file, {
    headers: {
      "Content-Disposition": `attachment; filename="${product.name}.${extension}"`,
      "Content-Length": size?.toString(),
    },
  });
}
