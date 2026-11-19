"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { format } from "date-fns";
import { ShoppingCart, Loader2, Package, Search, ChevronDown } from "lucide-react";
import { getAllOrders, updateOrderStatus } from "@/lib/order-helpers";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [updating, setUpdating] = useState(null); // id of order being updated
  const [visibleCount, setVisibleCount] = useState(5);

  useEffect(() => {
    fetchOrders();
  }, []);

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(5);
  }, [search, activeTab]);

  const fetchOrders = async () => {
    setLoading(true);
    const { orders: fetchedOrders, error } = await getAllOrders();
    if (!error) {
      // Sort by newest first
      fetchedOrders.sort((a, b) => b.createdAt?.toMillis() - a.createdAt?.toMillis());
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
      alert("Failed to update status");
    }
    setUpdating(null);
  };

  const getPaymentBadge = (method) => {
    if (method === 'cod') return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-blue-100 text-blue-800 border-blue-200";
  };
  
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending": return "text-yellow-600 bg-yellow-50";
      case "processing": return "text-orange-600 bg-orange-50";
      case "shipped": return "text-blue-600 bg-blue-50";
      case "delivered": return "text-green-600 bg-green-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  const filteredOrders = orders.filter(o => {
    const cleanSearch = search.toLowerCase().replace('#', '').trim();
    if (!cleanSearch) {
      const matchesTab = activeTab === "all" || (o.status?.toLowerCase() || "pending") === activeTab;
      return matchesTab;
    }

    const matchesSearch = (o.orderId || o.id).toLowerCase().includes(cleanSearch) || 
      o.customer?.email?.toLowerCase().includes(cleanSearch) ||
      o.customer?.phone?.includes(cleanSearch) ||
      o.customer?.firstName?.toLowerCase().includes(cleanSearch) ||
      o.customer?.lastName?.toLowerCase().includes(cleanSearch);
      
    const matchesTab = activeTab === "all" || (o.status?.toLowerCase() || "pending") === activeTab;
    
    return matchesSearch && matchesTab;
  });

  const tabs = [
    { id: "all", label: "All Orders" },
    { id: "pending", label: "Pending" },
    { id: "processing", label: "Processing" },
    { id: "shipped", label: "Shipped" },
    { id: "delivered", label: "Delivered" },
  ];

  return (
    <div className="max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <ShoppingCart size={28} className="text-amber-600" />
          <h2 className="text-2xl font-serif font-bold text-stone-900">Orders Management</h2>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by ID, email or name..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 w-full sm:w-80"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto hide-scrollbar mb-8 border-b border-stone-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`whitespace-nowrap py-3 px-6 text-sm font-medium transition-colors relative ${
              activeTab === tab.id ? 'text-amber-600' : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            {tab.label}
            {/* Count bubble */}
            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${activeTab === tab.id ? 'bg-amber-100 text-amber-700' : 'bg-stone-100 text-stone-600'}`}>
              {tab.id === 'all' ? orders.length : orders.filter(o => (o.status?.toLowerCase() || 'pending') === tab.id).length}
            </span>
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-600" />
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-stone-400">
          <Loader2 className="w-8 h-8 animate-spin mb-4" />
          <p>Loading orders...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl shadow-sm border border-stone-200 text-center">
          <Package className="w-12 h-12 text-stone-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-stone-900 mb-2">No orders found</h3>
          <p className="text-stone-500 text-sm">We couldn't find any orders matching your criteria.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.slice(0, visibleCount).map(order => (
            <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
              {/* Header */}
              <div className="bg-stone-50 p-4 sm:p-6 border-b border-stone-200 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-bold text-stone-900">Order #{order.orderId || order.id.substring(0, 8).toUpperCase()}</span>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full border font-medium uppercase tracking-wide ${getPaymentBadge(order.paymentMethod)}`}>
                      {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Prepaid'}
                    </span>
                  </div>
                  <p className="text-sm text-stone-500">
                    Placed on {order.createdAt?.seconds ? format(new Date(order.createdAt.seconds * 1000), "PPP 'at' p") : "Recently"}
                  </p>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right flex flex-col items-end">
                    <p className="text-xs text-stone-500 uppercase tracking-wider mb-0.5">Total Amount</p>
                    <p className="text-lg font-bold text-amber-700">₹{order.totalAmount?.toLocaleString("en-IN")}</p>
                    <span className={`mt-1 text-[10px] px-2 py-0.5 rounded-md border font-bold uppercase tracking-widest ${getPaymentBadge(order.paymentMethod)}`}>
                      {order.paymentMethod === 'cod' ? 'COD' : 'PREPAID'}
                    </span>
                  </div>
                  
                  {/* Status Dropdown */}
                  <div className="relative border-l border-stone-200 pl-4">
                    <p className="text-xs text-stone-500 uppercase tracking-wider mb-1">Status</p>
                    <div className="relative">
                      <select 
                        value={order.status || "pending"}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        disabled={updating === order.id}
                        className={`appearance-none font-bold text-sm pl-3 pr-8 py-1.5 rounded-lg border border-stone-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-colors ${getStatusColor(order.status || "pending")} ${updating === order.id ? 'opacity-50' : ''}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
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
              
              {/* Body */}
              <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Customer Details */}
                <div className="lg:col-span-1 space-y-4">
                  <div>
                    <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-2">Customer Details</h4>
                    <p className="text-sm font-medium text-stone-900">{order.customer?.firstName} {order.customer?.lastName}</p>
                    <p className="text-sm text-stone-600">{order.customer?.email}</p>
                    <p className="text-sm text-stone-600">{order.customer?.phone}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-2">Shipping Address</h4>
                    <p className="text-sm text-stone-600">
                      {order.customer?.address}<br/>
                      {order.customer?.city}, {order.customer?.state} {order.customer?.pincode}
                    </p>
                  </div>
                </div>
                
                {/* Items */}
                <div className="lg:col-span-2">
                  <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-4">Order Items ({order.items?.length})</h4>
                  <div className="space-y-4">
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4 bg-stone-50 p-3 rounded-xl border border-stone-100">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-white shrink-0 border border-stone-200 relative">
                          <Image src={item.imageUrl || "https://images.unsplash.com/photo-1600155088924-f7481ba938db?q=80&w=800"} alt={item.title} fill className="object-cover" />
                        </div>
                        <div className="flex-grow">
                          <h4 className="text-sm font-bold text-stone-900 line-clamp-1">{item.title}</h4>
                          <p className="text-xs text-stone-500 mt-0.5">Qty: {item.quantity} × ₹{item.price?.toLocaleString("en-IN")}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-bold text-stone-900">₹{(item.price * item.quantity).toLocaleString("en-IN")}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {visibleCount < filteredOrders.length && (
            <div className="pt-6 pb-12 flex justify-center">
              <button
                onClick={() => setVisibleCount(prev => prev + 5)}
                className="px-8 py-3 bg-white border border-stone-200 hover:border-amber-600 hover:text-amber-600 rounded-full text-stone-700 text-sm font-bold transition-colors shadow-sm"
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
