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
    <div className="min-h-screen bg-canvas">
      {/* Main Product Section */}
      <div className="container-page py-8">
        <div className="card p-5 md:p-8">
          <ProductMain currentProduct={currentProduct} />
        </div>
      </div>

      {/* Reviews Section */}
      <div className="container-page">
        <ReviewsSection
          product={currentProduct}
          reviews={fullApiData?.detailedReviews?.reviews || []}
          ratingDistribution={fullApiData?.reviews?.ratingDistribution || []}
          averageRating={fullApiData?.reviews?.averageRating || currentProduct?.rating || 0}
          totalReviews={fullApiData?.reviews?.totalReviews || 0}
        />
      </div>

      {/* Related products */}
      <div className="container-page pb-12">
        <PopularThisWeek
          products={fullApiData?.relatedProducts || similarProducts || recentlyViewed}
        />
      </div>
    </div>
  );
};

export default ProductDetailsPage;
