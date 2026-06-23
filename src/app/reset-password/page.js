'use client';

import { Suspense } from "react";
import MainLayout from "@/components/layout/MainLayout";
import ResetPasswordPage from "@/components/auth/ResetPasswordPage";

export default function Page() {
  return (
    <MainLayout>
      <Suspense fallback={<div className="min-h-screen bg-canvas" />}>
        <ResetPasswordPage />
      </Suspense>
    </MainLayout>
  );
}
