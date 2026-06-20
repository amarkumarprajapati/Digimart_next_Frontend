'use client';

import { Suspense } from "react";
import MainLayout from "@/app-shell/MainLayout";
import AllProductsPage from "@/features/products/listing/AllProductsPage";

export default function ProductsRoute() {
  return (
    <MainLayout>
      <Suspense fallback={<div className="min-h-screen bg-canvas" />}>
        <AllProductsPage />
      </Suspense>
    </MainLayout>
  );
}
