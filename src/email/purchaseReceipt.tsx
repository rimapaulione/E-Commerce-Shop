import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Tailwind,
} from "@react-email/components";
import { OrderInformation } from "./components/orderInformation";

type PurchaseReceiptEmailProps = {
  product: { name: string; imagePath: string; description: string };
  order: { id: string; createdAt: Date; pricePaidInCents: number };
  downloadVerificationId: string;
};


export default function PurchaseReceiptEmail({
  product,
  order,
  downloadVerificationId,
}: PurchaseReceiptEmailProps) {
  return (
    <Html>
      <Preview>Download {product.name} and view receipt</Preview>
      <Tailwind>
        <Head />

        <Body className="font-sans bg-white">
          <Container className="max-w-xl">
            <Heading>Purchase Receipt</Heading>
            <OrderInformation
              product={product}
              order={order}
              downloadVerificationId={downloadVerificationId}
            />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
