'use client';

import Link from "next/link";
import { ArrowRight } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="container-page pt-8 pb-4">
      <div className="relative overflow-hidden rounded-2xl border border-line bg-surface">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Copy */}
          <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-16">
            <span className="text-sm font-medium uppercase tracking-wide text-brand">
              New season
            </span>
            <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-tight text-ink sm:text-5xl">
              Quality essentials, made for real life.
            </h1>
            <p className="mt-4 max-w-md text-base leading-relaxed text-muted">
              Timeless pieces for you and your home — clothing, home goods, beauty
              and accessories. Considered design, fair prices.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/products" className="btn-primary h-11 px-6 text-sm">
                Shop new arrivals
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/products" className="btn-outline h-11 px-6 text-sm">
                Browse categories
              </Link>
            </div>
          </div>

          {/* Image */}
          <div className="relative min-h-[280px] lg:min-h-[460px]">
            <img
              src="https://images.unsplash.com/photo-1567016432779-094069958ea5?auto=format&fit=crop&w=1200&q=80"
              alt="Lifestyle"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
