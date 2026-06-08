import { useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { productService } from "@/services/api/endpoints";
import ProductCard from "@/components/ProductCard/ProductCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

const NewArrivals = () => {
  const sliderRef = useRef(null);
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["newArrivals"],
    queryFn: ({ pageParam = 1 }) => productService.getNewArrivals(pageParam, 10),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      const items = lastPage?.data?.data || [];
      return items.length === 10 ? pages.length + 1 : undefined;
    },
  });

  const getWebpImage = (image = "") => image.replace(/\.(jpg|jpeg|png)(\?.*)?$/i, ".webp$2");

  const products = (data?.pages || []).flatMap((page) => page?.data?.data || []).map((p) => {
    const image = p.Product_image || p.image || "";

    return {
      ...p,
      id: p._id,
      name: p.Product_name,
      image: getWebpImage(image),
      Product_image: getWebpImage(image),
      price: Number(p.Product_price || 0),
      discount: Number(p.Product_discount || 0),
      category: p.Product_type,
    };
  });

  const scrollSlider = async (direction) => {
    if (isLoading || isFetchingNextPage) return;

    if (direction === "right" && hasNextPage) {
      await fetchNextPage();
    }

    sliderRef.current?.scrollBy({
      left: direction === "left" ? -280 : 280,
      behavior: "smooth",
    });
  };

  return (
    <section className="w-full py-16 bg-white dark:bg-slate-900/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Premium Header */}
        <div className="mb-12">
          <div>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-tighter leading-tight">
              New <span className="text-gradient">Masterpieces</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-lg md:text-xl font-medium leading-relaxed">
              Explore the latest additions to our curated catalog.
            </p>
          </div>
        </div>

        <div className="relative">
          {products.length > 4 && (
            <button
              onClick={() => scrollSlider("left")}
              disabled={isLoading || isFetchingNextPage}
            className="absolute left-0 top-1/2 z-10 -translate-y-1/2 -translate-x-4 w-11 h-11 rounded-full bg-white dark:bg-slate-900 shadow-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-[#088395] hover:text-white transition-all disabled:opacity-50"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          <div
            ref={sliderRef}
            className="flex gap-6 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {isLoading
              ? [...Array(4)].map((_, i) => (
                  <div key={i} className="min-w-[230px] max-w-[230px]">
                    <ProductCard loading={true} />
                  </div>
                ))
              : error
              ? (
                  <div className="w-full text-center py-20 text-slate-400 font-medium">
                    Failed to load new arrivals
                  </div>
                )
              : products.map((product) => (
                  <div key={product._id} className="min-w-[230px] max-w-[230px]">
                    <ProductCard
                      product={product}
                      path={`/product/${product.slug}`}
                    />
                  </div>
                ))}
            {isFetchingNextPage &&
              [...Array(2)].map((_, i) => (
                <div key={`loading-more-${i}`} className="min-w-[230px] max-w-[230px]">
                  <ProductCard loading={true} />
                </div>
              ))}
          </div>

          {products.length > 4 && (
            <button
              onClick={() => scrollSlider("right")}
              disabled={isLoading || isFetchingNextPage}
              className="absolute right-0 top-1/2 z-10 -translate-y-1/2 translate-x-4 w-11 h-11 rounded-full bg-white dark:bg-slate-900 shadow-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-[#088395] hover:text-white transition-all disabled:opacity-50"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default NewArrivals;
