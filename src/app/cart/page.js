'use client';

import MainLayout from "@/app-shell/MainLayout";
import CartPage from "@/features/cart/CartPage";

export default function CartRoute() {
  return (
    <MainLayout>
      <CartPage />
    </MainLayout>
  );
}
