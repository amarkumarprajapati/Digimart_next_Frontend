import { useRef, useEffect } from "react";
import { Loader2 } from "lucide-react";

const LoadMoreTrigger = ({ loaderRef, isFetchingNextPage, hasNextPage, onLoadMore }) => {
  const internalRef = useRef(null);
  const ref = loaderRef || internalRef;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          onLoadMore();
        }
      },
      { threshold: 1.0 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, onLoadMore, ref]);

  return (
    <div ref={ref} className="py-20 flex justify-center">
      {isFetchingNextPage ? (
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-6 h-6 text-[#088395] animate-spin" />
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Discovering more items...</p>
        </div>
      ) : !hasNextPage ? (
        <div className="flex flex-col items-center gap-4">
          <div className="h-px w-20 bg-gray-200 dark:bg-gray-800" />
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">You've reached the end of the collection</p>
        </div>
      ) : null}
    </div>
  );
};

export default LoadMoreTrigger;
