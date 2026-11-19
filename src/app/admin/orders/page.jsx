"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { format } from "date-fns";
import { 
  ShoppingCart, 
  Loader2, 
  Package, 
  Search, 
  ChevronDown, 
  CreditCard, 
  Banknote, 
  CheckCircle2, 
  Clock,
  Filter,
  ShieldCheck
} from "lucide-react";
import { getAllOrders, updateOrderStatus } from "@/lib/order-helpers";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all"); // 'all', 'online', 'cod'
  const [updating, setUpdating] = useState(null); // id of order being updated
  const [visibleCount, setVisibleCount] = useState(10);

  useEffect(() => {
    fetchOrders();
  }, []);

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(10);
  }, [search, activeTab, paymentFilter]);

  const fetchOrders = async () => {
    setLoading(true);
    const { orders: fetchedOrders, error } = await getAllOrders();
    if (!error && fetchedOrders) {
      // Sort by newest first
      fetchedOrders.sort((a, b) => {
        const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : (a.createdAt?.seconds ? a.createdAt.seconds * 1000 : 0);
        const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : (b.createdAt?.seconds ? b.createdAt.seconds * 1000 : 0);
        return timeB - timeA;
      });
      setOrders(fetchedOrders);
    }
    setLoading(false);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdating(orderId);
    const { error } = await updateOrderStatus(orderId, newStatus);
    if (!error) {
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } else {
      alert("Failed to update status: " + error);
    }
    setUpdating(null);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending": return "text-yellow-700 bg-yellow-50 border-yellow-200";
      case "processing": return "text-orange-700 bg-orange-50 border-orange-200";
      case "shipped": return "text-blue-700 bg-blue-50 border-blue-200";
      case "delivered": return "text-green-700 bg-green-50 border-green-200";
      default: return "text-stone-700 bg-stone-50 border-stone-200";
    }
  };

  // Financial summary
  let totalRevenueRealized = 0;
  let totalPendingCOD = 0;

  orders.forEach(o => {
    const amt = Number(o.totalAmount || 0);
    const isOnline = o.paymentMethod === 'razorpay' || o.paymentMethod === 'online';
    const status = (o.status || 'pending').toLowerCase();

    if (isOnline) {
      if (status !== 'cancelled' && status !== 'failed') {
        totalRevenueRealized += amt;
      }
    } else {
      if (status === 'delivered') {
        totalRevenueRealized += amt;
      } else if (status !== 'cancelled') {
        totalPendingCOD += amt;
      }
    }
  });

  const filteredOrders = orders.filter(o => {
    const isOnline = o.paymentMethod === 'razorpay' || o.paymentMethod === 'online';
    
    // Filter by payment method
    if (paymentFilter === "online" && !isOnline) return false;
    if (paymentFilter === "cod" && isOnline) return false;

    // Filter by status tab
    const matchesTab = activeTab === "all" || (o.status?.toLowerCase() || "pending") === activeTab;
    if (!matchesTab) return false;

    // Filter by search query
    const cleanSearch = search.toLowerCase().replace('#', '').trim();
    if (!cleanSearch) return true;

    return (
      (o.orderId || o.id).toLowerCase().includes(cleanSearch) || 
      o.customer?.email?.toLowerCase().includes(cleanSearch) ||
      o.customer?.phone?.includes(cleanSearch) ||
      o.customer?.firstName?.toLowerCase().includes(cleanSearch) ||
      o.customer?.lastName?.toLowerCase().includes(cleanSearch) ||
      o.paymentId?.toLowerCase().includes(cleanSearch)
    );
  });

  const tabs = [
    { id: "all", label: "All Statuses" },
    { id: "pending", label: "Pending" },
    { id: "processing", label: "Processing" },
    { id: "shipped", label: "Shipped" },
    { id: "delivered", label: "Delivered" },
  ];

  return (
    <div className="max-w-7xl pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3">
            <ShoppingCart size={28} className="text-amber-600" />
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">Orders Management</h2>
          </div>
          <p className="text-stone-500 font-light text-xs sm:text-sm mt-1">
            Real-time customer transactions, Razorpay online payments & COD cash tracking.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
          <input 
            type="text" 
            placeholder="Search Order ID, Name, Phone, UPI..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 w-full sm:w-80 shadow-sm"
          />
        </div>
      </div>

      {/* Revenue & Payment Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-sm">
          <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-1">Total Realized Revenue</p>
          <p className="text-xl sm:text-2xl font-bold text-stone-900 font-serif">₹{totalRevenueRealized.toLocaleString("en-IN")}</p>
          <p className="text-[11px] text-green-700 font-medium mt-1">✓ Instant online + Delivered COD</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-sm">
          <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-1">Pending COD Cash</p>
          <p className="text-xl sm:text-2xl font-bold text-amber-700 font-serif">₹{totalPendingCOD.toLocaleString("en-IN")}</p>
          <p className="text-[11px] text-amber-700 font-medium mt-1">⏳ Will add to revenue when delivered</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-sm">
          <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-1">Payment Method Filter</p>
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => setPaymentFilter("all")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                paymentFilter === "all" ? "bg-stone-900 text-white" : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              All ({orders.length})
            </button>
            <button
              onClick={() => setPaymentFilter("online")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                paymentFilter === "online" ? "bg-blue-600 text-white" : "bg-blue-50 text-blue-700 hover:bg-blue-100"
              }`}
            >
              Online ({orders.filter(o => o.paymentMethod === 'razorpay' || o.paymentMethod === 'online').length})
            </button>
            <button
              onClick={() => setPaymentFilter("cod")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                paymentFilter === "cod" ? "bg-amber-600 text-white" : "bg-amber-50 text-amber-800 hover:bg-amber-100"
              }`}
            >
              COD ({orders.filter(o => o.paymentMethod !== 'razorpay' && o.paymentMethod !== 'online').length})
            </button>
          </div>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex overflow-x-auto hide-scrollbar mb-6 border-b border-stone-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`whitespace-nowrap py-3 px-5 text-sm font-semibold transition-colors relative ${
              activeTab === tab.id ? 'text-amber-700' : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            {tab.label}
            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${activeTab === tab.id ? 'bg-amber-100 text-amber-800' : 'bg-stone-100 text-stone-600'}`}>
              {tab.id === 'all' 
                ? orders.length 
                : orders.filter(o => (o.status?.toLowerCase() || 'pending') === tab.id).length}
            </span>
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-600" />
            )}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-stone-400">
          <Loader2 className="w-8 h-8 animate-spin text-amber-600 mb-4" />
          <p className="font-serif text-stone-600">Loading orders...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl shadow-sm border border-stone-200 text-center">
          <Package className="w-12 h-12 text-stone-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-stone-900 mb-2">No orders match your filter</h3>
          <p className="text-stone-500 text-sm">Try resetting filters or search query to see orders.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.slice(0, visibleCount).map((order) => {
            const isOnline = order.paymentMethod === "razorpay" || order.paymentMethod === "online";
            const status = (order.status || "pending").toLowerCase();

            return (
              <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
                
                {/* Order Header */}
                <div className="bg-stone-50 p-4 sm:p-6 border-b border-stone-200 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
                      <span className="font-mono font-bold text-stone-900 text-base">
                        #{order.orderId || order.id.substring(0, 8).toUpperCase()}
                      </span>

                      {/* Explicit Payment Badge */}
                      {isOnline ? (
                        <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border border-blue-200 bg-blue-50 text-blue-800 font-bold">
                          <CreditCard size={14} />
                          <span>Online (Razorpay - Paid)</span>
                        </span>
                      ) : (
                        <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border font-bold ${
                          status === "delivered"
                            ? "bg-green-50 text-green-800 border-green-200"
                            : "bg-yellow-50 text-yellow-800 border-yellow-200"
                        }`}>
                          <Banknote size={14} />
                          <span>{status === "delivered" ? "COD (Cash Collected)" : "COD (Pending on Delivery)"}</span>
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500">
                      <span>Placed on {order.createdAt?.seconds 
                        ? format(new Date(order.createdAt.seconds * 1000), "PPP 'at' p") 
                        : "Recently"}
                      </span>
                      {order.paymentId && (
                        <span className="font-mono text-stone-400">
                          Ref: {order.paymentId}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-5">
                    <div className="text-left sm:text-right">
                      <p className="text-xs text-stone-400 uppercase tracking-wider mb-0.5">Order Total</p>
                      <p className="text-xl font-bold text-amber-700 font-serif">
                        ₹{Number(order.totalAmount || 0).toLocaleString("en-IN")}
                      </p>
                    </div>
                    
                    {/* Status Dropdown Pipeline */}
                    <div className="relative border-l border-stone-200 pl-5">
                      <p className="text-xs text-stone-500 uppercase tracking-wider mb-1 font-semibold">Update Status</p>
                      <div className="relative">
                        <select 
                          value={order.status || "pending"}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          disabled={updating === order.id}
                          className={`appearance-none font-bold text-sm pl-3 pr-8 py-2 rounded-xl border cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-colors shadow-sm ${getStatusColor(order.status || "pending")} ${updating === order.id ? 'opacity-50' : ''}`}
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered (Cash Collected)</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        {updating === order.id ? (
                          <Loader2 size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 animate-spin text-stone-500" />
                        ) : (
                          <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-500 pointer-events-none" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Order Details Body */}
                <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                  {/* Customer Information */}
                  <div className="lg:col-span-1 space-y-4 bg-stone-50/60 p-4 rounded-xl border border-stone-100">
                    <div>
                      <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">Customer</h4>
                      <p className="text-sm font-bold text-stone-900">{order.customer?.firstName} {order.customer?.lastName}</p>
                      <p className="text-sm text-stone-600 mt-0.5">📞 {order.customer?.phone}</p>
                      <p className="text-sm text-stone-600">✉️ {order.customer?.email}</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">Shipping Destination</h4>
                      <p className="text-sm text-stone-700 leading-relaxed">
                        {order.customer?.address}<br/>
                        {order.customer?.city}, {order.customer?.state} - <span className="font-bold">{order.customer?.pincode}</span>
                      </p>
                    </div>
                  </div>
                  
                  {/* Items Purchased */}
                  <div className="lg:col-span-2">
                    <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-3">
                      Ordered Idols & Statues ({order.items?.length || 0})
                    </h4>
                    <div className="space-y-3">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-4 bg-stone-50 p-3 rounded-xl border border-stone-100">
                          <div className="w-14 h-14 rounded-lg overflow-hidden bg-white shrink-0 border border-stone-200 relative">
                            <Image 
                              src={item.imageUrl || "https://images.unsplash.com/photo-1600155088924-f7481ba938db?q=80&w=800"} 
                              alt={item.title} 
                              fill 
                              className="object-cover" 
                            />
                          </div>
                          <div className="flex-grow min-w-0">
                            <h4 className="text-sm font-bold text-stone-900 truncate">{item.title}</h4>
                            <p className="text-xs text-stone-500 mt-0.5">
                              Qty: <span className="font-bold text-stone-800">{item.quantity}</span> × ₹{Number(item.price || 0).toLocaleString("en-IN")}
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-sm font-bold text-stone-900">
                              ₹{(Number(item.price || 0) * Number(item.quantity || 1)).toLocaleString("en-IN")}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
          
          {visibleCount < filteredOrders.length && (
            <div className="pt-4 pb-12 flex justify-center">
              <button
                onClick={() => setVisibleCount(prev => prev + 10)}
                className="px-8 py-3 bg-white border border-stone-200 hover:border-amber-600 hover:text-amber-700 rounded-full text-stone-800 text-sm font-bold transition-all shadow-sm"
              >
                Load More Orders
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
