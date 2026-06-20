'use client';

import MainLayout from "@/app-shell/MainLayout";
import OrdersPage from "@/features/account/OrdersPage";

export default function OrdersRoute() {
  return (
    <MainLayout>
      <OrdersPage />
    </MainLayout>
  );
}
