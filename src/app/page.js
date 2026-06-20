'use client';

import MainLayout from "@/app-shell/MainLayout";
import { ScrollToTop } from "@/app-shell/ScrollToTop";
import Home from "@/features/home/Home";

export default function HomePage() {
  return (
    <MainLayout>
      <ScrollToTop />
      <Home />
    </MainLayout>
  );
}
