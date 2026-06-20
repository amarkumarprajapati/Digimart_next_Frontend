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
    <div ref={ref} className="flex justify-center py-12">
      {isFetchingNextPage ? (
        <div className="flex items-center gap-2 text-sm text-muted">
          <Loader2 className="h-4 w-4 animate-spin text-brand" />
          Loading more...
        </div>
      ) : !hasNextPage ? (
        <p className="text-sm text-muted">You&apos;ve reached the end.</p>
      ) : null}
    </div>
  );
};

export default LoadMoreTrigger;
