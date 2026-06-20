'use client';

import { useEffect } from "react";
import HeroSection from "./Components/HeroSection";
import CategoryCards from "./Components/CategoryCards";
import Popular from "./Components/Popular";
import NewsletterSignup from "./Components/NewsletterSection";
import NewArrivals from "./Components/NewArived";
import TrendingProducts from "./Components/TrendingProducts";
import { useDispatch } from "react-redux";
import { setProducts } from "@/store/slices/productSlice";
import { initScrollReveal } from "@/hooks/useScrollReveal";
import { useProducts } from "@/services/api/product";

const Home = () => {
  const dispatch = useDispatch();
  const { data: popularProducts = [], isLoading: loading } = useProducts(1, 20, "", {
    retry: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (popularProducts.length > 0) {
      dispatch(setProducts(popularProducts));
    }
  }, [popularProducts, dispatch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const cleanup = initScrollReveal();
      return cleanup;
    }, 100);
    return () => clearTimeout(timer);
  }, [loading]);

  return (
    <div className="overflow-hidden">
      <HeroSection />
      <div className="section-reveal">
        <CategoryCards />
      </div>
      <div className="section-reveal">
        <Popular />
      </div>
      <div className="section-reveal">
        <NewArrivals />
      </div>
      <div className="section-reveal">
        <TrendingProducts />
      </div>
      <div className="section-reveal">
        <NewsletterSignup />
      </div>
    </div>
  );
};

export default Home;
