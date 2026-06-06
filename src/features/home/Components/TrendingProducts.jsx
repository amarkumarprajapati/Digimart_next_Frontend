import { useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { productService } from "@/api/endpoints";
import ProductCard from "@/components/ProductCard/ProductCard";

const TrendingProducts = () => {
    const sliderRef = useRef(null);
    const {
        data,
        isLoading: loading,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ["trendingProducts"],
        queryFn: ({ pageParam = 1 }) => productService.getTrendingProducts(pageParam, 10),
        initialPageParam: 1,
        getNextPageParam: (lastPage, pages) => {
            const items = lastPage?.data?.data || [];
            return items.length === 10 ? pages.length + 1 : undefined;
        },
    });

    const products = (data?.pages || []).flatMap((page) => page?.data?.data || []).map((p) => ({
        ...p,
        id: p._id,
        name: p.Product_name,
        image: p.Product_image,
        price: Number(p.Product_price || 0),
        discount: Number(p.Product_discount || 0),
        category: p.Product_type,
    }));

    const scrollSlider = async (direction) => {
        if (direction === "right" && hasNextPage && !isFetchingNextPage) {
            await fetchNextPage();
        }

        sliderRef.current?.scrollBy({
            left: direction === "left" ? -280 : 280,
            behavior: "smooth",
        });
    };

    return (
        <section className="w-full py-16 bg-slate-50 dark:bg-slate-950/20 bg-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                {/* Premium Header */}
                <div className="mb-10">
                    <div className="max-w-2xl">
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tighter">
                            Elite <span className="text-gradient">Trending</span>
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 text-lg">
                            Stay ahead of the curve with our most sought-after products. Handpicked for their exceptional performance and style.
                        </p>
                    </div>
                </div>

                <div className="relative">
                    {products.length > 4 && (
                        <button
                            onClick={() => scrollSlider("left")}
                            className="absolute left-0 top-1/2 z-10 -translate-y-1/2 -translate-x-4 w-11 h-11 rounded-full bg-white dark:bg-slate-900 shadow-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-[#088395] hover:text-white transition-all"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                    )}

                    <div
                        ref={sliderRef}
                        className="flex gap-6 overflow-x-auto scroll-smooth scrollbar-hide pb-2"
                    >
                        {loading
                            ? [...Array(4)].map((_, i) => (
                                <div key={i} className="min-w-[230px] max-w-[230px]">
                                    <ProductCard loading={true} />
                                </div>
                            ))
                            : error
                                ? (
                                    <div className="w-full text-center py-20 text-slate-400 font-medium">
                                        Failed to load trending products
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
                            className="absolute right-0 top-1/2 z-10 -translate-y-1/2 translate-x-4 w-11 h-11 rounded-full bg-white dark:bg-slate-900 shadow-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-[#088395] hover:text-white transition-all"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </div>
        </section>
    );
};

export default TrendingProducts;
