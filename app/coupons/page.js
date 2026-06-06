'use client';

import { useState, useEffect } from "react";
import { Ticket, Copy, Check, Search, Info } from "lucide-react";
import { couponService } from "@/api/endpoints";
import { showToast } from "@/utils/toast";
import ProfileLayout from "@/features/user/UserDetails/ProfileLayout";

const CouponsPage = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const response = await couponService.getAvailableCoupons();
      if (response.data.success) {
        setCoupons(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching coupons:", error);
      setCoupons([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCopyCoupon = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    showToast.success("Coupon code copied!");
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const isExpired = (expiryDate) => {
    return new Date(expiryDate) < new Date();
  };

  const filteredCoupons = coupons.filter((coupon) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "active" && coupon.status === "active" && !isExpired(coupon.expiryDate)) ||
      (filter === "expired" && (coupon.status === "expired" || isExpired(coupon.expiryDate)));
    const matchesSearch =
      coupon.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coupon.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getDiscountText = (coupon) => {
    if (coupon.discountType === "percentage") {
      return `${coupon.discount}% OFF`;
    } else if (coupon.discountType === "flat") {
      return `₹${coupon.discount} OFF`;
    } else if (coupon.discountType === "shipping") {
      return "FREE SHIPPING";
    }
    return "";
  };

  return (
    <ProfileLayout>
      <div className="animate-in fade-in slide-in-from-top-4 duration-500">

      {/* Filters and Search */}
        <div className="bg-white dark:bg-gray-900 rounded-xl p-2 mb-4 ">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search coupons..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#088395] focus:border-transparent"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2">
              {["all", "active", "expired"].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                    filter === status
                      ? "bg-[#088395] text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Coupons Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-900 rounded-xl p-6 animate-pulse">
                <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-1/3 mb-4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : filteredCoupons.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-xl p-12 text-center">
            <Ticket className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No coupons found</h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchQuery ? "Try a different search term" : "Check back later for new offers"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCoupons.map((coupon) => {
              const expired = isExpired(coupon.expiryDate) || coupon.status === "expired";
              return (
                <div
                  key={coupon._id}
                  className={`bg-white dark:bg-gray-900 rounded-[1.5rem] border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all overflow-hidden relative group ${
                    expired ? "opacity-50 grayscale-[0.5]" : ""
                  }`}
                >
                  {/* Compact Header */}
                  <div className={`p-4 ${expired ? "bg-gray-100 dark:bg-gray-800/50" : "bg-gradient-to-br from-[#088395] to-[#077282]"}`}>
                    <div className="flex justify-between items-start mb-2">
                       <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center">
                          <Ticket className="w-4 h-4 text-white" />
                       </div>
                       {expired && (
                         <span className="text-[7px] font-black uppercase tracking-widest bg-red-500 text-white px-2 py-0.5 rounded-full">Expired</span>
                       )}
                    </div>
                    <h3 className="text-sm font-black text-white uppercase tracking-tight truncate">{coupon.title}</h3>
                    <p className="text-[9px] text-white/80 font-medium truncate">{coupon.description}</p>
                  </div>

                  {/* Compact Body */}
                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                       <span className={`text-lg font-black ${expired ? "text-gray-400" : "text-[#088395]"}`}>{getDiscountText(coupon)}</span>
                       <div className="text-right">
                          <p className="text-[8px] text-gray-400 font-black uppercase tracking-tighter">Expires</p>
                          <p className="text-[9px] text-gray-900 dark:text-white font-bold">{new Date(coupon.expiryDate).toLocaleDateString()}</p>
                       </div>
                    </div>

                    <div className="relative group/copy">
                       <div className={`flex items-center gap-2 p-2.5 rounded-xl border-2 border-dashed transition-all ${
                          expired ? "bg-gray-50 border-gray-200" : "bg-teal-50/30 dark:bg-[#088395]/5 border-teal-100 dark:border-[#088395]/20 group-hover/copy:border-[#088395]/40"
                       }`}>
                          <code className={`flex-1 text-xs font-black tracking-widest ${expired ? "text-gray-400" : "text-gray-900 dark:text-white"}`}>{coupon.code}</code>
                          <button
                            onClick={() => handleCopyCoupon(coupon.code)}
                            disabled={expired}
                            className={`p-1.5 rounded-lg transition-all ${
                              expired ? "text-gray-300" : "text-[#088395] hover:bg-[#088395] hover:text-white"
                            }`}
                          >
                            {copiedCode === coupon.code ? <Check size={14} /> : <Copy size={14} />}
                          </button>
                       </div>
                    </div>

                    <div className="space-y-1.5">
                       {coupon.minOrderValue > 0 && (
                         <div className="flex items-center gap-2 text-[9px] text-gray-500 font-bold uppercase tracking-tight">
                            <Info size={10} className="text-gray-300" />
                            <span>Min Order: ₹{coupon.minOrderValue}</span>
                         </div>
                       )}
                       <details className="group/terms">
                          <summary className="list-none cursor-pointer text-[8px] font-black uppercase tracking-widest text-[#088395] hover:opacity-70 transition-opacity">Terms & Conditions</summary>
                          <ul className="mt-2 space-y-1 pl-1">
                             {coupon.termsAndConditions?.map((t, i) => (
                               <li key={i} className="text-[8px] text-gray-400 font-medium flex items-start gap-1.5 leading-tight">
                                  <span className="w-1 h-1 rounded-full bg-gray-300 mt-1 shrink-0" />
                                  {t}
                               </li>
                             ))}
                          </ul>
                       </details>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </ProfileLayout>
  );
};

export default CouponsPage;
