import db from "@/db/db";
import { NextRequest, NextResponse } from "next/server";
import { S3 } from "@aws-sdk/client-s3";
import { notFound } from "next/navigation";

const s3 = new S3({
  region: process.env.S3_REGION as string,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

export async function GET(
  req: NextRequest,
  {
    params: { downloadVerificationId },
  }: { params: { downloadVerificationId: string } }
) {
  const data = await db.downloadVerification.findUnique({
    where: { id: downloadVerificationId, expiresAt: { gt: new Date() } },
    select: { product: { select: { filePath: true, name: true } } },
  });
  if (data == null) {
    return NextResponse.redirect(
      new URL("/products/download/expired", req.url)
    );
  }
  const fileData = await s3.getObject({
    Bucket: "mybuckettestproject",
    Key: `e-commerce/pattern/${data.product.filePath}`,
  });
  if (fileData.$metadata.httpStatusCode !== 200) {
    return notFound();
  }

  const size = fileData.ContentLength as number;
  const file = fileData.Body as BodyInit;
  const extension = data.product.filePath.split(".").pop();

  return new NextResponse(file, {
    headers: {
      "Content-Disposition": `attachment; filename="${data.product.name}.${extension}"`,
      "Content-Length": size?.toString(),
    },
  });
}
