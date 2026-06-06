/* eslint-disable */
import { Link } from "next/navigation";

const Breadcrumbs = ({ product }) => {
  // Build breadcrumb items dynamically
  const breadcrumbItems = [];
  
  // Add category if available
  if (product?.category) {
    breadcrumbItems.push({
      name: product.category,
      path: `/category/${product.category.toLowerCase().replace(/\s+/g, '-')}`
    });
  }
  
  // Add subcategory if available
  if (product?.subcategory) {
    breadcrumbItems.push({
      name: product.subcategory,
      path: `/category/${product.category?.toLowerCase().replace(/\s+/g, '-')}/${product.subcategory.toLowerCase().replace(/\s+/g, '-')}`
    });
  }

  return (
    <nav className="py-2" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2 flex-wrap">
        {/* Home */}
        <li>
          <div className="flex items-center">
            <Link
              to="/"
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              aria-label="Home"
            >
              <svg
                className="h-5 w-5 flex-shrink-0"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 11h-1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3a1 1 0 00-1-1H9a1 1 0 00-1 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-6H3a1 1 0 01-.707-1.707l7-7z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="sr-only">Home</span>
            </Link>
          </div>
        </li>
        
        {/* Dynamic breadcrumb items (categories) */}
        {breadcrumbItems.map((item, index) => (
          <li key={item.name}>
            <div className="flex items-center">
              <svg
                className="h-5 w-5 flex-shrink-0 text-gray-300 mx-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
              </svg>
              <Link
                to={item.path}
                className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors duration-200"
              >
                {item.name}
              </Link>
            </div>
          </li>
        ))}
        
        {/* Current product */}
        {product?.name && (
          <li>
            <div className="flex items-center">
              <svg
                className="h-5 w-5 flex-shrink-0 text-gray-300 mx-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
              </svg>
              <span
                className="text-sm font-medium text-gray-800 truncate max-w-[200px] md:max-w-[300px]"
                title={product.name}
                aria-current="page"
              >
                {product.name}
              </span>
            </div>
          </li>
        )}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
