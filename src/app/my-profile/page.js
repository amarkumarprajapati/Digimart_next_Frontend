'use client';

import MainLayout from "@/components/layout/MainLayout";
import ProfilePage from "@/components/account/ProfilePage";

export default function MyProfileRoute() {
  return (
    <MainLayout>
      <ProfilePage />
    </MainLayout>
  );
}
