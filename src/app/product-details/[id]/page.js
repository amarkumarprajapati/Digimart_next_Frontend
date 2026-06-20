'use client';

import MainLayout from "@/components/layout/MainLayout";
import ProductDetailsPage from "@/components/products/ProductDetails";

export default function ProductDetailRoute() {
  return (
    <MainLayout>
      <ProductDetailsPage />
    </MainLayout>
  );
}
