'use client';

import { useRouter } from "next/navigation";

const categories = [
  {
    name: "Clothing",
    image:
      "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Home",
    image:
      "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Beauty",
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Accessories",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
  },
];

const CategoryCards = () => {
  const router = useRouter();

  return (
    <section className="container-page py-12">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold tracking-tight text-ink">
          Shop by category
        </h2>
        <p className="mt-1 text-sm text-muted">
          Find what you need across our core collections.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {categories.map((category) => (
          <button
            key={category.name}
            onClick={() =>
              router.push(`/products?category=${category.name.toLowerCase()}`)
            }
            className="group relative overflow-hidden rounded-xl border border-line bg-surface text-left"
          >
            <div className="aspect-[4/3] overflow-hidden">
              <img
                src={category.image}
                alt={category.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="flex items-center justify-between p-4">
              <span className="text-sm font-semibold text-ink">{category.name}</span>
              <span className="text-sm text-brand opacity-0 transition-opacity group-hover:opacity-100">
                Shop →
              </span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};

export default CategoryCards;
