"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { Package, Loader2, ArrowRight, User, MapPin, Trash2, Plus, ShieldCheck, CheckCircle2, Navigation, X } from "lucide-react";
import ProtectedRoute from "@/components/shared/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { logout, sendResetEmail } from "@/lib/auth-helpers";
import { getUserOrders } from "@/lib/order-helpers";
import { getUserData, updateUserProfile, saveUserAddress, deleteUserAddress } from "@/lib/user-helpers";

export default function ProfilePage() {
  const { user } = useAuth();
  
  // State
  const [activeTab, setActiveTab] = useState("orders"); // 'orders', 'settings', 'addresses'
  
  // Data State
  const [orders, setOrders] = useState([]);
  const [phone, setPhone] = useState("");
  const [addresses, setAddresses] = useState([]);
  const [trackingOrder, setTrackingOrder] = useState(null);
  
  // Loading & Form States
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  
  // Account Settings Form
  const [settingsForm, setSettingsForm] = useState({
    displayName: "",
    phone: "",
  });
  
  const [passwordSaving, setPasswordSaving] = useState(false);
  
  // Address Form
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [addressForm, setAddressForm] = useState({
    title: "",
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  useEffect(() => {
    const fetchAllData = async () => {
      if (user?.email) {
        // Fetch Orders by both email and user.uid
        const { orders: fetchedOrders, error: orderError } = await getUserOrders(user.email, user.uid);
        if (!orderError) setOrders(fetchedOrders);
        
        // Fetch User Data (Phone, Addresses)
        const { data: fetchedUserData, error: userError } = await getUserData(user.uid);
        if (!userError && fetchedUserData) {
          setPhone(fetchedUserData.phone || "");
          setAddresses(fetchedUserData.addresses || []);
          
          setSettingsForm({
            displayName: user.displayName || fetchedUserData.name || "",
            phone: fetchedUserData.phone || "",
          });
        } else {
          setSettingsForm({
            displayName: user.displayName || "",
            phone: "",
          });
        }
      }
      setLoading(false);
    };

    fetchAllData();
  }, [user]);

  const getPaymentBadge = (method) => {
    if (method === 'cod') {
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    }
    return "bg-blue-100 text-blue-800 border-blue-200";
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    const result = await updateUserProfile(user.uid, settingsForm);
    if (result.error) {
      setMessage({ type: 'error', text: result.error });
    } else {
      setPhone(settingsForm.phone);
      setMessage({ type: 'success', text: "Profile updated successfully." });
    }
    setSaving(false);
    setTimeout(() => setMessage(null), 3000);
  };

  const handleResetPassword = async () => {
    setPasswordSaving(true);
    setMessage(null);
    const result = await sendResetEmail(user.email);
    if (result.error) {
      setMessage({ type: 'error', text: result.error });
    } else {
      setMessage({ type: 'success', text: "Password reset link has been sent to your email address." });
    }
    setPasswordSaving(false);
    setTimeout(() => setMessage(null), 4000);
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    const result = await saveUserAddress(user.uid, addressForm);
    if (result.error) {
      setMessage({ type: 'error', text: result.error });
    } else {
      setAddresses(result.addresses);
      setIsAddingAddress(false);
      setAddressForm({ title: "", name: "", phone: "", address: "", city: "", state: "", pincode: "" });
      setMessage({ type: 'success', text: "Address saved successfully." });
    }
    setSaving(false);
    setTimeout(() => setMessage(null), 3000);
  };

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;
    const result = await deleteUserAddress(user.uid, addressId);
    if (!result.error) {
      setAddresses(result.addresses);
    }
  };

  const renderTabContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center py-20 text-stone-400">
          <Loader2 className="w-8 h-8 animate-spin mb-4" />
          <p>Loading your data...</p>
        </div>
      );
    }

    if (activeTab === "orders") {
      return (
        <>
          <div className="p-6 sm:p-8 border-b border-stone-100 flex items-center gap-3">
            <Package className="text-amber-600" />
            <h2 className="text-xl font-bold text-stone-900">Order History</h2>
          </div>
          <div className="p-6 sm:p-8">
            {orders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-stone-200 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-stone-900 mb-2">No orders yet</h3>
                <p className="text-stone-500 mb-6">You haven't added any pieces to your sanctuary.</p>
                <Link href="/shop" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-stone-900 hover:bg-amber-600 text-white rounded-full transition-colors text-sm font-medium">
                  Explore the Collection <ArrowRight size={16} />
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order.id} className="border border-stone-100 rounded-2xl p-4 sm:p-6 hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-stone-50">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-sm font-bold text-stone-900">Order #{order.orderId || order.id.substring(0, 8).toUpperCase()}</span>
                          <span className={`text-xs px-2.5 py-0.5 rounded-full border font-medium uppercase tracking-wide ${getPaymentBadge(order.paymentMethod)}`}>
                            {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Prepaid'}
                          </span>
                        </div>
                        <p className="text-sm text-stone-500">
                          Placed on {order.createdAt?.seconds ? format(new Date(order.createdAt.seconds * 1000), "PPP") : "Recently"}
                        </p>
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="text-xs text-stone-500 uppercase tracking-wider mb-1">Total Amount</p>
                        <p className="text-lg font-bold text-amber-700">₹{order.totalAmount?.toLocaleString("en-IN")}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-xl overflow-hidden bg-stone-50 shrink-0 border border-stone-100 relative">
                            <Image src={item.imageUrl || "https://images.unsplash.com/photo-1600155088924-f7481ba938db?q=80&w=800"} alt={item.title} fill className="object-cover" />
                          </div>
                          <div className="flex-grow">
                            <Link href={`/product/${item.productId}`}>
                              <h4 className="text-sm font-bold text-stone-900 hover:text-amber-600 transition-colors line-clamp-1">{item.title}</h4>
                            </Link>
                            <p className="text-xs text-stone-500 mt-1">Qty: {item.quantity}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-sm font-bold text-stone-900">₹{(item.price * item.quantity).toLocaleString("en-IN")}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 pt-6 border-t border-stone-50 flex justify-end">
                      <button 
                        onClick={() => setTrackingOrder(order)}
                        className="flex items-center gap-2 bg-stone-900 hover:bg-amber-600 text-white px-5 py-2.5 rounded-full text-sm font-medium transition-colors"
                      >
                        <Navigation size={16} /> Track Order
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      );
    }

    if (activeTab === "settings") {
      return (
        <>
          <div className="p-6 sm:p-8 border-b border-stone-100 flex items-center gap-3">
            <User className="text-amber-600" />
            <h2 className="text-xl font-bold text-stone-900">Account Settings</h2>
          </div>
          <div className="p-6 sm:p-8">
            <form onSubmit={handleUpdateProfile} className="max-w-md space-y-5">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Email Address</label>
                <input type="email" value={user?.email || ""} disabled className="w-full bg-stone-100 border border-stone-200 rounded-xl py-3 px-4 text-sm text-stone-500 cursor-not-allowed" />
                <p className="text-xs text-stone-400 mt-1.5 flex items-center gap-1"><ShieldCheck size={12}/> Email cannot be changed here.</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Full Name</label>
                <input type="text" required value={settingsForm.displayName} onChange={(e) => setSettingsForm({...settingsForm, displayName: e.target.value})} className="w-full bg-stone-50 border border-stone-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Phone Number</label>
                <input type="tel" value={settingsForm.phone} onChange={(e) => setSettingsForm({...settingsForm, phone: e.target.value})} className="w-full bg-stone-50 border border-stone-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all" />
              </div>
              <div className="pt-2">
                <button type="submit" disabled={saving} className="bg-stone-900 hover:bg-amber-600 text-white rounded-xl py-3 px-6 text-sm font-medium transition-colors shadow-lg shadow-stone-900/10 flex items-center gap-2">
                  {saving && <Loader2 size={16} className="animate-spin" />}
                  Save Changes
                </button>
              </div>
            </form>

            <hr className="my-8 border-stone-200" />

            <h3 className="text-lg font-bold text-stone-900 mb-2">Change Password</h3>
            <p className="text-sm text-stone-500 mb-5">
              Click the button below to receive a secure password reset link on your registered email address.
            </p>
            <button 
              onClick={handleResetPassword}
              disabled={passwordSaving} 
              className="bg-white border border-stone-200 hover:bg-stone-50 text-stone-900 rounded-xl py-3 px-6 text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
            >
              {passwordSaving && <Loader2 size={16} className="animate-spin" />}
              Send Password Reset Link
            </button>
          </div>
        </>
      );
    }

    if (activeTab === "addresses") {
      return (
        <>
          <div className="p-6 sm:p-8 border-b border-stone-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MapPin className="text-amber-600" />
              <h2 className="text-xl font-bold text-stone-900">Saved Addresses</h2>
            </div>
            {!isAddingAddress && (
              <button onClick={() => setIsAddingAddress(true)} className="flex items-center gap-2 text-sm font-medium text-amber-600 hover:text-amber-700 bg-amber-50 px-4 py-2 rounded-lg transition-colors">
                <Plus size={16} /> Add New
              </button>
            )}
          </div>
          <div className="p-6 sm:p-8 bg-stone-50/50">
            {isAddingAddress ? (
              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
                <h3 className="font-bold text-stone-900 mb-4">Add New Address</h3>
                <form onSubmit={handleAddAddress} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-stone-500 mb-1">Address Title (e.g. Home, Office)</label>
                      <input required type="text" value={addressForm.title} onChange={e => setAddressForm({...addressForm, title: e.target.value})} className="w-full bg-stone-50 border border-stone-200 rounded-lg py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-stone-500 mb-1">Full Name</label>
                      <input required type="text" value={addressForm.name} onChange={e => setAddressForm({...addressForm, name: e.target.value})} className="w-full bg-stone-50 border border-stone-200 rounded-lg py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-500 mb-1">Phone Number</label>
                    <input required type="tel" value={addressForm.phone} onChange={e => setAddressForm({...addressForm, phone: e.target.value})} className="w-full bg-stone-50 border border-stone-200 rounded-lg py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-500 mb-1">Full Address</label>
                    <input required type="text" value={addressForm.address} onChange={e => setAddressForm({...addressForm, address: e.target.value})} className="w-full bg-stone-50 border border-stone-200 rounded-lg py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-stone-500 mb-1">City</label>
                      <input required type="text" value={addressForm.city} onChange={e => setAddressForm({...addressForm, city: e.target.value})} className="w-full bg-stone-50 border border-stone-200 rounded-lg py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-stone-500 mb-1">State</label>
                      <input required type="text" value={addressForm.state} onChange={e => setAddressForm({...addressForm, state: e.target.value})} className="w-full bg-stone-50 border border-stone-200 rounded-lg py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-stone-500 mb-1">PIN Code</label>
                      <input required type="text" value={addressForm.pincode} onChange={e => setAddressForm({...addressForm, pincode: e.target.value})} className="w-full bg-stone-50 border border-stone-200 rounded-lg py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500" />
                    </div>
                  </div>
                  <div className="pt-2 flex gap-3">
                    <button type="submit" disabled={saving} className="bg-stone-900 hover:bg-amber-600 text-white rounded-lg py-2 px-6 text-sm font-medium transition-colors">
                      {saving ? "Saving..." : "Save Address"}
                    </button>
                    <button type="button" onClick={() => setIsAddingAddress(false)} className="bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg py-2 px-6 text-sm font-medium transition-colors">
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            ) : addresses.length === 0 ? (
              <div className="text-center py-8">
                <MapPin className="w-12 h-12 text-stone-200 mx-auto mb-3" />
                <p className="text-stone-500 mb-4">You have no saved addresses.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.map((addr) => (
                  <div key={addr.id} className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm relative group">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-stone-900 flex items-center gap-2">
                        {addr.title}
                      </h4>
                      <button onClick={() => handleDeleteAddress(addr.id)} className="text-stone-400 hover:text-red-500 transition-colors p-1" title="Delete address">
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <p className="text-sm font-medium text-stone-700">{addr.name}</p>
                    <p className="text-sm text-stone-500 mt-1">{addr.address}</p>
                    <p className="text-sm text-stone-500">{addr.city}, {addr.state} - {addr.pincode}</p>
                    <p className="text-sm text-stone-500 mt-2 flex items-center gap-1">📞 {addr.phone}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      );
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-stone-50 pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 sm:mb-12 gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900">My Sanctuary</h1>
              <p className="text-stone-500 mt-2">Welcome back, {settingsForm.displayName || user?.email}</p>
            </div>
            <button 
              onClick={logout}
              className="px-6 py-2.5 bg-white border border-stone-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 rounded-full text-stone-700 transition-colors text-sm font-medium self-start sm:self-auto shadow-sm"
            >
              Sign Out
            </button>
          </div>
          
          {/* Tracking Modal */}
          {trackingOrder && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
              <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl relative">
                <button onClick={() => setTrackingOrder(null)} className="absolute top-6 right-6 text-stone-400 hover:text-stone-900 bg-stone-100 rounded-full p-2">
                  <X size={20} />
                </button>
                <h3 className="text-2xl font-serif font-bold text-stone-900 mb-2">Track Order</h3>
                <p className="text-sm text-stone-500 mb-8">Order #{trackingOrder.orderId || trackingOrder.id.substring(0, 8).toUpperCase()}</p>
                
                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-stone-200">
                  {["Pending", "Processing", "Shipped", "Delivered"].map((step, idx) => {
                    const statusOrder = ["pending", "paid", "processing", "shipped", "delivered"];
                    const currentStatusIdx = statusOrder.indexOf(trackingOrder.status?.toLowerCase() || "pending");
                    const stepIdx = statusOrder.indexOf(step.toLowerCase());
                    const isCompleted = currentStatusIdx >= stepIdx || (step === "Pending" && currentStatusIdx >= 0);
                    const isActive = currentStatusIdx === stepIdx || (step === "Pending" && currentStatusIdx <= 0);
                    
                    return (
                      <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 ${isCompleted ? 'bg-amber-500 text-white' : 'bg-stone-200 text-stone-400'}`}>
                          {isCompleted ? <CheckCircle2 size={20} /> : <div className="w-2.5 h-2.5 rounded-full bg-stone-400" />}
                        </div>
                        <div className={`w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border ${isActive ? 'border-amber-200 bg-amber-50' : 'border-stone-100 bg-white'}`}>
                           <div className={`font-bold ${isActive ? 'text-amber-900' : isCompleted ? 'text-stone-900' : 'text-stone-400'}`}>{step}</div>
                           <div className="text-xs text-stone-500 mt-1">
                             {step === "Pending" && "Order received by the sanctuary"}
                             {step === "Processing" && "We are carefully packing your items"}
                             {step === "Shipped" && "Your package is on the way"}
                             {step === "Delivered" && "Successfully delivered to your address"}
                           </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Global Message Banner */}
          {message && (
            <div className={`mb-6 p-4 rounded-xl text-sm font-medium ${message.type === 'error' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-700 border border-green-100'}`}>
              {message.text}
            </div>
          )}

          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            
            {/* Sidebar / Options */}
            <div className="w-full lg:w-1/4">
              <div className="bg-white rounded-3xl shadow-sm border border-stone-100 overflow-hidden lg:sticky lg:top-32">
                <div className="p-4 sm:p-6">
                  <h3 className="text-lg font-bold text-stone-900 mb-4 px-2">Account</h3>
                  <div className="space-y-1.5">
                    <button 
                      onClick={() => setActiveTab('orders')}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'orders' ? 'bg-amber-50 text-amber-700' : 'text-stone-600 hover:bg-stone-50'}`}
                    >
                      <Package size={18} className={activeTab === 'orders' ? 'text-amber-600' : 'text-stone-400'} /> 
                      My Orders
                    </button>
                    <button 
                      onClick={() => setActiveTab('settings')}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'settings' ? 'bg-amber-50 text-amber-700' : 'text-stone-600 hover:bg-stone-50'}`}
                    >
                      <User size={18} className={activeTab === 'settings' ? 'text-amber-600' : 'text-stone-400'} /> 
                      Account Settings
                    </button>
                    <button 
                      onClick={() => setActiveTab('addresses')}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'addresses' ? 'bg-amber-50 text-amber-700' : 'text-stone-600 hover:bg-stone-50'}`}
                    >
                      <MapPin size={18} className={activeTab === 'addresses' ? 'text-amber-600' : 'text-stone-400'} /> 
                      Saved Addresses
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="w-full lg:w-3/4">
              <div className="bg-white rounded-3xl shadow-sm border border-stone-100 overflow-hidden min-h-[500px]">
                {renderTabContent()}
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
