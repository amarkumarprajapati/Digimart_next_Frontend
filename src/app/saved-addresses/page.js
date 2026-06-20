'use client';

import MainLayout from "@/app-shell/MainLayout";
import AddressesPage from "@/features/account/AddressesPage";

export default function SavedAddressesRoute() {
  return (
    <MainLayout>
      <AddressesPage />
    </MainLayout>
  );
}
