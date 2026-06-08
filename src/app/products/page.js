'use client';

import { Suspense } from "react";
import AllProductsPage from "@/features/products/listing/AllProductsPage";

export default function ProductsRoute() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 dark:bg-gray-950" />}>
      <AllProductsPage />
    </Suspense>
  );
}