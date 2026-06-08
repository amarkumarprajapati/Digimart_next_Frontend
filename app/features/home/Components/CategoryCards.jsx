import { useRouter } from "next/navigation";
import {
  Smartphone,
  Laptop,
  Tv,
  Headphones,
  Watch,
  LayoutGrid,
} from "lucide-react";

const categories = [
  { id: 1, name: "Mobiles", icon: Smartphone, count: "120+ Items" },
  { id: 2, name: "Laptops", icon: Laptop, count: "85+ Items" },
  { id: 3, name: "TVs", icon: Tv, count: "45+ Items" },
  { id: 4, name: "Headphones", icon: Headphones, count: "200+ Items" },
  { id: 5, name: "Watches", icon: Watch, count: "150+ Items" },
];

const CategoryCards = () => {
  const router = useRouter();

  return (
    <section className="w-full py-16 bg-white dark:bg-slate-950/20">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Premium Section Header */}
        <div className="flex flex-col items-center text-center mb-10">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tighter mb-6">
            Shop by <span className="text-gradient">Experience</span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl mx-auto font-medium">
            Discover a world of premium technology across our meticulously
            selected categories.
          </p>
        </div>

        {/* Minimalist Grid Layout */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <div
                key={category.id}
                onClick={() =>
                  router.push(`/products?category=${category.name.toLowerCase()}`)
                }
                className="group cursor-pointer flex flex-col items-center"
              >
                {/* Icon Container */}
                <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-[2rem] bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center mb-6 transition-all duration-700 ease-premium group-hover:scale-110 group-hover:-rotate-6 group-hover:bg-white group-hover:shadow-hover group-hover:border-cyan-500/20">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-cyan-500/0 group-hover:from-cyan-500/5 group-hover:to-cyan-500/10 rounded-[2rem] transition-all duration-700" />
                  <Icon className="w-10 h-10 md:w-12 md:h-12 text-slate-400 group-hover:text-cyan-500 transition-colors duration-700" />
                </div>

                {/* Text Content */}
                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-2 transition-all group-hover:text-cyan-600">
                  {category.name}
                </h3>
                <div className="h-1 w-0 bg-cyan-500 rounded-full transition-all duration-500 group-hover:w-8 mb-2" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter transition-all group-hover:text-slate-500">
                  {category.count}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoryCards;
