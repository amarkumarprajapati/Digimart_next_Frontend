import ProductCard from "@/components/ProductCard/ProductCard";

const ProductGrid = ({ products }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product, idx) => (
        <div key={product.id || idx} className="animate-in fade-in zoom-in duration-500" style={{ animationDelay: `${(idx % 12) * 50}ms` }}>
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;
