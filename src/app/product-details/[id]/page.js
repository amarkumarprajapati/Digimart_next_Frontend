'use client';

import MainLayout from "@/app-shell/MainLayout";
import ProductDetailsPage from "@/features/products/product-detail/ProductDetails";

export default function ProductDetailRoute() {
  return (
    <MainLayout>
      <ProductDetailsPage />
    </MainLayout>
  );
}
