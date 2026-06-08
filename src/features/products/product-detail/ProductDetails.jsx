import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "next/navigation";
import { setCurrentProduct } from "@/store/slices/currentProductSlice";
import { productService } from "@/services/api/endpoints";
import ProductDetailsSkeleton from "./Components/ProductDetailsSkeleton";
import ProductMain from "./Components/ProductMain";
import ReviewsSection from "./Components/ReviewsSection";
import PopularThisWeek from "./Components/PopularThisWeek";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { currentProduct, similarProducts, recentlyViewed } =
    useSelector((state) => state.currentProduct);

  // Extract full API data from response
  const [fullApiData, setFullApiData] = useState(null);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setLoading(true);
      setReviewsLoading(true);
      try {
        const response = await productService.getProductDetail(id);
        if (response.data.success) {
          setFullApiData(response.data.data);
          dispatch(setCurrentProduct(response.data.data));
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
        setReviewsLoading(false);
      }
    };
    fetchProduct();
  }, [id, dispatch]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentProduct]);

  if (loading) {
    return <ProductDetailsSkeleton />;
  }

  if (!currentProduct && !loading) {
    return <div className="min-h-screen flex items-center justify-center">Product not found</div>;
  }

  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen">
      {/* Main Product Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 md:p-8">
          <ProductMain currentProduct={currentProduct} />
        </div>
      </div>


      {/* Reviews Section */}
      <div className="border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4">
          <ReviewsSection
            product={currentProduct}
            reviews={fullApiData?.detailedReviews?.reviews || []}
            ratingDistribution={fullApiData?.reviews?.ratingDistribution || []}
            averageRating={fullApiData?.reviews?.averageRating || currentProduct?.rating || 0}
            totalReviews={fullApiData?.reviews?.totalReviews || 0}
          />
        </div>
      </div>

      {/* Popular This Week Section */}
      <div className="border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <PopularThisWeek products={fullApiData?.relatedProducts || similarProducts || recentlyViewed} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
