/* eslint-disable */
import { useState } from "react";
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
  Star,
  Heart,
  DollarSign,
  Building2,
} from "lucide-react";

const companies = [
  "Samsung", "Apple", "Sony", "LG", "HP", "Dell",
  "Lenovo", "Asus", "Acer", "Microsoft", "Google", "OnePlus"
];

const FilterPanel = ({ filters, setFilters, totalProducts }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [expanded, setExpanded] = useState({
    brand: true,
    price: true,
    rating: true,
    preferences: true,
  });

  const toggleSection = (section) => {
    setExpanded(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleCompany = (company) => {
    setFilters(prev => ({
      ...prev,
      companies: prev.companies.includes(company)
        ? prev.companies.filter(c => c !== company)
        : [...prev.companies, company]
    }));
  };

  const setPrice = (min, max) => {
    setFilters(prev => ({
      ...prev,
      priceRange: { min: Number(min), max: Number(max) }
    }));
  };

  const setMinRating = (rating) => {
    setFilters(prev => ({
      ...prev,
      minRating: prev.minRating === rating ? 0 : rating
    }));
  };

  const toggleLikes = () => {
    setFilters(prev => ({ ...prev, userLikes: !prev.userLikes }));
  };

  const clearFilters = () => {
    setFilters({
      companies: [],
      priceRange: { min: 0, max: 10000 },
      minRating: 0,
      userLikes: false,
      searchQuery: ""
    });
  };

  const activeCount =
    filters.companies.length +
    (filters.minRating > 0 ? 1 : 0) +
    (filters.userLikes ? 1 : 0) +
    (filters.priceRange.min > 0 || filters.priceRange.max < 10000 ? 1 : 0);

  const isMobile = typeof window !== "undefined" && window.innerWidth < 1024;

  return (
    <>
      {/* Mobile Toggle */}
      {!isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div className="lg:hidden mb-5">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between bg-white border border-gray-200 rounded-2xl px-5 py-4 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <SlidersHorizontal className="w-5 h-5 text-purple-600" />
            <span className="font-medium text-gray-900">Filters</span>
            {activeCount > 0 && (
              <span className="bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full">
                {activeCount}
              </span>
            )}
          </div>
          <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </button>
      </div>

      {/* Filter Sidebar / Drawer */}
      <div
        className={`
          bg-white rounded-2xl shadow-xl overflow-hidden w-full
          ${isOpen || !isMobile
            ? "block translate-x-0 opacity-100"
            : "hidden"
          }
          lg:block lg:translate-x-0 lg:opacity-100
          fixed lg:static inset-x-4 bottom-0 top-20 lg:top-0 lg:inset-x-0 z-50 lg:z-auto
          transition-all duration-300 ease-out
        `}
      >
        <div className="p-6 max-h-full overflow-y-auto custom-scrollbar">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <SlidersHorizontal className="w-6 h-6 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
              {activeCount > 0 && (
                <span className="bg-purple-100 text-purple-700 text-xs font-medium px-2.5 py-1 rounded-full">
                  {activeCount}
                </span>
              )}
            </div>
            {activeCount > 0 && (
              <button
                onClick={clearFilters}
                className="text-sm font-medium text-purple-600 hover:text-purple-700"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Results */}
          <div className="mb-6 py-3 px-4 bg-purple-50 rounded-xl">
            <p className="text-center text-sm font-medium text-purple-900">
              {totalProducts} products
            </p>
          </div>

          {/* Brand */}
          <section className="mb-5">
            <button
              onClick={() => toggleSection("brand")}
              className="w-full flex items-center justify-between py-2"
            >
              <div className="flex items-center gap-2.5">
                <Building2 className="w-5 h-5 text-gray-500" />
                <span className="font-medium text-gray-800">Brand</span>
                {filters.companies.length > 0 && (
                  <span className="text-sm text-purple-600 font-medium">
                    {filters.companies.length}
                  </span>
                )}
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${expanded.brand ? "rotate-180" : ""}`} />
            </button>

            {expanded.brand && (
              <div className="mt-3 space-y-1">
                {companies.map(company => (
                  <label
                    key={company}
                    className="flex items-center gap-3 py-2 px-1 rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={filters.companies.includes(company)}
                      onChange={() => toggleCompany(company)}
                      className="w-4 h-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-700">{company}</span>
                  </label>
                ))}
              </div>
            )}
          </section>

          {/* Price Range */}
          <section className="mb-5">
            <button
              onClick={() => toggleSection("price")}
              className="w-full flex items-center justify-between py-2"
            >
              <div className="flex items-center gap-2.5">
                <DollarSign className="w-5 h-5 text-gray-500" />
                <span className="font-medium text-gray-800">Price Range</span>
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${expanded.price ? "rotate-180" : ""}`} />
            </button>

            {expanded.price && (
              <div className="mt-4 space-y-4">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>${filters.priceRange.min}</span>
                  <span>${filters.priceRange.max}</span>
                </div>

                <div className="relative">
                  <input
                    type="range"
                    min="0"
                    max="10000"
                    step="100"
                    value={filters.priceRange.min}
                    onChange={(e) => setPrice(e.target.value, filters.priceRange.max)}
                    className="absolute w-full h-2 bg-gray-200 rounded-lg appearance-none pointer-events-none"
                    style={{ zIndex: filters.priceRange.min > 5000 ? 2 : 1 }}
                  />
                  <input
                    type="range"
                    min="0"
                    max="10000"
                    step="100"
                    value={filters.priceRange.max}
                    onChange={(e) => setPrice(filters.priceRange.min, e.target.value)}
                    className="absolute w-full h-2 bg-gray-200 rounded-lg appearance-none"
                    style={{ zIndex: filters.priceRange.min > 5000 ? 1 : 2 }}
                  />
                  <div className="relative h-2 bg-gray-200 rounded-lg">
                    <div
                      className="absolute h-full bg-purple-600 rounded-lg"
                      style={{
                        left: `${(filters.priceRange.min / 10000) * 100}%`,
                        right: `${100 - (filters.priceRange.max / 10000) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d8b4fe;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a855f7;
        }

        input[type="range"] {
          -webkit-appearance: none;
          background: transparent;
        }

        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 18px;
          width: 18px;
          border-radius: 50%;
          background: #a855f7;
          cursor: pointer;
          margin-top: -7px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.15);
          z-index: 3;
        }

        input[type="range"]::-moz-range-thumb {
          height: 18px;
          width: 18px;
          border-radius: 50%;
          background: #a855f7;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 6px rgba(0,0,0,0.15);
        }
      `}</style>
    </>
  );
};

export default FilterPanel;
