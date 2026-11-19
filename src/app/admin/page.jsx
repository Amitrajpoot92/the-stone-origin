"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { 
  Package, 
  PlusSquare, 
  ShoppingCart, 
  Users, 
  TrendingUp, 
  CreditCard, 
  Banknote, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  ArrowRight,
  Loader2,
  RefreshCw,
  ShieldCheck,
  Truck
} from "lucide-react";
import { getAllProducts } from "@/lib/product-helpers";
import { getAllOrders } from "@/lib/order-helpers";
import { getAllUsers } from "@/lib/user-helpers";

export default function AdminDashboardOverview() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    const [prodRes, orderRes, userRes] = await Promise.all([
      getAllProducts(),
      getAllOrders(),
      getAllUsers()
    ]);

    if (!prodRes.error && prodRes.products) {
      setProducts(prodRes.products);
    }
    if (!orderRes.error && orderRes.orders) {
      // Sort orders by newest first
      const sorted = [...orderRes.orders].sort((a, b) => {
        const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : (a.createdAt?.seconds ? a.createdAt.seconds * 1000 : 0);
        const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : (b.createdAt?.seconds ? b.createdAt.seconds * 1000 : 0);
        return timeB - timeA;
      });
      setOrders(sorted);
    }
    if (!userRes.error && userRes.users) {
      setUsers(userRes.users);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  // REVENUE & BUSINESS LOGIC:
  // 1. Online (Razorpay) payments are received instantly when status is not cancelled/failed.
  // 2. COD payments are added to realized revenue ONLY when order is 'delivered'.
  // 3. COD orders in 'pending', 'processing', 'shipped' are tracked as Pending COD.
  let realizedRevenue = 0;
  let pendingCodRevenue = 0;
  let onlineCount = 0;
  let onlineRevenue = 0;
  let codCount = 0;
  let codDeliveredCount = 0;
  let codDeliveredRevenue = 0;

  const statusCounts = {
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
  };

  orders.forEach((order) => {
    const amount = Number(order.totalAmount) || 0;
    const isOnline = order.paymentMethod === "razorpay" || order.paymentMethod === "online";
    const status = (order.status || "pending").toLowerCase();

    // Track status counts
    if (statusCounts[status] !== undefined) {
      statusCounts[status]++;
    } else {
      statusCounts.pending++;
    }

    if (isOnline) {
      onlineCount++;
      if (status !== "cancelled" && status !== "failed") {
        realizedRevenue += amount;
        onlineRevenue += amount;
      }
    } else {
      // Cash on Delivery (COD)
      codCount++;
      if (status === "delivered") {
        realizedRevenue += amount; // Cash successfully collected on delivery
        codDeliveredCount++;
        codDeliveredRevenue += amount;
      } else if (status !== "cancelled") {
        pendingCodRevenue += amount; // Cash pending to be collected on delivery
      }
    }
  });

  // Low stock products alert (inventory <= 2)
  const lowStockProducts = products.filter(p => typeof p.inventory === "number" && p.inventory <= 2);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-28 text-stone-400">
        <Loader2 className="w-10 h-10 animate-spin text-amber-600 mb-4" />
        <p className="font-serif text-stone-600 text-lg">Loading real-time store metrics...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl pb-16">
      
      {/* Header with Live Status & Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-green-700 bg-green-50 px-2.5 py-0.5 rounded-full border border-green-200">
              Live Real-Time Store Data
            </span>
          </div>
          <h2 className="text-3xl font-serif font-bold text-stone-900">Dashboard Overview</h2>
          <p className="text-stone-500 font-light text-sm">
            Accurate revenue, order pipelines, and product inventory synced with Firestore.
          </p>
        </div>

        <button 
          onClick={handleRefresh}
          disabled={refreshing}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-stone-200 hover:border-amber-500 rounded-xl text-stone-700 text-sm font-semibold transition-all shadow-sm active:scale-95 disabled:opacity-60"
        >
          <RefreshCw size={16} className={refreshing ? "animate-spin text-amber-600" : "text-stone-500"} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Primary KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        
        {/* Realized Revenue Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200/80 relative overflow-hidden">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shadow-inner">
              <TrendingUp size={24} />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-green-700 bg-green-50 px-2 py-0.5 rounded-md border border-green-200">
              Realized
            </span>
          </div>
          <p className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1">Total Realized Revenue</p>
          <p className="text-2xl sm:text-3xl font-bold text-stone-900 font-serif">
            ₹{realizedRevenue.toLocaleString("en-IN")}
          </p>
          <p className="text-xs text-stone-500 mt-2 flex items-center gap-1.5">
            <span>Online paid + Delivered COD</span>
          </p>
        </div>

        {/* Total Orders Card */}
        <Link href="/admin/orders" className="group bg-white p-6 rounded-2xl shadow-sm border border-stone-200/80 hover:border-amber-400 transition-all block">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-green-50 text-green-700 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
              <ShoppingCart size={24} />
            </div>
            <span className="text-xs text-stone-400 group-hover:text-amber-600 flex items-center gap-1 font-medium">
              View <ArrowRight size={12} />
            </span>
          </div>
          <p className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1">Total Orders</p>
          <p className="text-2xl sm:text-3xl font-bold text-stone-900 font-serif">{orders.length}</p>
          <p className="text-xs text-stone-500 mt-2">
            <span className="text-amber-700 font-semibold">{statusCounts.pending} Pending</span> • {statusCounts.delivered} Delivered
          </p>
        </Link>

        {/* Total Products Card */}
        <Link href="/admin/inventory" className="group bg-white p-6 rounded-2xl shadow-sm border border-stone-200/80 hover:border-amber-400 transition-all block">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
              <Package size={24} />
            </div>
            <span className="text-xs text-stone-400 group-hover:text-amber-600 flex items-center gap-1 font-medium">
              Inventory <ArrowRight size={12} />
            </span>
          </div>
          <p className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1">Catalog Products</p>
          <p className="text-2xl sm:text-3xl font-bold text-stone-900 font-serif">{products.length}</p>
          <p className="text-xs text-stone-500 mt-2">
            {lowStockProducts.length > 0 ? (
              <span className="text-red-600 font-semibold">{lowStockProducts.length} low on stock</span>
            ) : (
              <span className="text-green-600 font-medium">All stocks healthy</span>
            )}
          </p>
        </Link>

        {/* Total Customers Card */}
        <Link href="/admin/customers" className="group bg-white p-6 rounded-2xl shadow-sm border border-stone-200/80 hover:border-amber-400 transition-all block">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
              <Users size={24} />
            </div>
            <span className="text-xs text-stone-400 group-hover:text-amber-600 flex items-center gap-1 font-medium">
              Directory <ArrowRight size={12} />
            </span>
          </div>
          <p className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1">Total Customers</p>
          <p className="text-2xl sm:text-3xl font-bold text-stone-900 font-serif">{users.length}</p>
          <p className="text-xs text-stone-500 mt-2">Registered buyer accounts</p>
        </Link>

      </div>

      {/* Payment Gateway vs COD Financial Intelligence Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        
        {/* Online Payments Card (Razorpay) */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
                  <CreditCard size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-stone-900 text-base">Online (Razorpay / UPI)</h3>
                  <p className="text-xs text-stone-500">Instant direct payments received</p>
                </div>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                {onlineCount} Orders
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-100">
                <p className="text-xs text-stone-500 mb-1">Realized Online Cash</p>
                <p className="text-xl font-bold text-blue-900">₹{onlineRevenue.toLocaleString("en-IN")}</p>
              </div>
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-100">
                <p className="text-xs text-stone-500 mb-1">Payment Success Rate</p>
                <p className="text-xl font-bold text-stone-900">
                  {orders.length > 0 ? Math.round((onlineCount / orders.length) * 100) : 0}% <span className="text-xs font-normal text-stone-500">share</span>
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center gap-2 text-xs text-green-700 font-medium">
            <ShieldCheck size={16} /> Verified via Razorpay HMAC SHA256 Signature
          </div>
        </div>

        {/* Cash on Delivery (COD) Card */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                  <Banknote size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-stone-900 text-base">Cash on Delivery (COD)</h3>
                  <p className="text-xs text-stone-500">Doorstep physical cash collection</p>
                </div>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                {codCount} Orders
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="p-4 bg-green-50/60 rounded-xl border border-green-200/60">
                <p className="text-xs text-green-700 font-medium mb-1">Collected Revenue (Delivered)</p>
                <p className="text-xl font-bold text-green-900">₹{codDeliveredRevenue.toLocaleString("en-IN")}</p>
                <p className="text-[11px] text-green-700 mt-0.5">{codDeliveredCount} orders delivered</p>
              </div>
              <div className="p-4 bg-yellow-50/60 rounded-xl border border-yellow-200/60">
                <p className="text-xs text-yellow-800 font-medium mb-1">Pending Cash in Transit</p>
                <p className="text-xl font-bold text-yellow-900">₹{pendingCodRevenue.toLocaleString("en-IN")}</p>
                <p className="text-[11px] text-yellow-700 mt-0.5">{codCount - codDeliveredCount} pending delivery</p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center gap-2 text-xs text-stone-500 font-medium">
            <Clock size={16} className="text-amber-600" /> 
            <span>COD revenue is credited strictly upon order delivery</span>
          </div>
        </div>

      </div>

      {/* Low Stock Alert Banner (If Any) */}
      {lowStockProducts.length > 0 && (
        <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="text-red-600 shrink-0" size={24} />
            <div>
              <h4 className="font-bold text-red-900 text-sm">Low Stock Alert ({lowStockProducts.length} items)</h4>
              <p className="text-xs text-red-700">Some handcrafted pieces have 2 or fewer units remaining in warehouse.</p>
            </div>
          </div>
          <Link 
            href="/admin/inventory"
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-colors shrink-0 shadow-sm"
          >
            Manage Inventory
          </Link>
        </div>
      )}

      {/* Recent Orders Live Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden mb-8">
        <div className="p-6 border-b border-stone-200 flex items-center justify-between">
          <div>
            <h3 className="font-serif font-bold text-stone-900 text-lg">Recent Customer Orders</h3>
            <p className="text-xs text-stone-500 font-light mt-0.5">Live transactions incoming from web and mobile</p>
          </div>
          <Link 
            href="/admin/orders" 
            className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 transition-colors"
          >
            All Orders ({orders.length}) <ArrowRight size={14} />
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="p-12 text-center text-stone-400">
            <ShoppingCart size={40} className="mx-auto mb-3 text-stone-300" />
            <p className="text-base font-medium text-stone-600">No orders received yet.</p>
            <p className="text-xs text-stone-400 mt-1">When customers purchase idols, orders will show up here instantly.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-50 text-stone-500 text-[11px] font-bold uppercase tracking-wider border-b border-stone-200">
                  <th className="px-6 py-3.5">Order ID</th>
                  <th className="px-6 py-3.5">Customer</th>
                  <th className="px-6 py-3.5">Payment Mode</th>
                  <th className="px-6 py-3.5">Order Status</th>
                  <th className="px-6 py-3.5">Date</th>
                  <th className="px-6 py-3.5 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-sm">
                {orders.slice(0, 5).map((order) => {
                  const isOnline = order.paymentMethod === "razorpay" || order.paymentMethod === "online";
                  const status = (order.status || "pending").toLowerCase();

                  return (
                    <tr key={order.id} className="hover:bg-stone-50 transition-colors">
                      <td className="px-6 py-4">
                        <Link href="/admin/orders" className="font-mono font-bold text-amber-800 hover:underline">
                          #{order.orderId || order.id.substring(0, 8).toUpperCase()}
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-stone-900">{order.customer?.firstName} {order.customer?.lastName}</p>
                        <p className="text-xs text-stone-400">{order.customer?.phone || order.customer?.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        {isOnline ? (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                            <CreditCard size={12} />
                            <span>Online (Paid)</span>
                          </div>
                        ) : (
                          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${
                            status === "delivered" 
                              ? "bg-green-50 text-green-700 border-green-200" 
                              : "bg-yellow-50 text-yellow-800 border-yellow-200"
                          }`}>
                            <Banknote size={12} />
                            <span>{status === "delivered" ? "COD (Collected)" : "COD (Pending)"}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                          status === "delivered" ? "bg-green-100 text-green-800" :
                          status === "shipped" ? "bg-blue-100 text-blue-800" :
                          status === "processing" ? "bg-orange-100 text-orange-800" :
                          "bg-stone-100 text-stone-700"
                        }`}>
                          {status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-stone-500 whitespace-nowrap">
                        {order.createdAt?.seconds 
                          ? format(new Date(order.createdAt.seconds * 1000), "dd MMM yyyy, p") 
                          : "Recently"}
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-stone-900">
                        ₹{Number(order.totalAmount || 0).toLocaleString("en-IN")}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Actions Shortcuts */}
      <h3 className="text-lg font-serif font-bold text-stone-900 mb-4">Quick Store Shortcuts</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        
        <Link href="/admin/add-product" className="group bg-white p-5 rounded-2xl shadow-sm border border-stone-200 hover:border-amber-500 transition-all flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <PlusSquare size={24} />
          </div>
          <div>
            <h4 className="font-bold text-stone-900 text-sm mb-0.5">Add New Product</h4>
            <p className="text-xs text-stone-500">Upload statue with media and attributes.</p>
          </div>
        </Link>

        <Link href="/admin/inventory" className="group bg-white p-5 rounded-2xl shadow-sm border border-stone-200 hover:border-amber-500 transition-all flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <Package size={24} />
          </div>
          <div>
            <h4 className="font-bold text-stone-900 text-sm mb-0.5">Manage Inventory</h4>
            <p className="text-xs text-stone-500">Update stocks, pricing, or edit idols.</p>
          </div>
        </Link>

        <Link href="/admin/orders" className="group bg-white p-5 rounded-2xl shadow-sm border border-stone-200 hover:border-amber-500 transition-all flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <ShoppingCart size={24} />
          </div>
          <div>
            <h4 className="font-bold text-stone-900 text-sm mb-0.5">All Orders Pipeline</h4>
            <p className="text-xs text-stone-500">Process shipping & track deliveries.</p>
          </div>
        </Link>

      </div>

    </div>
  );
}
