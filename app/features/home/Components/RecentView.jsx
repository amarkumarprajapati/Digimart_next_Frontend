import { useRouter } from "next/navigation";
import { History, ArrowRight } from "lucide-react";
import { resentproduct } from '../../../data';
import ProductCard from "@/components/ProductCard/ProductCard";

const RecentView = () => {
  const router = useRouter();

  if (!resentproduct || resentproduct.length === 0) return null;

  return (
    <section className="py-24 bg-white dark:bg-slate-900/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Premium Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 mb-4">
              <History className="w-3.5 h-3.5" />
              <span className="text-[10px] font-black uppercase tracking-widest">Your History</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tighter">
              Recently <span className="text-gradient">Viewed</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-lg">
              Quickly jump back into the products you've been exploring. Your personalized selection.
            </p>
          </div>

          <button
            onClick={() => router.push("/products")}
            className="group flex items-center gap-3 text-slate-900 dark:text-white font-black text-xs uppercase tracking-widest"
          >
            View More Products
            <div className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center group-hover:bg-slate-950 group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-all">
              <ArrowRight className="w-4 h-4" />
            </div>
          </button>
        </div>

        {/* Premium Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {resentproduct.slice(0, 4).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              path={`/product/${product.slug || product.id}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecentView;
