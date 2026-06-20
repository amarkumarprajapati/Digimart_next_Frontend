'use client';

import { useState, useEffect } from "react";
import { Package, CheckCircle, Truck, XCircle, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { orderService } from "@/services/api/endpoints";
import { showToast } from "@/lib/toast";
import AccountLayout from "./AccountLayout";

const PLACEHOLDER = "https://placehold.co/120x120/f1f5f9/94a3b8?text=Item";

const STATUS = {
  delivered: { label: "Delivered", icon: CheckCircle, className: "bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-400" },
  pending: { label: "Arriving soon", icon: Truck, className: "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400" },
  processing: { label: "Processing", icon: Truck, className: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400" },
  cancelled: { label: "Cancelled", icon: XCircle, className: "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400" },
};

const OrdersPage = () => {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await orderService.getMyOrders();
        if (response.data.success) setOrders(response.data.data || []);
      } catch {
        showToast.error("Failed to load orders");
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    const matchesFilter = filter === "all" || order.status === filter;
    const matchesSearch = (order.orderNumber || "")
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const toolbar = (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative w-full sm:max-w-xs">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input
          type="text"
          placeholder="Search order number..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="field h-9 pl-9 pr-3 text-sm"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        {["all", "pending", "delivered", "cancelled"].map((status) => (
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
    <AccountLayout title="Orders" description="Track and manage your orders." toolbar={toolbar}>
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-xl border border-line bg-surface-2" />
          ))}
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="py-16 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-surface-2">
            <Package className="h-6 w-6 text-muted" />
          </div>
          <h3 className="text-lg font-semibold text-ink">No orders found</h3>
          <p className="mt-1 text-sm text-muted">
            {searchQuery ? "Try a different search term." : "You haven't placed any orders yet."}
          </p>
          <button onClick={() => router.push("/products")} className="btn-primary mt-6 h-10 px-5 text-sm">
            Start shopping
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const meta = STATUS[order.status] || STATUS.processing;
            const StatusIcon = meta.icon;
            return (
              <div key={order._id} className="overflow-hidden rounded-xl border border-line">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-surface-2 px-5 py-3">
                  <div className="flex items-center gap-6 text-sm">
                    <div>
                      <p className="text-xs text-muted">Placed</p>
                      <p className="font-medium text-ink">
                        {order.date ? new Date(order.date).toLocaleDateString() : "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted">Total</p>
                      <p className="font-medium text-ink">
                        ${Number(order.total || 0).toLocaleString()}
                      </p>
                    </div>
                    <div className="hidden sm:block">
                      <p className="text-xs text-muted">Order</p>
                      <p className="font-medium text-ink">#{order.orderNumber}</p>
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${meta.className}`}
                  >
                    <StatusIcon className="h-3.5 w-3.5" />
                    {meta.label}
                  </span>
                </div>

                <div className="divide-y divide-line">
                  {(order.items || []).map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-5">
                      <img
                        src={item.image || PLACEHOLDER}
                        alt={item.name}
                        className="h-16 w-16 rounded-lg border border-line object-cover"
                        onError={(e) => { e.currentTarget.src = PLACEHOLDER; }}
                      />
                      <div className="min-w-0 flex-1">
                        <h4 className="truncate text-sm font-medium text-ink">{item.name}</h4>
                        <p className="text-sm text-muted">Qty: {item.quantity}</p>
                      </div>
                      <span className="text-sm font-semibold text-ink">
                        ${Number(item.price || 0).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AccountLayout>
  );
};

export default OrdersPage;
