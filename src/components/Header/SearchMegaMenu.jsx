import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  X,
  ArrowRight,
  TrendingUp,
  Clock,
  Smartphone,
  Laptop,
  Tv,
  Headphones,
  Watch,
  Camera,
  Gamepad2,
  ChevronRight,
  Sparkles,
  ShoppingBag,
  Zap
} from "lucide-react";
import { productService } from "@/api/endpoints";

const CATEGORIES = [
  { name: "All", icon: <Sparkles size={14} /> },
  { name: "Mobiles", icon: <Smartphone size={14} /> },
  { name: "Laptops", icon: <Laptop size={14} /> },
  { name: "Tablets", icon: <Smartphone size={14} /> },
  { name: "Audio", icon: <Headphones size={14} /> },
  { name: "Gaming", icon: <Gamepad2 size={14} /> },
  { name: "Cameras", icon: <Camera size={14} /> },
];

const SearchMegaMenu = ({ isOpen, onClose, initialQuery = "" }) => {
  const navigate = useRouter();
  const inputRef = useRef(null);
  const debounceRef = useRef(null);

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [recentSearches, setRecentSearches] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("recentSearches") || "[]");
    setRecentSearches(saved);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
    if (isOpen) {
      setQuery(initialQuery);
      if (initialQuery) fetchResults(initialQuery);
    }
  }, [isOpen, initialQuery]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const fetchResults = useCallback(async (q, category = "All") => {
    if (!q.trim() && category === "All") {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const response = await productService.searchProducts(q, 6);
      if (response.data.success) {
        let data = response.data.data || [];
        if (category !== "All") {
          data = data.filter(p => (p.category || p.Product_type || "").toLowerCase().includes(category.toLowerCase()));
        }
        setResults(data);
      }
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!value.trim()) {
      setResults([]);
      return;
    }
    debounceRef.current = setTimeout(() => {
      fetchResults(value, activeCategory);
    }, 300);
  };

  const saveRecentSearch = (term) => {
    if (!term.trim()) return;
    const updated = [term, ...recentSearches.filter((s) => s !== term)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  const handleProductClick = (product) => {
    saveRecentSearch(query);
    const slug = product.slug || product._id;
    router.push(`/product/${slug}/${product._id}`);
    onClose();
  };

  const handleViewAll = () => {
    saveRecentSearch(query);
    const params = new URLSearchParams();
    if (query.trim()) params.set("search", query);
    if (activeCategory !== "All") params.set("category", activeCategory.toLowerCase());
    router.push(`/products?${params.toString()}`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex flex-col items-center pt-20 px-4">
      <div className="absolute inset-0 bg-gray-950/40 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-4xl animate-in fade-in slide-in-from-top-4 duration-500">
        
        {/* Modern Search Header */}
        <div className="bg-white dark:bg-gray-900 rounded-t-[2rem] border-x border-t border-gray-100 dark:border-gray-800 shadow-2xl p-4 flex items-center gap-4 group transition-all duration-300">
          <div className="w-10 h-10 rounded-2xl bg-teal-50 dark:bg-[#088395]/10 flex items-center justify-center text-[#088395] group-focus-within:scale-110 transition-transform duration-300">
            <Search size={20} />
          </div>
          <input 
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder="What are you looking for today?"
            className="flex-1 bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-gray-900 dark:text-white font-black text-lg placeholder:text-gray-400 dark:placeholder:text-gray-500 uppercase tracking-tight"
          />
          <div className="flex items-center gap-2">
            {query && (
              <button onClick={() => { setQuery(""); setResults([]); }} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                <X size={18} />
              </button>
            )}
            <div className="h-6 w-px bg-gray-100 dark:bg-gray-800 mx-2" />
            <button onClick={onClose} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg text-[9px] font-black uppercase tracking-widest text-gray-500">
              ESC
            </button>
          </div>
        </div>

        {/* Mega Content Area */}
        <div className="bg-white dark:bg-gray-900 rounded-b-[2rem] border-x border-b border-gray-100 dark:border-gray-800 shadow-2xl overflow-hidden flex min-h-[400px]">
          
          {/* Left Sidebar - Quick Navigation */}
          <aside className="w-56 border-r border-gray-50 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20 p-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-6">Explore</h3>
            <div className="space-y-1">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.name}
                  onClick={() => { setActiveCategory(cat.name); if(query) fetchResults(query, cat.name); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-xs font-black uppercase tracking-tight ${
                    activeCategory === cat.name 
                    ? "bg-[#088395] text-white shadow-lg shadow-teal-500/20" 
                    : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  {cat.icon}
                  {cat.name}
                </button>
              ))}
            </div>
          </aside>

          {/* Right Main Panel */}
          <main className="flex-1 p-8 overflow-y-auto max-h-[60vh]">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full gap-4">
                <div className="w-8 h-8 border-3 border-teal-100 border-t-[#088395] rounded-full animate-spin" />
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Searching Collections...</p>
              </div>
            ) : results.length > 0 ? (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Match Results</h3>
                  <button onClick={handleViewAll} className="text-[10px] font-black uppercase tracking-widest text-[#088395] flex items-center gap-2 group">
                    View All <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {results.map(product => (
                    <div 
                      key={product._id} 
                      onClick={() => handleProductClick(product)}
                      className="group flex items-center gap-4 p-3 rounded-[1.5rem] border border-gray-100 dark:border-gray-800 hover:border-[#088395]/30 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all cursor-pointer"
                    >
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 shrink-0">
                        <img src={product.Product_image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-black text-gray-900 dark:text-white truncate uppercase tracking-tight group-hover:text-[#088395] transition-colors">{product.Product_name}</h4>
                        <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mt-1">₹{product.Product_price?.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-10">
                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Clock size={14} className="text-gray-400" />
                      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Recent Searches</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map(term => (
                        <button key={term} onClick={() => { setQuery(term); fetchResults(term); }} className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-500 hover:bg-[#088395] hover:text-white transition-all">
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Trending Collections */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp size={14} className="text-[#088395]" />
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Trending Now</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { name: "iPhone 15 Pro", price: "1,29,900" },
                      { name: "Gaming Laptops", price: "From 65,000" },
                      { name: "Smart Watches", price: "Under 5,000" },
                      { name: "Sony Headphones", price: "24,990" }
                    ].map(item => (
                      <button key={item.name} className="flex items-center justify-between p-4 bg-teal-50/50 dark:bg-[#088395]/5 border border-teal-100/50 dark:border-teal-900/20 rounded-2xl group hover:bg-[#088395] transition-all">
                        <div className="text-left">
                          <p className="text-[10px] font-black uppercase tracking-tight text-gray-900 dark:text-white group-hover:text-white">{item.name}</p>
                          <p className="text-[8px] font-black uppercase tracking-widest text-[#088395] group-hover:text-white/70 mt-0.5">{item.price}</p>
                        </div>
                        <ChevronRight size={14} className="text-[#088395] group-hover:text-white group-hover:translate-x-1 transition-all" />
                      </button>
                    ))}
                  </div>
                </div>

               
              </div>
            )}
          </main>
        </div>

        {/* Footer Hint */}
        <div className="mt-4 flex items-center justify-center gap-6 text-[9px] font-black uppercase tracking-[0.25em] text-gray-400">
          <span className="flex items-center gap-1.5"><Search size={10} /> Search results are updated in real-time</span>
          <div className="w-1 h-1 rounded-full bg-gray-300" />
          <span className="flex items-center gap-1.5 underline decoration-[#088395] decoration-2 underline-offset-4">Browse all categories</span>
        </div>
      </div>
    </div>
  );
};

export default SearchMegaMenu;
