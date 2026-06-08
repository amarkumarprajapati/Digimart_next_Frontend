import { Filter, ChevronRight } from "lucide-react";

const priceRanges = [
  { label: "All Prices", min: 0, max: Infinity },
  { label: "Under ₹500", min: 0, max: 500 },
  { label: "₹500 – ₹1,000", min: 500, max: 1000 },
  { label: "₹1,000 – ₹2,000", min: 1000, max: 2000 },
  { label: "Over ₹2,000", min: 2000, max: Infinity },
];

const discountOptions = [
  { label: "All Discounts", value: 0 },
  { label: "10% or more", value: 10 },
  { label: "20% or more", value: 20 },
  { label: "30% or more", value: 30 },
];

const ratingOptions = [
  { label: "All Ratings", value: 0 },
  { label: "4.0 & above", value: 4 },
  { label: "4.5 & above", value: 4.5 },
];

const FilterSection = ({ title, children }) => (
  <div className="mb-8">
    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4">{title}</h4>
    <div className="space-y-2">{children}</div>
  </div>
);

const FilterItem = ({ label, active, onClick, count }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all text-xs font-bold ${
      active
        ? "bg-[#088395] text-white shadow-lg shadow-teal-500/20"
        : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
    }`}
  >
    <span className="truncate">{label}</span>
    {count !== undefined && <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${active ? "bg-white/20" : "bg-gray-100 dark:bg-gray-800"}`}>{count}</span>}
  </button>
);

const FiltersSidebar = ({
  categories,
  selectedCategory,
  onCategoryChange,
  selectedPriceRange,
  onPriceRangeChange,
  selectedRating,
  onRatingChange,
  minDiscount,
  onDiscountChange,
  onReset,
}) => {
  return (
    <aside className="hidden lg:block w-64 shrink-0 sticky top-32 h-[calc(100vh-160px)] overflow-y-auto scrollbar-hide">
      <div className="pr-4">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xs font-black uppercase tracking-[0.25em] text-gray-900 dark:text-white flex items-center gap-2">
            <Filter size={14} className="text-[#088395]" /> Filters
          </h3>
          <button onClick={onReset} className="text-[9px] font-black uppercase tracking-widest text-gray-400 hover:text-[#088395] transition-all">Clear All</button>
        </div>

        <FilterSection title="Categories">
          {categories.map((cat) => (
            <FilterItem
              key={cat}
              label={cat}
              active={selectedCategory === cat}
              onClick={() => onCategoryChange(cat)}
            />
          ))}
        </FilterSection>

        <FilterSection title="Price Range">
          {priceRanges.map((range) => (
            <FilterItem
              key={range.label}
              label={range.label}
              active={selectedPriceRange.label === range.label}
              onClick={() => onPriceRangeChange(range)}
            />
          ))}
        </FilterSection>

        <FilterSection title="Customer Rating">
          {ratingOptions.map((opt) => (
            <FilterItem
              key={opt.label}
              label={opt.label}
              active={selectedRating === opt.value}
              onClick={() => onRatingChange(opt.value)}
            />
          ))}
        </FilterSection>

        <FilterSection title="Offers">
          {discountOptions.map((opt) => (
            <FilterItem
              key={opt.label}
              label={opt.label}
              active={minDiscount === opt.value}
              onClick={() => onDiscountChange(opt.value)}
            />
          ))}
        </FilterSection>

        {/* Promo Banner */}
        <div className="mt-10 p-6 bg-gradient-to-br from-[#088395] to-[#077282] rounded-[2rem] text-white relative overflow-hidden group cursor-pointer">
          <div className="relative z-10">
            <p className="text-[8px] font-black uppercase tracking-[0.3em] mb-2 opacity-70">Flash Sale</p>
            <h4 className="text-xl font-black mb-4 leading-tight">Get Extra <br/> 20% OFF</h4>
            <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest">
              Shop Now <ChevronRight size={10} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
          <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
        </div>
      </div>
    </aside>
  );
};

export default FiltersSidebar;
