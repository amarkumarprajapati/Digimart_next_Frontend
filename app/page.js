'use client';

import MainLayout from "./MainLayout";
import { ScrollToTop } from "./ScrollToTop";
import Home from "@/features/home/Home";
import Header from "@/components/Header/HeaderComponent";
import Footer from "@/components/footer/FooterComponent";

export default function HomePage() {
  return (
    <MainLayout>
      <ScrollToTop />
      <Home />
    </MainLayout>
  );
}
