'use client';

import { Suspense } from "react";
import MainLayout from "@/components/layout/MainLayout";
import AllProductsPage from "@/components/products/AllProductsPage";

export default function ProductsRoute() {
  return (
    <MainLayout>
      <Suspense fallback={<div className="min-h-screen bg-canvas" />}>
        <AllProductsPage />
      </Suspense>
    </MainLayout>
  );
}
