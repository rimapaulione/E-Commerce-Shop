import { formatCurrency } from "@/lib/formatters";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card";

import { Button } from "./button";
import Link from "next/link";
import Image from "next/image";

type ProductCartProps = {
  name: string;
  priceInCents: number;
  description: string;
  id: string;
  imagePath: string;
};

export function ProductsCard({
  name,
  priceInCents,
  description,
  id,
  imagePath,
}: ProductCartProps) {
  return (
    <Card className="flex overflow-hidden flex-col">
      <div className="relative w-full aspect-video">
        <Image
          src={`${process.env.PHOTO_ADDRESS}${imagePath}`}
          alt={name}
          fill
          className="object-fit"
          //unoptimized={true}
        />
      </div>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{formatCurrency(priceInCents / 100)}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="line-clamp-4">{description}</p>
      </CardContent>
      <CardFooter>
        <Button asChild size="lg" className="w-full">
          <Link href={`/products/${id}/purchase`}>Purchase</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export function ProductsCardSkeleton() {
  return (
    <Card className="flex overflow-hidden flex-col animate-pulse">
      <span className="bg-gray-300 w-full aspect-video" />

      <CardHeader>
        <CardTitle>
          <span className="bg-gray-300 rounded-full w-3/4 h-6"></span>
        </CardTitle>
        <CardDescription>
          <span className="bg-gray-300 rounded-full w-1/2 h-4"></span>
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-2">
        <span className="bg-gray-300 rounded-full w-full h-4"></span>
        <span className="bg-gray-300 rounded-fullw-full h-4"></span>
        <span className="bg-gray-300 rounded-full w-3/4 h-4"></span>
      </CardContent>
      <CardFooter>
        <Button size="lg" className="w-full"></Button>
      </CardFooter>
    </Card>
  );
}
