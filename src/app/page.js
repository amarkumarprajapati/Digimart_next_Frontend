'use client';

import MainLayout from "@/components/layout/MainLayout";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import Home from "@/components/home/Home";

export default function HomePage() {
  return (
    <MainLayout>
      <ScrollToTop />
      <Home />
    </MainLayout>
  );
}
