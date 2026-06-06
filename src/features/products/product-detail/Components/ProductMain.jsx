/* eslint-disable */
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { Rate, Button, notification, Tooltip } from "antd";
import {
  ShoppingCartOutlined,
  HeartOutlined,
  HeartFilled,
  ShareAltOutlined,
} from "@ant-design/icons";
import { addToCart } from "@/store/slices/cartSlice";
import { useAuthModal } from "@/hooks/useAuthModal";

const ProductMain = ({ currentProduct }) => {
  const dispatch = useDispatch();
  const navigate = useRouter();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);


  const {
    _id: id,
    Product_name,
    name: _name,
    Product_price,
    price: _price,
    Product_discount,
    discount: _discount,
    rating = 0,
    reviewCount = 0,
    Product_image,
    image: _image,
    Product_images,
    images: _images,
    colors = [],
    sizes = [],
    Product_desc,
    description: _description,
    Product_TotalStock,
    stock: _stock,
    brand
  } = currentProduct || {};


  const name = Product_name || _name;
  const price = Number(Product_price || _price || 0);
  const image = Product_image || _image;
  const description = Product_desc || _description;
  const stock = Product_TotalStock !== undefined ? Product_TotalStock : _stock;
  const inStock = (stock !== undefined && stock > 0) || (stock === undefined);
  const rawImages = (Product_images && Product_images.length > 0) ? Product_images : (_images || []);
  const processedImages = rawImages.map(img => (typeof img === 'object' && img.url) ? img.url : img);
  const productImages = processedImages.length > 0 ? processedImages : [image, image, image, image].filter(Boolean);
  const discount = Number(Product_discount || _discount || 0);
  const originalPrice = discount > 0 ? price / (1 - discount / 100) : null;




  const handleAddToCart = () => {

    const cartItem = {
      ...currentProduct,
      _id: id,
      Product_ID: currentProduct?.Product_ID || id,
      name,
      price,
      image,
      quantity: 1,
    };

    dispatch(addToCart(cartItem));

    notification.success({
      message: "Added to Cart",
      description: `${name} added to cart successfully`,
      placement: "topRight",
    });
  };

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const { openSignIn } = useAuthModal();

  const handleCheckout = () => {
    if (!isAuthenticated) {
      openSignIn();
      return;
    }
    const cartItem = {
      ...currentProduct,
      _id: id,
      Product_ID: currentProduct?.Product_ID || id,
      name,
      price,
      image,
      quantity: 1,
    };
    dispatch(addToCart(cartItem));
    router.push("/CheckoutPage");
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <div className="flex gap-4">
          <div className="flex flex-col gap-3">
            {productImages.slice(0, 4).map((img, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`w-16 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 hover:opacity-100 ${selectedImage === index
                  ? "border-black opacity-100"
                  : "border-gray-200 opacity-70"
                  }`}
              >
                <img
                  src={img || image}
                  alt={`${name} view ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>

          {/* Main Image */}
          <div className="flex-1 relative rounded-2xl overflow-hidden bg-gray-50">
            <img
              src={productImages[selectedImage] || image}
              alt={name}
              className="w-full h-[500px] object-cover"
            />
            {/* Wishlist button on image */}
            <button
              onClick={() => setWishlisted(!wishlisted)}
              className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-shadow"
            >
              {wishlisted ? (
                <HeartFilled className="text-red-500 text-lg" />
              ) : (
                <HeartOutlined className="text-gray-600 text-lg" />
              )}
            </button>
          </div>
        </div>

        {/* Product Info Section */}
        <div className="flex flex-col">
          {/* Brand & Category */}
          <p className="text-sm text-gray-500 uppercase tracking-wide mb-2">
            {brand || "JOHN LEWIS & PARTNERS"}
          </p>

          {/* Product Name */}
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
              {name}
            </h1>
            <Button
              icon={<ShareAltOutlined />}
              size="large"
              className="flex-shrink-0 border-gray-300"
            />
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mt-4">
            {originalPrice && originalPrice > price && (
              <span className="text-lg text-gray-400 line-through">
                £{originalPrice?.toFixed(2)}
              </span>
            )}
            <span className="text-3xl font-bold text-gray-900">
              £{price?.toFixed(2) || "0.00"}
            </span>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-3 mt-3">
            <Rate disabled allowHalf value={rating} className="text-base" />
            <span className="px-2 py-0.5 bg-gray-100 rounded text-sm font-medium">
              {rating?.toFixed(1)}
            </span>
          </div>

          {/* Description */}
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Description</h3>
            <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
              {description || "This product features premium quality materials and exceptional craftsmanship. Perfect for everyday wear with a modern, comfortable fit."}
            </p>
            <button className="text-sm text-gray-900 underline mt-1 hover:text-gray-600">
              Read more
            </button>
          </div>



          {/* Action Buttons */}
          <div className="flex gap-3 mt-8">
            <Button
              size="large"
              onClick={handleAddToCart}
              icon={<ShoppingCartOutlined />}
              className="flex-1 h-12 !bg-[#088395] !text-white !border-[#088395] hover:!bg-[#066a78] hover:!border-[#066a78] font-medium shadow-lg"
            >
              Add To Cart
            </Button>
            <Button
              size="large"
              onClick={handleCheckout}
              className="flex-1 h-12 !border-[#088395] !text-[#088395] dark:!text-[#7AB2B2] dark:!border-[#088395] hover:!bg-[#088395]/5 font-medium"
            >
              Check out now
            </Button>
          </div>

          {/* Delivery Info */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
              Delivery: <span className="font-medium text-gray-900">3-5 business days</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductMain;
