import ProductCard from "@/components/ProductCard/ProductCard";

const ProductGrid = ({ products = [] }) => {
  return (
    <div className="grid grid-cols-2 gap-5 md:grid-cols-3 xl:grid-cols-4">
      {products.map((product, idx) => (
        <ProductCard key={product._id || idx} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
