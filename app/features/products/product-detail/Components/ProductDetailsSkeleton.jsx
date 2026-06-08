import React from "react";

const ProductDetailsSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen animate-pulse">
      {/* Main Product Section Skeleton */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Image Gallery Skeleton */}
              <div className="flex gap-4">
                <div className="flex flex-col gap-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-16 h-20 rounded-lg bg-gray-200 dark:bg-gray-800" />
                  ))}
                </div>
                <div className="flex-1 h-[500px] rounded-2xl bg-gray-200 dark:bg-gray-800" />
              </div>

              {/* Product Info Skeleton */}
              <div className="flex flex-col space-y-6">
                <div>
                  <div className="h-4 w-32 bg-gray-200 dark:bg-gray-800 rounded mb-2" />
                  <div className="h-10 w-full bg-gray-200 dark:bg-gray-800 rounded mb-4" />
                  <div className="h-8 w-40 bg-gray-200 dark:bg-gray-800 rounded" />
                </div>

                <div className="h-6 w-32 bg-gray-200 dark:bg-gray-800 rounded" />

                <div className="space-y-2">
                  <div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded" />
                  <div className="h-20 w-full bg-gray-200 dark:bg-gray-800 rounded" />
                </div>

                <div className="flex gap-3 pt-4">
                  <div className="flex-1 h-12 bg-gray-200 dark:bg-gray-800 rounded-xl" />
                  <div className="flex-1 h-12 bg-gray-200 dark:bg-gray-800 rounded-xl" />
                </div>

                <div className="h-16 w-full bg-gray-100 dark:bg-gray-800/50 rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section Skeleton */}
      <div className="border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 py-12">
        <div className="container mx-auto px-4">
          <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="col-span-1 space-y-4">
              <div className="h-32 w-full bg-gray-200 dark:bg-gray-800 rounded-xl" />
              <div className="h-48 w-full bg-gray-200 dark:bg-gray-800 rounded-xl" />
            </div>
            <div className="col-span-2 space-y-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 w-full bg-gray-200 dark:bg-gray-800 rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsSkeleton;
