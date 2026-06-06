/* eslint-disable */
import { Rate, Empty } from 'antd';
import { HeartOutlined } from '@ant-design/icons';
import { useRouter } from "next/navigation";

const RelatedProducts = ({ products, title = "Related Product" }) => {
  const router = useRouter();

  if (!products || products.length === 0) {
    return (
      <div className="py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        </div>
        <Empty description="No similar products found." />
      </div>
    );
  }

  const handleProductClick = (productId) => {
    router.push(`/product/${productId}`);
  };

  return (
    <div className="py-8">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <button className="text-sm text-gray-600 hover:text-gray-900 underline">
          View All
        </button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {products.slice(0, 5).map((product) => {
          const productId = product.id || product.Product_ID;
          const productName = product.name || product.Product_Name || "Product";
          const productPrice = product.price || product.SP || 0;
          const productImage = product.image || product.Image_URL || "";
          const productRating = product.rating || product.Rating || 0;
          const reviewCount = product.reviewCount || product.Review_Count || 0;

          return (
            <div
              key={productId}
              onClick={() => handleProductClick(productId)}
              className="group cursor-pointer"
            >
              {/* Product Image */}
              <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-gray-100 mb-3">
                <img
                  src={productImage}
                  alt={productName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
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
                  ${productPrice.toFixed ? productPrice.toFixed(2) : productPrice}
                </p>
                <div className="flex items-center gap-1">
                  <Rate
                    disabled
                    allowHalf
                    value={productRating}
                    className="text-xs"
                    style={{ fontSize: '12px' }}
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
  );
};

export default RelatedProducts;
