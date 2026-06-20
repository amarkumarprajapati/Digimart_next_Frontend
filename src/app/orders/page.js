'use client';

import MainLayout from "@/components/layout/MainLayout";
import OrdersPage from "@/components/account/OrdersPage";

export default function OrdersRoute() {
  return (
    <MainLayout>
      <OrdersPage />
    </MainLayout>
  );
}
