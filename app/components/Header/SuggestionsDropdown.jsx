/* eslint-disable */
import { useRouter } from "next/navigation";

const SuggestionsDropdown = ({ suggestions, onSuggestionClick }) => {
    const router = useRouter();

    const handleClick = (slug) => {
        if (onSuggestionClick) {
            onSuggestionClick(slug);
        } else {
            router.push(`/product/${slug}`);
        }
    };

    if (!suggestions || suggestions.length === 0) {
        return null;
    }

    return (
        <div
            className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-950 rounded-2xl shadow-premium border border-gray-200 dark:border-gray-800 max-h-96 overflow-y-auto z-50 animate-in fade-in slide-in-from-top-2 duration-300"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
            {suggestions.map((product) => {
                const discountedPrice =
                    product.Product_price -
                    (product.Product_price * product.Product_discount) / 100;

                return (
                    <div
                        key={product._id}
                        onClick={() => handleClick(product.slug)}
                        className="flex items-center gap-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer transition-colors border-b border-gray-100 dark:border-gray-800 last:border-b-0"
                    >
                        {/* Product Image */}
                        <img
                            src={product.Product_image}
                            alt={product.Product_name}
                            className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                            onError={(e) => {
                                e.target.src = "https://via.placeholder.com/64?text=No+Image";
                            }}
                        />

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-gray-900 dark:text-white truncate text-sm">
                                {product.Product_name}
                            </h4>
                            <p className="text-[10px] text-cyan-600 dark:text-cyan-400 font-bold uppercase tracking-wider mt-0.5">
                                {product.Product_type}
                            </p>

                            {/* Price Section */}
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-sm font-black text-gray-900 dark:text-white">
                                    ₹{Math.round(discountedPrice).toLocaleString()}
                                </span>
                                {product.Product_discount > 0 && (
                                    <>
                                        <span className="text-xs text-gray-400 line-through">
                                            ₹{product.Product_price.toLocaleString()}
                                        </span>
                                        <span className="text-xs font-medium text-green-600">
                                            {product.Product_discount}% off
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default SuggestionsDropdown;
