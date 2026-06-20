'use client';

import { useState, useEffect } from "react";
import { Ticket, Copy, Check, Search } from "lucide-react";
import { couponService } from "@/services/api/endpoints";
import { showToast } from "@/lib/toast";
import AccountLayout from "./AccountLayout";

const CouponsPage = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchCoupons = async () => {
      setLoading(true);
      try {
        const response = await couponService.getAvailableCoupons();
        if (response.data.success) setCoupons(response.data.data || []);
      } catch {
        setCoupons([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCoupons();
  }, []);

  const isExpired = (date) => new Date(date) < new Date();

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    showToast.success("Coupon code copied");
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const getDiscountText = (coupon) => {
    if (coupon.discountType === "percentage") return `${coupon.discount}% off`;
    if (coupon.discountType === "flat") return `$${coupon.discount} off`;
    if (coupon.discountType === "shipping") return "Free shipping";
    return "";
  };

  const filteredCoupons = coupons.filter((coupon) => {
    const expired = isExpired(coupon.expiryDate) || coupon.status === "expired";
    const matchesFilter =
      filter === "all" ||
      (filter === "active" && !expired) ||
      (filter === "expired" && expired);
    const matchesSearch =
      (coupon.code || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (coupon.title || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const toolbar = (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative w-full sm:max-w-xs">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input
          type="text"
          placeholder="Search coupons..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="field h-9 pl-9 pr-3 text-sm"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        {["all", "active", "expired"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium capitalize transition-colors ${
              filter === status ? "bg-brand text-white" : "text-body hover:bg-surface-2"
            }`}
          >
            {status}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <AccountLayout
      title="Coupons"
      description="Your available discounts and offers."
      toolbar={toolbar}
    >
      {loading ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-40 animate-pulse rounded-xl border border-line bg-surface-2" />
          ))}
        </div>
      ) : filteredCoupons.length === 0 ? (
        <div className="py-16 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-surface-2">
            <Ticket className="h-6 w-6 text-muted" />
          </div>
          <h3 className="text-lg font-semibold text-ink">No coupons found</h3>
          <p className="mt-1 text-sm text-muted">
            {searchQuery ? "Try a different search term." : "Check back later for new offers."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {filteredCoupons.map((coupon) => {
            const expired = isExpired(coupon.expiryDate) || coupon.status === "expired";
            return (
              <div key={coupon._id} className={`overflow-hidden rounded-xl border border-line ${expired ? "opacity-60" : ""}`}>
                <div className="flex items-center justify-between border-b border-line p-5">
                  <div className="min-w-0">
                    <p className="text-lg font-semibold text-brand">{getDiscountText(coupon)}</p>
                    <h3 className="truncate text-sm font-medium text-ink">{coupon.title}</h3>
                  </div>
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand">
                    <Ticket className="h-5 w-5" />
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-2 rounded-lg border border-dashed border-line bg-surface-2 p-2.5">
                    <code className="flex-1 text-sm font-semibold tracking-wide text-ink">
                      {coupon.code}
                    </code>
                    <button
                      onClick={() => handleCopy(coupon.code)}
                      disabled={expired}
                      className="flex items-center gap-1 rounded-md px-2 py-1 text-sm font-medium text-brand hover:bg-brand-soft disabled:opacity-50"
                    >
                      {copiedCode === coupon.code ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-muted">
                    {coupon.minOrderValue > 0 ? (
                      <span>Min order ${coupon.minOrderValue}</span>
                    ) : (
                      <span />
                    )}
                    <span>
                      {expired ? "Expired" : "Expires"}{" "}
                      {coupon.expiryDate && new Date(coupon.expiryDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AccountLayout>
  );
};

export default CouponsPage;
