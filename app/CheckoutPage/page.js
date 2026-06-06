'use client';

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter, Link } from "next/navigation";
import {
  MapPin,
  Plus,
  CreditCard,
  Wallet,
  Building2,
  Banknote,
  Shield,
  Lock,
  Check,
  Truck,
  Home,
  Briefcase,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  Edit2,
  Tag,
  Gift,
} from "lucide-react";
import ProfileBreadcrumb from "@/components/Breadcrumbs/ProfileBreadcrumb";

const CheckoutPage = () => {
  const router = useRouter();
  const cartItems = useSelector((state) => state.cart.cartItems);

  const [expandedSection, setExpandedSection] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [processing, setProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    type: "home",
    name: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    pin: "",
  });

  const [addresses, setAddresses] = useState([
    {
      id: 1,
      type: "home",
      label: "Home",
      name: "John Doe",
      phone: "+91 98765 43210",
      line1: "123, Block A, Green Valley Apartments",
      line2: "Sector 12, Dwarka",
      city: "New Delhi",
      state: "Delhi",
      pin: "110078",
      isDefault: true,
    },
    {
      id: 2,
      type: "work",
      label: "Office",
      name: "John Doe",
      phone: "+91 98765 43210",
      line1: "5th Floor, Tower B, Cyber Hub",
      line2: "DLF Phase 3",
      city: "Gurugram",
      state: "Haryana",
      pin: "122002",
      isDefault: false,
    },
  ]);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.price || 0) * item.quantity,
    0
  );
  const shipping = subtotal > 999 ? 0 : 79;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + shipping + tax;
  const selectedAddr = addresses[selectedAddress];

  const handleAddNewAddress = () => {
    if (!newAddress.name || !newAddress.phone || !newAddress.line1 || !newAddress.city || !newAddress.state || !newAddress.pin) return;
    const addr = {
      id: Date.now(),
      type: newAddress.type,
      label: newAddress.type === "home" ? "Home" : newAddress.type === "work" ? "Office" : "Other",
      ...newAddress,
      isDefault: false,
    };
    setAddresses([...addresses, addr]);
    setSelectedAddress(addresses.length);
    setShowAddAddress(false);
    setNewAddress({ type: "home", name: "", phone: "", line1: "", line2: "", city: "", state: "", pin: "" });
  };

  const handlePlaceOrder = async () => {
    setProcessing(true);
    await new Promise((r) => setTimeout(r, 2000));
    setProcessing(false);
    setOrderPlaced(true);
  };

  const toggleSection = (sectionId) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  // Order Placed Success
  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
        <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-premium border border-gray-100 dark:border-gray-800 p-12 max-w-md w-full text-center animate-in fade-in zoom-in duration-700">
          <div className="w-24 h-24 bg-teal-50 dark:bg-[#088395]/10 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce duration-1000">
            <Check className="w-12 h-12 text-[#088395]" strokeWidth={3} />
          </div>
          <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-3 tracking-tighter uppercase">Success!</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-2 font-medium">Your order has been placed successfully.</p>
          <p className="text-[10px] text-gray-400 dark:text-gray-500 mb-10 font-black uppercase tracking-[0.2em]">
            Confirmation sent to your email
          </p>
          <div className="space-y-3">
            <button
              onClick={() => router.push("/orders")}
              className="w-full py-4 rounded-2xl bg-[#088395] hover:bg-[#066a78] text-white font-black uppercase tracking-[0.2em] text-[10px] transition-all shadow-xl shadow-teal-500/20 active:scale-95"
            >
              View My Orders
            </button>
            <button
              onClick={() => router.push("/")}
              className="w-full py-4 rounded-2xl border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 font-black uppercase tracking-[0.2em] text-[10px] transition-all"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-6 px-4">
      <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="flex justify-between items-center mb-6">
          <ProfileBreadcrumb
            customTrail={[
              { label: "Home", path: "/" },
              { label: "Cart", path: "/CartPage" },
              { label: "Checkout", path: "/CheckoutPage" },
            ]}
          />
          <button 
            onClick={() => router.push("/CartPage")}
            className="flex items-center gap-2 text-gray-500 hover:text-[#088395] transition-colors font-black uppercase tracking-widest text-[10px] bg-white dark:bg-gray-900 px-4 py-2.5 rounded-xl border border-gray-100 dark:border-gray-800"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Cart
          </button>
        </div>

        <h1 className="text-xl font-black text-gray-900 dark:text-white mb-6 tracking-tighter uppercase">Checkout</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column — All Sections */}
          <div className="flex-1 space-y-4">

            {/* ── Section 1: Delivery Address ── */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden transition-all duration-300">
              <button 
                onClick={() => toggleSection(1)}
                className="w-full bg-gray-50 dark:bg-gray-800/50 px-5 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between group"
              >
                <div className="flex items-center gap-4">
                  <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm transition-colors ${expandedSection === 1 ? 'bg-[#088395] text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}>1</span>
                  <h2 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-widest">Delivery Address</h2>
                </div>
                {expandedSection === 1 ? <ChevronUp className="w-5 h-5 text-[#088395]" /> : <ChevronDown className="w-5 h-5 text-gray-300" />}
              </button>
              
              <div className={`transition-all duration-500 ease-in-out overflow-hidden ${expandedSection === 1 ? 'max-h-[500px] overflow-y-auto opacity-100 p-5 scrollbar-hide' : 'max-h-0 opacity-0 p-0'}`}>
                <div className="space-y-3">
                  {addresses.map((addr, idx) => (
                    <label
                      key={addr.id}
                      className={`flex items-start gap-4 p-5 rounded-2xl border transition-all ${
                        selectedAddress === idx
                          ? "border-[#088395] bg-teal-50/50 dark:bg-[#088395]/5 shadow-sm"
                          : "border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800 hover:border-gray-200"
                      }`}
                    >
                      <input
                        type="radio"
                        name="address"
                        checked={selectedAddress === idx}
                        onChange={() => {
                          setSelectedAddress(idx);
                          setTimeout(() => setExpandedSection(2), 500);
                        }}
                        className="mt-1 w-5 h-5 text-[#088395] focus:ring-[#088395] accent-[#088395]"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-gray-900 dark:text-white text-base">{addr.name}</span>
                          <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-[10px] rounded-md font-black uppercase tracking-wider">
                            {addr.label}
                          </span>
                          {addr.isDefault && (
                            <span className="px-2 py-0.5 bg-teal-100 dark:bg-[#088395]/20 text-[#088395] text-[10px] rounded-md font-black uppercase tracking-wider">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                          {addr.line1}, {addr.line2 && `${addr.line2}, `}
                          {addr.city}, {addr.state} - {addr.pin}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-1">
                          <Truck className="w-3 h-3" />
                          Phone: {addr.phone}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>

                {/* Add New Address */}
                {!showAddAddress ? (
                  <button
                    onClick={() => setShowAddAddress(true)}
                    className="mt-6 flex items-center gap-2 text-[#088395] hover:text-[#066a78] font-black uppercase tracking-widest text-[10px] transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add a new address
                  </button>
                ) : (
                  <div className="mt-6 p-6 border border-teal-100 dark:border-teal-900/30 rounded-2xl bg-gray-50 dark:bg-gray-800/30 space-y-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-black text-gray-900 dark:text-white uppercase tracking-widest text-sm">New Delivery Details</h3>
                      <button onClick={() => setShowAddAddress(false)} className="text-gray-400 hover:text-[#088395] transition-colors">
                        <ChevronUp className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="flex gap-2">
                      {["home", "work", "other"].map((t) => (
                        <button
                          key={t}
                          onClick={() => setNewAddress({ ...newAddress, type: t })}
                          className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                            newAddress.type === t
                              ? "bg-[#088395] text-white shadow-lg shadow-teal-500/20"
                              : "bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-gray-700"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Full Name"
                        value={newAddress.name}
                        onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                        className="px-5 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#088395] focus:border-transparent transition-all"
                      />
                      <input
                        type="tel"
                        placeholder="Phone Number"
                        value={newAddress.phone}
                        onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                        className="px-5 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#088395] focus:border-transparent transition-all"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Address Line 1"
                      value={newAddress.line1}
                      onChange={(e) => setNewAddress({ ...newAddress, line1: e.target.value })}
                      className="w-full px-5 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#088395] focus:border-transparent transition-all"
                    />
                    <input
                      type="text"
                      placeholder="Address Line 2 (Optional)"
                      value={newAddress.line2}
                      onChange={(e) => setNewAddress({ ...newAddress, line2: e.target.value })}
                      className="w-full px-5 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#088395] focus:border-transparent transition-all"
                    />
                    <div className="grid grid-cols-3 gap-4">
                      <input
                        type="text"
                        placeholder="City"
                        value={newAddress.city}
                        onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                        className="px-5 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#088395] focus:border-transparent transition-all"
                      />
                      <input
                        type="text"
                        placeholder="State"
                        value={newAddress.state}
                        onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                        className="px-5 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#088395] focus:border-transparent transition-all"
                      />
                      <input
                        type="text"
                        placeholder="PIN Code"
                        value={newAddress.pin}
                        onChange={(e) => setNewAddress({ ...newAddress, pin: e.target.value })}
                        className="px-5 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#088395] focus:border-transparent transition-all"
                      />
                    </div>
                    <button
                      onClick={handleAddNewAddress}
                      className="w-full px-8 py-3 bg-[#088395] hover:bg-[#066a78] text-white font-black uppercase tracking-[0.2em] rounded-xl transition-all text-xs"
                    >
                      Save & Deliver Here
                    </button>
                  </div>
                )}
                
                {selectedAddr && (
                  <button 
                    onClick={() => setExpandedSection(2)}
                    className="mt-6 w-full py-4 bg-gray-900 dark:bg-white dark:text-gray-900 text-white font-black uppercase tracking-[0.2em] rounded-2xl text-xs hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-black/10"
                  >
                    Use this Address
                  </button>
                )}
              </div>
            </div>

            {/* ── Section 2: Order Items ── */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden transition-all duration-300">
              <button 
                onClick={() => toggleSection(2)}
                className="w-full bg-gray-50 dark:bg-gray-800/50 px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm transition-colors ${expandedSection === 2 ? 'bg-[#088395] text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}>2</span>
                  <h2 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-widest">Items & Delivery</h2>
                </div>
                {expandedSection === 2 ? <ChevronUp className="w-5 h-5 text-[#088395]" /> : <ChevronDown className="w-5 h-5 text-gray-300" />}
              </button>

              <div className={`transition-all duration-500 ease-in-out overflow-hidden ${expandedSection === 2 ? 'max-h-[500px] overflow-y-auto opacity-100 p-6 scrollbar-hide' : 'max-h-0 opacity-0 p-0'}`}>
                {cartItems.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-8 text-base">
                    Your cart is empty.{" "}
                    <Link href="/products" className="text-[#088395] font-medium hover:underline">
                      Browse products
                    </Link>
                  </p>
                ) : (
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex gap-6 p-4 rounded-2xl border border-gray-50 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/20">
                        <div className="w-24 h-24 rounded-xl bg-white dark:bg-gray-800 overflow-hidden flex-shrink-0 border border-gray-100 dark:border-gray-700">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-[10px] font-black uppercase">No Image</div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                          <h4 className="font-black text-gray-900 dark:text-white text-lg truncate tracking-tight">{item.name}</h4>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-sm font-bold text-[#088395]">Qty: {item.quantity}</span>
                            <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
                            <span className="text-lg font-black text-gray-900 dark:text-white">₹{(item.price * item.quantity).toLocaleString()}</span>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="flex flex-col items-end gap-1">
                            <div className="flex items-center gap-1.5 text-green-600 text-[10px] font-black uppercase tracking-widest">
                              <Truck className="w-4 h-4" />
                              Express Delivery
                            </div>
                            <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">Arriving in 2-3 days</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <button 
                      onClick={() => setExpandedSection(3)}
                      className="mt-4 w-full py-4 bg-gray-900 dark:bg-white dark:text-gray-900 text-white font-black uppercase tracking-[0.2em] rounded-2xl text-xs hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-black/10"
                    >
                      Confirm Items
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* ── Section 3: Payment Method ── */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden transition-all duration-300">
              <button 
                onClick={() => toggleSection(3)}
                className="w-full bg-gray-50 dark:bg-gray-800/50 px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm transition-colors ${expandedSection === 3 ? 'bg-[#088395] text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}>3</span>
                  <h2 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-widest">Payment Method</h2>
                </div>
                {expandedSection === 3 ? <ChevronUp className="w-5 h-5 text-[#088395]" /> : <ChevronDown className="w-5 h-5 text-gray-300" />}
              </button>

              <div className={`transition-all duration-500 ease-in-out overflow-hidden ${expandedSection === 3 ? 'max-h-[1000px] opacity-100 p-6' : 'max-h-0 opacity-0 p-0'}`}>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                  {[
                    { id: "card", label: "Credit Card", icon: CreditCard },
                    { id: "upi", label: "UPI Pay", icon: Wallet },
                    { id: "netbanking", label: "Banking", icon: Building2 },
                    { id: "cod", label: "Cash", icon: Banknote },
                  ].map((method) => {
                    const Icon = method.icon;
                    return (
                      <label
                        key={method.id}
                        className={`flex flex-col items-center gap-3 p-5 border-2 rounded-2xl cursor-pointer transition-all text-center ${
                          paymentMethod === method.id
                            ? "border-[#088395] bg-teal-50/50 dark:bg-[#088395]/5 shadow-sm"
                            : "border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800 hover:border-gray-200"
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment"
                          value={method.id}
                          checked={paymentMethod === method.id}
                          onChange={() => setPaymentMethod(method.id)}
                          className="sr-only"
                        />
                        <Icon className={`w-7 h-7 ${paymentMethod === method.id ? "text-[#088395]" : "text-gray-300 dark:text-gray-600"}`} />
                        <span className={`text-[10px] font-black uppercase tracking-widest ${paymentMethod === method.id ? "text-[#088395]" : "text-gray-500 dark:text-gray-400"}`}>
                          {method.label}
                        </span>
                      </label>
                    );
                  })}
                </div>

                {paymentMethod === "card" && (
                  <div className="p-6 bg-gray-50 dark:bg-gray-800/30 rounded-[2rem] border border-gray-100 dark:border-gray-800 space-y-4 animate-in fade-in slide-in-from-top-2">
                    <div className="relative">
                      <CreditCard className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Card Number"
                        className="w-full pl-14 pr-5 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#088395] transition-all"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="MM / YY"
                        className="px-5 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#088395] transition-all"
                      />
                      <input
                        type="text"
                        placeholder="CVV"
                        className="px-5 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#088395] transition-all"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Name on Card"
                      className="w-full px-5 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#088395] transition-all"
                    />
                  </div>
                )}

                {paymentMethod === "upi" && (
                  <div className="p-6 bg-gray-50 dark:bg-gray-800/30 rounded-[2rem] border border-gray-100 dark:border-gray-800 animate-in fade-in slide-in-from-top-2">
                    <div className="relative">
                      <Wallet className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="UPI ID (e.g., username@okaxis)"
                        className="w-full pl-14 pr-5 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#088395] transition-all"
                      />
                    </div>
                  </div>
                )}
                
                <p className="mt-6 text-[10px] text-gray-400 dark:text-gray-500 font-medium flex items-center gap-2 px-2">
                  <Shield className="w-3 h-3 text-green-500" />
                  Your payment information is encrypted and processed securely.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column — Order Summary (sticky) */}
          <div className="lg:w-[320px] shrink-0">
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 sticky top-24 overflow-hidden shadow-premium">
              {/* Order Summary Header - Compact */}
              <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
                <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-[0.15em]">Order Summary</h3>
              </div>

              {/* Summary Details - Tightened */}
              <div className="p-4 space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between text-[11px] text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">
                    <span>Items ({cartItems.reduce((s, i) => s + i.quantity, 0)})</span>
                    <span className="text-gray-900 dark:text-white font-black">₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? "text-green-600 font-black" : "text-gray-900 dark:text-white font-black"}>
                      {shipping === 0 ? "FREE" : `₹${shipping}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px] text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">
                    <span>Tax (GST)</span>
                    <span className="text-gray-900 dark:text-white font-black">₹{tax.toLocaleString()}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100 dark:border-gray-800">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-widest">Total</span>
                    <span className="text-lg font-black text-[#088395]">₹{total.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  disabled={processing || cartItems.length === 0}
                  className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-[#088395] to-[#077282] hover:from-[#066a78] hover:to-[#055a66] text-white font-black uppercase tracking-[0.2em] text-[10px] transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-teal-500/20 active:scale-95"
                >
                  {processing ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Lock className="w-3.5 h-3.5" />
                  )}
                  {processing ? "Processing..." : "Complete Order"}
                </button>
                
                <p className="text-[9px] text-gray-400 dark:text-gray-500 text-center mt-2 leading-tight font-medium">
                  Secure 256-bit SSL encrypted payment
                </p>

                {/* Compact Security Badges */}
                <div className="mt-4 pt-4 border-t border-gray-50 dark:border-gray-800 flex items-center justify-around">
                   <div className="flex flex-col items-center gap-1 opacity-30">
                      <Shield size={14} />
                      <span className="text-[7px] font-black uppercase tracking-tighter">Safe</span>
                   </div>
                   <div className="flex flex-col items-center gap-1 opacity-30">
                      <Lock size={14} />
                      <span className="text-[7px] font-black uppercase tracking-tighter">SSL</span>
                   </div>
                   <div className="flex flex-col items-center gap-1 opacity-30">
                      <Check size={14} />
                      <span className="text-[7px] font-black uppercase tracking-tighter">Verified</span>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
