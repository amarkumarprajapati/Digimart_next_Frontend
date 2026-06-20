'use client';

import MainLayout from "@/app-shell/MainLayout";
import CheckoutPage from "@/features/checkout/CheckoutPage";

export default function CheckoutRoute() {
  return (
    <MainLayout>
      <CheckoutPage />
    </MainLayout>
  );
}
