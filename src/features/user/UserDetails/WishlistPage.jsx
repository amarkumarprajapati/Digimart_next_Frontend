/* eslint-disable */
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import ProfileLayout from "./ProfileLayout";

const WishlistPage = () => {
  const navigate = useRouter();
  const wishlistItems = []; 

  return (
    <ProfileLayout>
      <div className="animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Your Wishlist</h2>
        {wishlistItems.length > 0 && (
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {wishlistItems.length} {wishlistItems.length === 1 ? "item" : "items"}
          </span>
        )}
      </div>

      {wishlistItems.length === 0 ? (
        <div className="text-center py-16">
          <Heart className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Your wishlist is empty
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
            Start adding products you love to save them for later.
          </p>
          <button
            onClick={() => router.push("/products")}
            className="px-6 py-2.5 bg-[#088395] hover:bg-[#066a78] text-white font-medium rounded-lg transition-colors text-sm"
          >
            Browse Products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {wishlistItems.map((item) => (
            <div
              key={item._id}
              className="flex gap-4 bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 rounded-lg object-cover bg-white dark:bg-gray-900"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                  {item.name}
                </h4>
                <p className="text-[#088395] font-bold mt-1">₹{item.price}</p>
                <div className="flex gap-2 mt-2">
                  <button className="px-3 py-1 bg-[#088395] text-white text-xs rounded-md hover:bg-[#066a78] transition-colors flex items-center gap-1">
                    <ShoppingBag className="w-3 h-3" /> Add to Cart
                  </button>
                  <button className="px-3 py-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 text-xs rounded-md transition-colors flex items-center gap-1">
                    <Trash2 className="w-3 h-3" /> Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </ProfileLayout>
  );
};

export default WishlistPage;
