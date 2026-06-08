const LoadingState = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="aspect-[3/4] bg-white dark:bg-gray-900 rounded-[2rem] animate-pulse border border-gray-100 dark:border-gray-800" />
      ))}
    </div>
  );
};

export default LoadingState;
