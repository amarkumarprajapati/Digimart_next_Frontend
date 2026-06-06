'use client';

/* eslint-disable */
import { useState, useEffect } from "react";
import { Package, Truck, CheckCircle, XCircle, Search, Filter, ChevronRight, Clock, MapPin, X } from "lucide-react";
import { orderService } from "@/api/endpoints";
import { useRouter } from "next/navigation";
import { showToast } from "@/utils/toast";
import ProfileLayout from "@/features/user/UserDetails/ProfileLayout";

const OrdersPage = () => {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, pending, delivered, cancelled
  const [searchQuery, setSearchQuery] = useState("");
  const [trackingItem, setTrackingItem] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await orderService.getMyOrders();
      if (response.data.success) {
        setOrders(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      showToast.error("Failed to load orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "pending":
        return <Truck className="w-5 h-5 text-blue-600" />;
      case "cancelled":
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Package className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "pending":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesFilter = filter === "all" || order.status === filter;
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const trackingSteps = [];

  return (
    <ProfileLayout>
      <div className="animate-in fade-in slide-in-from-top-4 duration-500">
        {/* Filters and Search */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by order number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#088395] focus:border-transparent"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2">
              {["all", "pending", "delivered", "cancelled"].map((status) => (
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

        {/* Orders List */}
        {loading ? (
          <div className="grid gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-900 rounded-xl p-6 animate-pulse border border-gray-200 dark:border-gray-800">
                <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-1/3 mb-4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-xl p-12 text-center border border-gray-200 dark:border-gray-800 shadow-sm">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No orders found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {searchQuery ? "Try a different search term" : "You haven't placed any orders yet"}
            </p>
            <button
               onClick={() => router.push("/products")}
              className="px-6 py-3 bg-[#088395] hover:bg-[#09637E] text-white rounded-lg transition-colors font-medium"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredOrders.map((order) => (
              <div
                key={order._id}
                className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden"
              >
                {/* Order Header */}
                <div className="bg-gray-50 dark:bg-gray-800/50 px-5 py-3 border-b border-gray-200 dark:border-gray-800 flex flex-wrap justify-between items-center gap-4">
                  <div className="flex gap-6">
                    <div>
                       <p className="text-[8px] text-gray-500 uppercase tracking-wider mb-0.5">Order Placed</p>
                       <p className="text-xs font-medium text-gray-900 dark:text-white">{new Date(order.date).toLocaleDateString()}</p>
                    </div>
                    <div>
                       <p className="text-[8px] text-gray-500 uppercase tracking-wider mb-0.5">Total</p>
                       <p className="text-xs font-medium text-gray-900 dark:text-white">₹{order.total.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[8px] text-gray-500 uppercase tracking-wider mb-0.5">Order # {order.orderNumber}</p>
                    <button className="text-xs text-[#088395] hover:text-[#09637E] font-medium transition-colors">Details</button>
                  </div>
                </div>

                {/* Order Body */}
                <div className="p-5">
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                       {getStatusIcon(order.status)}
                       {order.status === 'delivered' ? 'Delivered' : order.status === 'pending' ? 'Arriving soon' : 'Cancelled'}
                    </h3>
                  </div>
                  
                  {order.items.map((item, idx) => (
                    <div key={idx} className="space-y-4">
                      <div className="flex flex-col sm:flex-row gap-6 items-start py-4 border-b border-gray-100 dark:border-gray-800 last:border-0 last:pb-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-gray-900 dark:text-white text-sm hover:text-[#088395] cursor-pointer transition-colors truncate">{item.name}</h4>
                          <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">Qty: {item.quantity}</p>
                          <p className="font-black text-[#088395] text-base mt-2">₹{item.price.toLocaleString()}</p>
                        </div>
                        <div className="flex flex-col gap-2 w-full sm:w-48 shrink-0">
                          <button 
                            onClick={() => setTrackingItem(item.name === trackingItem ? null : item.name)}
                            className={`w-full px-4 py-2 rounded-lg transition-all text-xs font-black uppercase tracking-widest ${
                              trackingItem === item.name 
                              ? "bg-gray-100 dark:bg-gray-800 text-[#088395] border border-[#088395]/30" 
                              : "bg-[#088395] hover:bg-[#09637E] text-white shadow-sm"
                            }`}
                          >
                            {trackingItem === item.name ? "Close Track" : "Track package"}
                          </button>
                          <button className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors text-sm font-medium">
                            Write a product review
                          </button>
                        </div>
                      </div>

                      {/* Tracking Timeline - Ultra Compact & Modern */}
                      {trackingItem === item.name && (
                        <div className="mt-2 p-5 bg-gray-50/50 dark:bg-gray-800/30 rounded-[2rem] border border-teal-100 dark:border-teal-900/30 animate-in fade-in slide-in-from-top-4 duration-500">
                          <div className="flex items-center justify-between mb-6">
                             <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-[#088395]/20 flex items-center justify-center">
                                   <Clock className="w-4 h-4 text-[#088395]" />
                                </div>
                                <div>
                                   <h5 className="text-[10px] font-black uppercase tracking-widest text-[#088395]">Live Tracking</h5>
                                   <p className="text-[9px] text-gray-400 font-bold">Updated 2 mins ago</p>
                                </div>
                             </div>
                             <button 
                                onClick={() => setTrackingItem(null)}
                                className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                             >
                                <X className="w-3.5 h-3.5 text-gray-400" />
                             </button>
                          </div>

                          <div className="relative flex justify-between items-start px-2">
                             {/* Connecting Line */}
                             <div className="absolute top-4 left-6 right-6 h-0.5 bg-gray-200 dark:bg-gray-800 -z-0">
                                <div className={`h-full bg-[#088395] rounded-full transition-all duration-1000 ${trackingSteps.length > 0 ? 'w-2/3' : 'w-0'}`} />
                             </div>

                             {trackingSteps.length > 0 ? trackingSteps.map((step, sIdx) => {
                                const StepIcon = step.icon || Package;
                                const isCompleted = step.status === "completed";
                                const isCurrent = step.status === "current";
                                
                                return (
                                   <div key={sIdx} className="flex flex-col items-center gap-2 relative z-10 w-1/4">
                                      <div className={`w-8 h-8 rounded-full flex items-center justify-center border-4 transition-all duration-500 ${
                                         isCompleted 
                                         ? "bg-[#088395] border-[#088395] text-white" 
                                         : isCurrent 
                                         ? "bg-white dark:bg-gray-900 border-[#088395] text-[#088395] shadow-lg shadow-teal-500/20 scale-110" 
                                         : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-400"
                                      }`}>
                                         <StepIcon size={14} />
                                      </div>
                                      <div className="text-center">
                                         <p className={`text-[8px] font-black uppercase tracking-tighter ${isCurrent ? "text-[#088395]" : "text-gray-500"}`}>
                                            {step.label || "Update"}
                                         </p>
                                         <p className="text-[7px] text-gray-400 font-bold">{step.date || ""}</p>
                                      </div>
                                   </div>
                                );
                             }) : (
                               <p className="text-xs text-gray-500 text-center w-full">Tracking information not available</p>
                             )}
                          </div>

                          <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800/50 flex items-center justify-between">
                             <div className="flex items-center gap-2">
                                <MapPin className="w-3.5 h-3.5 text-[#088395]" />
                                <span className="text-[9px] font-bold text-gray-600 dark:text-gray-400">Current Location: <span className="text-gray-900 dark:text-white">Not available</span></span>
                             </div>
                             <button className="text-[8px] font-black uppercase tracking-widest text-[#088395] hover:underline transition-all">View Details</button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ProfileLayout>
  );
};

export default OrdersPage;
