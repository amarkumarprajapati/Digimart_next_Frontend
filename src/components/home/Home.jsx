'use client';

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Mail } from "lucide-react";
import {
  useNewArrivals,
  usePopularProducts,
  useTrendingProducts,
} from "@/services/api/product";
import ProductRowSlider from "./ProductRowSlider";

const CATEGORIES = [
  { name: "Clothing", image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=600&q=80" },
  { name: "Home", image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&w=600&q=80" },
  { name: "Beauty", image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80" },
  { name: "Accessories", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80" },
];

const PRODUCT_QUERY_OPTS = {
  retry: false,
  refetchOnWindowFocus: false,
};

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const { data: newProducts = [], isLoading: loadingNew } = useNewArrivals(
    8,
    1,
    PRODUCT_QUERY_OPTS
  );
  const { data: popularProducts = [], isLoading: loadingPopular } = usePopularProducts(
    8,
    1,
    PRODUCT_QUERY_OPTS
  );
  const { data: trendingProducts = [], isLoading: loadingTrending } = useTrendingProducts(
    8,
    1,
    PRODUCT_QUERY_OPTS
  );

  const handleNewsletter = (e) => {
    e.preventDefault();
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 3000);
  };

  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="container-page pt-8 pb-4">
        <div className="relative overflow-hidden rounded-2xl border border-line bg-surface">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-16">
              <span className="text-sm font-medium uppercase tracking-wide text-brand">New season</span>
              <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-tight text-ink sm:text-5xl">
                Quality essentials, made for real life.
              </h1>
              <p className="mt-4 max-w-md text-base leading-relaxed text-muted">
                Timeless pieces for you and your home — clothing, home goods, beauty and accessories.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/products" className="btn-primary h-11 px-6 text-sm">
                  Shop now
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/products" className="btn-outline h-11 px-6 text-sm">
                  Browse all
                </Link>
              </div>
            </div>
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

      {/* Categories */}
      <section className="container-page py-12">
        <h2 className="text-2xl font-semibold tracking-tight text-ink">Shop by category</h2>
        <p className="mt-1 mb-6 text-sm text-muted">Find what you need across our core collections.</p>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.name}
              type="button"
              onClick={() => router.push(`/products?category=${cat.name.toLowerCase()}`)}
              className="group overflow-hidden rounded-xl border border-line bg-surface text-left"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img src={cat.image} alt={cat.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <p className="p-4 text-sm font-semibold text-ink">{cat.name}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="container-page py-12">
       

        <div className="space-y-14">
          <ProductRowSlider
            title="Newly added"
            description="Latest products sorted by newest first."
            href="/products"
            products={newProducts}
            isLoading={loadingNew}
          />

          <ProductRowSlider
            title="Most popular"
            description="Top picks ranked by orders, likes, reviews, and ratings."
            href="/products"
            products={popularProducts}
            isLoading={loadingPopular}
          />

          <ProductRowSlider
            title="Trending now"
            description="Most viewed and engaged products right now."
            href="/products"
            products={trendingProducts}
            isLoading={loadingTrending}
          />
        </div>
      </section>

      {/* Newsletter */}
      <section className="container-page py-12">
        <div className="rounded-2xl border border-line bg-surface p-8 sm:p-12">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-ink">Join our mailing list</h2>
              <p className="mt-2 max-w-md text-sm text-muted">
                New arrivals, restocks and offers — no spam, unsubscribe anytime.
              </p>
            </div>
            <form onSubmit={handleNewsletter} className="flex w-full max-w-md gap-3 lg:ml-auto">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="field h-11 pl-10 pr-4 text-sm"
                />
              </div>
              <button type="submit" className="btn-primary h-11 px-5 text-sm whitespace-nowrap">
                {subscribed ? "Subscribed" : "Subscribe"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
