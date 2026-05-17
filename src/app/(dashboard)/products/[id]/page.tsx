import { MOCK_PRODUCTS } from "@/lib/mock-data/products";
import ProductDetailView from "./ProductDetailView";

export function generateStaticParams() {
  return MOCK_PRODUCTS.map((p) => ({ id: p.id }));
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ProductDetailView id={id} />;
}
