import { Suspense } from "react";
import ProductsClient from "./ProductsClient";

export default function ProductsPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  return (
    <Suspense fallback={<div>Loading products...</div>}>
      <ProductsClient searchParams={searchParams} />
    </Suspense>
  );
}
