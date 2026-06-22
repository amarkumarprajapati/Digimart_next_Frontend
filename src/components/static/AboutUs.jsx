'use client';

import Link from "next/link";
import { ChevronRight, ShoppingBag, Shield, Truck, Heart, ArrowRight } from "lucide-react";

const FEATURES = [
  {
    icon: ShoppingBag,
    title: "Curated selection",
    description: "Thousands of quality products across clothing, home, beauty, and accessories.",
  },
  {
    icon: Shield,
    title: "Secure shopping",
    description: "Your data and payments are protected with industry-standard security.",
  },
  {
    icon: Truck,
    title: "Fast delivery",
    description: "Reliable shipping with clear tracking from checkout to your door.",
  },
  {
    icon: Heart,
    title: "Customer first",
    description: "Friendly support and hassle-free returns when you need us.",
  },
];

const STATS = [
  { value: "10K+", label: "Products listed" },
  { value: "50K+", label: "Happy customers" },
  { value: "99%", label: "On-time delivery" },
  { value: "24/7", label: "Support available" },
];

export default function AboutUs() {
  return (
    <div className="bg-canvas">
      <div className="container-page py-6">
        <nav className="mb-6 flex items-center gap-1 text-sm text-muted">
          <Link href="/" className="hover:text-brand">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-ink">About us</span>
        </nav>

        {/* Hero */}
        <section className="overflow-hidden rounded-2xl border border-line bg-surface">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-14">
              <span className="text-sm font-medium uppercase tracking-wide text-brand">
                About DigiMart
              </span>
              <h1 className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl lg:text-5xl">
                Quality essentials, built on trust.
              </h1>
              <p className="mt-4 max-w-lg text-base leading-relaxed text-muted">
                DigiMart brings together timeless products for everyday life — from clothing and
                home goods to beauty and accessories — with fair prices and a shopping experience
                you can rely on.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/products" className="btn-primary h-11 px-6 text-sm">
                  Shop now
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/contact" className="btn-outline h-11 px-6 text-sm">
                  Contact us
                </Link>
              </div>
            </div>
            <div className="relative min-h-[260px] lg:min-h-[420px]">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80"
                alt="Team collaborating"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {STATS.map((stat) => (
            <div key={stat.label} className="card p-5 text-center">
              <p className="text-2xl font-semibold text-ink sm:text-3xl">{stat.value}</p>
              <p className="mt-1 text-sm text-muted">{stat.label}</p>
            </div>
          ))}
        </section>

        {/* Our story */}
        <section className="mt-12 grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="card overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1556745757-8d76bdb6834?auto=format&fit=crop&w=1000&q=80"
              alt="DigiMart storefront"
              className="aspect-[4/3] w-full object-cover lg:aspect-square"
            />
          </div>
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">Our story</h2>
            <p className="mt-4 text-base leading-relaxed text-body">
              DigiMart started with a simple idea: make it easy to find well-made products without
              the noise. What began as a small curated shop has grown into a destination for
              customers who value quality, clarity, and care.
            </p>
            <p className="mt-4 text-base leading-relaxed text-body">
              Today we serve shoppers across the country with a wide catalog, transparent pricing,
              and a team that stands behind every order. Whether you are refreshing your wardrobe
              or upgrading your home, we are here to help you choose with confidence.
            </p>
          </div>
        </section>

        {/* Why choose us */}
        <section className="mt-14">
          <div className="mb-8 max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              Why choose DigiMart
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted sm:text-base">
              We focus on the details that matter — selection, security, speed, and support — so
              every visit feels straightforward and trustworthy.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map(({ icon: Icon, title, description }) => (
              <article
                key={title}
                className="card p-6 transition-all duration-200 hover:border-brand/25 hover:shadow-soft"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-brand-soft">
                  <Icon className="h-5 w-5 text-brand" />
                </div>
                <h3 className="text-base font-semibold text-ink">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>
              </article>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mt-14 mb-4">
          <div className="rounded-2xl border border-line bg-surface p-8 sm:p-10">
            <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-xl font-semibold text-ink sm:text-2xl">
                  Ready to explore?
                </h2>
                <p className="mt-2 max-w-md text-sm text-muted">
                  Browse our full catalog of clothing, home, beauty, and accessories.
                </p>
              </div>
              <Link href="/products" className="btn-primary h-11 shrink-0 px-6 text-sm">
                Browse all products
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
