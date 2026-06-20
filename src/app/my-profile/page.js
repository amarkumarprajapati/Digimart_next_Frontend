'use client';

import MainLayout from "@/app-shell/MainLayout";
import ProfilePage from "@/features/account/ProfilePage";

export default function MyProfileRoute() {
  return (
    <MainLayout>
      <ProfilePage />
    </MainLayout>
  );
}
