'use client';

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useProducts } from "@/services/api/product";
import ProductCard from "@/components/ProductCard/ProductCard";

const SKELETON_COUNT = 5;
const CARD_WIDTH = "min-w-[240px] max-w-[240px]";

const HomeProductCarousel = ({ title, subtitle }) => {
  const sliderRef = useRef(null);
  const { data: products = [], isLoading, isError } = useProducts(1, 20, "", {
    retry: false,
    refetchOnWindowFocus: false,
  });

  const showSkeleton = isLoading || isError;

  const scrollSlider = (direction) => {
    sliderRef.current?.scrollBy({
      left: direction === "left" ? -280 : 280,
      behavior: "smooth",
    });
  };

  return (
    <section className="container-page py-12">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-ink">{title}</h2>
          {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
        </div>
        <div className="hidden gap-2 sm:flex">
          <button
            onClick={() => scrollSlider("left")}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-line text-body transition-colors hover:border-brand hover:text-brand"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => scrollSlider("right")}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-line text-body transition-colors hover:border-brand hover:text-brand"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div
        ref={sliderRef}
        className="flex gap-5 overflow-x-auto scroll-smooth scrollbar-hide pb-2"
      >
        {showSkeleton
          ? [...Array(SKELETON_COUNT)].map((_, i) => (
              <div key={i} className={CARD_WIDTH}>
                <ProductCard loading />
              </div>
            ))
          : products.map((product) => (
              <div
                key={product.Product_ID || product._id || product.slug}
                className={CARD_WIDTH}
              >
                <ProductCard
                  product={product}
                  path={product.slug ? `/product/${product.slug}` : "/product-details"}
                />
              </div>
            ))}
      </div>
    </section>
  );
};

export default HomeProductCarousel;
