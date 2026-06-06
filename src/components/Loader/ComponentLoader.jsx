
const ComponentLoader = ({ type = "spinner", size = "md", className = "" }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };


  if (type === "spinner") {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div
          className={`${sizeClasses[size]} border-4 border-cyan-100 dark:border-cyan-900/30 border-t-[#088395] rounded-full animate-spin`}
        ></div>
      </div>
    );
  }


  if (type === "dots") {
    return (
      <div className={`flex items-center justify-center space-x-2 ${className}`}>
        <div className="w-2 h-2 bg-[#088395] rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-[#088395] rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
        <div className="w-2 h-2 bg-[#088395] rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
      </div>
    );
  }

  // Pulse Loader
  if (type === "pulse") {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className={`${sizeClasses[size]} bg-[#088395] rounded-full animate-pulse`}></div>
      </div>
    );
  }

  // Card Skeleton Loader
  if (type === "skeleton") {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="bg-gray-200 rounded-lg p-4 space-y-3">
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          <div className="h-4 bg-gray-300 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  // Product Card Skeleton
  if (type === "product-skeleton") {
    return (
      <div className={`animate-pulse bg-white rounded-lg shadow-md p-4 ${className}`}>
        <div className="bg-gray-200 h-48 rounded-md mb-4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-6 bg-gray-200 rounded w-1/3 mt-3"></div>
        </div>
      </div>
    );
  }

  // Text Skeleton
  if (type === "text") {
    return (
      <div className={`animate-pulse space-y-2 ${className}`}>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
      </div>
    );
  }

  return null;
};

/**
 * LoadingOverlay - Full overlay with spinner
 */
export const LoadingOverlay = ({ message = "Loading..." }) => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[2000]">
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 flex flex-col items-center space-y-4 shadow-2xl border border-gray-100 dark:border-gray-800">
      <div className="w-12 h-12 border-4 border-cyan-100 dark:border-cyan-900/30 border-t-[#088395] rounded-full animate-spin"></div>
      <p className="text-gray-900 dark:text-white font-bold tracking-tight">{message}</p>
    </div>
  </div>
);

/**
 * InlineLoader - Small inline loader
 */
export const InlineLoader = ({ className = "" }) => (
  <div className={`inline-flex items-center ${className}`}>
    <div className="w-4 h-4 border-2 border-cyan-100 dark:border-cyan-900/30 border-t-[#088395] rounded-full animate-spin"></div>
  </div>
);

/**
 * ButtonSpinner - Spinner for buttons
 */
export const ButtonSpinner = ({ size = "sm", className = "" }) => {
  const sizes = {
    xs: "w-3 h-3 border-2",
    sm: "w-4 h-4 border-2",
    md: "w-5 h-5 border-2",
    lg: "w-6 h-6 border-3",
  };

  return (
    <div className={`inline-block ${className}`}>
      <div
        className={`${sizes[size]} border-current border-t-transparent rounded-full animate-spin`}
      ></div>
    </div>
  );
};

export default ComponentLoader;
