'use client';

import { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import ProductCard from "@/components/ProductCard/ProductCard";
import "swiper/css";
import "swiper/css/navigation";

const ProductRowSlider = ({
  title,
  description,
  href,
  products = [],
  isLoading = false,
  slideCount = 8,
}) => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <div>
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold tracking-tight text-ink">{title}</h3>
          {description && (
            <p className="mt-1 text-sm text-muted">{description}</p>
          )}
        </div>
        {href && (
          <Link href={href} className="shrink-0 text-sm font-medium text-brand hover:underline">
            View all
          </Link>
        )}
      </div>

      <div className="relative px-1">
        <button
          ref={prevRef}
          type="button"
          aria-label={`Previous ${title} products`}
          className="absolute -left-1 top-[30%] z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-surface text-body shadow-premium transition-colors hover:border-brand hover:text-brand md:flex"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <button
          ref={nextRef}
          type="button"
          aria-label={`Next ${title} products`}
          className="absolute -right-1 top-[30%] z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-surface text-body shadow-premium transition-colors hover:border-brand hover:text-brand md:flex"
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        <Swiper
          modules={[Navigation]}
          onBeforeInit={(swiper) => {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
          }}
          onInit={(swiper) => {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
            swiper.navigation.init();
            swiper.navigation.update();
          }}
          slidesPerView="auto"
          spaceBetween={14}
          className="!overflow-hidden"
        >
          {isLoading
            ? Array.from({ length: slideCount }).map((_, i) => (
                <SwiperSlide key={i} className="!w-[170px] !h-auto sm:!w-[188px] md:!w-[200px] lg:!w-[220px]">
                  <ProductCard loading variant="slider" />
                </SwiperSlide>
              ))
            : products.map((product) => (
                <SwiperSlide
                  key={product._id ?? product.id}
                  className="!w-[170px] !h-auto sm:!w-[188px] md:!w-[200px] lg:!w-[220px]"
                >
                  <ProductCard product={product} variant="slider" />
                </SwiperSlide>
              ))}
        </Swiper>
      </div>
    </div>
  );
};

export default ProductRowSlider;
