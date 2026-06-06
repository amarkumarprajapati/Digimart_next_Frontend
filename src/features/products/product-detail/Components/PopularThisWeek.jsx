import { Rate, Empty } from "antd";
import { HeartOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";

const PopularThisWeek = ({ products = [], maxProducts = 10 }) => {
  const navigate = useRouter();
  const scrollContainerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const handleProductClick = (productId) => {
    router.push(`/product/${productId}`);
  };

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      if (direction === "left") {
        scrollContainerRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      } else {
        scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const displayProducts = products.slice(0, maxProducts);
  const hasMoreProducts = displayProducts.length > 5;

  return (
    <div className="max-w-7xl mx-auto py-8">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Popular this week
        </h2>
        {hasMoreProducts && (
          <div className="flex gap-2">
            <button
              onClick={() => scroll("left")}
              className={`w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors ${
                !showLeftArrow ? "opacity-30 cursor-not-allowed" : ""
              }`}
              disabled={!showLeftArrow}
            >
              <LeftOutlined />
            </button>
            <button
              onClick={() => scroll("right")}
              className={`w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors ${
                !showRightArrow ? "opacity-30 cursor-not-allowed" : ""
              }`}
              disabled={!showRightArrow}
            >
              <RightOutlined />
            </button>
          </div>
        )}
      </div>

      {/* Products Slider */}
      {products.length === 0 ? (
        <Empty description="No popular products this week" />
      ) : (
        <div className="relative">
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className={`flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth ${
              hasMoreProducts ? "pb-4" : "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 flex-wrap"
            }`}
            style={hasMoreProducts ? {} : { overflowX: "visible" }}
          >
            {displayProducts.map((product) => {
            const productId = product._id || product.id || product.Product_ID;
            const productName =
              product.Product_name || product.name || product.Product_Name || "Product";
            const productPrice = product.Product_price || product.price || product.SP || 0;
            const productImage = product.Product_image || product.image || product.Image_URL || "";
            const productRating = product.rating || product.Rating || 0;
            const reviewCount =
              product.reviewCount || product.Review_Count || 0;

            return (
              <div
                key={productId}
                onClick={() => handleProductClick(productId)}
                className="group cursor-pointer flex-shrink-0"
                style={{ width: hasMoreProducts ? "200px" : "auto" }}
              >
                {/* Product Image */}
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-gray-100 mb-3">
                  <img
                    src={productImage}
                    alt={productName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/300x400?text=No+Image";
                    }}
                  />
                  {/* Wishlist Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle wishlist toggle
                    }}
                    className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-50"
                  >
                    <HeartOutlined className="text-gray-600" />
                  </button>
                </div>

                {/* Product Info */}
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-gray-900 line-clamp-1 group-hover:text-gray-600 transition-colors">
                    {productName}
                  </h3>
                  <p className="text-sm font-bold text-gray-900">
                    $
                    {productPrice.toFixed
                      ? productPrice.toFixed(2)
                      : productPrice}
                  </p>
                  <div className="flex items-center gap-1">
                    <Rate
                      disabled
                      allowHalf
                      value={productRating}
                      className="text-xs"
                      style={{ fontSize: "12px" }}
                    />
                    <span className="text-xs text-gray-500">
                      ({reviewCount})
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        </div>
      )}
    </div>
  );
};

export default PopularThisWeek;
