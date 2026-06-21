'use client';

import { Dropdown, Empty, Spin, ConfigProvider, theme as antTheme } from "antd";
import { Search, X, ArrowRight } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

const ProductRow = ({ product, onClick }) => {
  const discount = product.Product_discount ?? product.discount ?? 0;
  const price = product.Product_price ?? product.price ?? 0;
  const discountedPrice = price - (price * discount) / 100;
  const name = product.Product_name ?? product.name;
  const image = product.Product_image ?? product.image;
  const type = product.Product_type ?? product.type;

  return (
    <button
      type="button"
      onClick={() => onClick(product)}
      className="w-full flex items-center gap-3 p-3 text-left hover:bg-surface-2 transition-colors border-b border-line last:border-b-0"
    >
      <img
        src={image}
        alt={name}
        className="w-12 h-12 object-cover rounded-lg shrink-0 bg-surface-2"
        onError={(e) => {
          e.currentTarget.src = "https://via.placeholder.com/48?text=No+Image";
        }}
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-ink truncate">{name}</p>
        {type && (
          <p className="text-[10px] text-brand font-medium uppercase tracking-wide mt-0.5">
            {type}
          </p>
        )}
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm font-semibold text-ink">
            ₹{Math.round(discountedPrice).toLocaleString()}
          </span>
          {discount > 0 && (
            <>
              <span className="text-xs text-muted line-through">
                ₹{price.toLocaleString()}
              </span>
              <span className="text-xs font-medium text-green-600">{discount}% off</span>
            </>
          )}
        </div>
      </div>
    </button>
  );
};

const HeaderSearchBox = ({
  query,
  onQueryChange,
  suggestions = [],
  loading = false,
  open = false,
  onOpenChange,
  onSubmit,
  onProductClick,
  onViewAll,
  className = "",
  autoFocus = false,
}) => {
  const { theme } = useTheme();
  const hasQuery = query.trim().length > 0;

  const dropdownContent = (
    <div className="w-full min-w-[280px] max-w-[420px] rounded-xl border border-line bg-surface shadow-premium overflow-hidden">
      {loading ? (
        <div className="flex flex-col items-center justify-center gap-3 py-10">
          <Spin />
          <span className="text-sm text-muted">
            {hasQuery ? "Searching products..." : "Loading products..."}
          </span>
        </div>
      ) : suggestions.length > 0 ? (
        <>
          <div className="px-4 py-2.5 border-b border-line bg-surface-2/50">
            <p className="text-xs font-medium text-muted uppercase tracking-wide">
              {hasQuery ? "Search results" : "Latest products"}
            </p>
          </div>
          <div className="max-h-72 overflow-y-auto">
            {suggestions.map((product) => (
              <ProductRow
                key={product._id ?? product.id}
                product={product}
                onClick={onProductClick}
              />
            ))}
          </div>
          {hasQuery && onViewAll && (
            <button
              type="button"
              onClick={onViewAll}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-brand hover:bg-surface-2 transition-colors border-t border-line"
            >
              View all results for &quot;{query.trim()}&quot;
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </>
      ) : (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            hasQuery
              ? `No products found for "${query.trim()}"`
              : "No products available right now"
          }
          className="py-8 px-4"
        />
      )}
    </div>
  );

  return (
    <ConfigProvider
      theme={{
        algorithm: theme === "dark" ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
        token: { colorPrimary: "#0d9488", borderRadius: 8 },
      }}
    >
      <form onSubmit={onSubmit} className={`relative ${className}`}>
        <Dropdown
          open={open}
          onOpenChange={onOpenChange}
          popupRender={() => dropdownContent}
          placement="bottomLeft"
          trigger={[]}
          zIndex={200}
          getPopupContainer={(node) => node.parentElement ?? document.body}
        >
          <div className="flex items-center gap-3 rounded-lg border border-line bg-surface-2 px-4 h-10 focus-within:border-brand/40 transition-colors">
            <Search className="w-4 h-4 text-muted shrink-0 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              onFocus={() => onOpenChange(true)}
              autoFocus={autoFocus}
              placeholder="Search products..."
              className="flex-1 bg-transparent border-none outline-none text-sm text-ink placeholder:text-muted min-w-0"
              aria-expanded={open}
              aria-haspopup="listbox"
            />
            {query && (
              <button
                type="button"
                onClick={() => onQueryChange("")}
                className="text-muted hover:text-ink transition-colors shrink-0"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </Dropdown>
      </form>
    </ConfigProvider>
  );
};

export default HeaderSearchBox;
