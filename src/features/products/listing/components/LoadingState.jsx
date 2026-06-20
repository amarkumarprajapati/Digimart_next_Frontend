const LoadingState = () => {
  return (
    <div className="grid grid-cols-2 gap-5 md:grid-cols-3 xl:grid-cols-4">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="aspect-[3/4] animate-pulse rounded-xl border border-line bg-surface"
        />
      ))}
    </div>
  );
};

export default LoadingState;
