"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
  ArrowLeft, 
  Loader2, 
  CreditCard, 
  Banknote, 
  ShieldCheck, 
  CheckCircle2, 
  MapPin, 
  Plus, 
  ShoppingBag, 
  ChevronDown, 
  ChevronUp,
  Sparkles,
  Truck
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { createOrder } from "@/lib/order-helpers";
import { getUserData, saveUserAddress } from "@/lib/user-helpers";
import ProtectedRoute from "@/components/shared/ProtectedRoute";

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, cartTotal, isLoaded, clearCart, cartCount } = useCart();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("cod"); // "cod" or "razorpay"
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showSummaryMobile, setShowSummaryMobile] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  // Pre-fill user data and addresses if logged in
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        email: user.email || prev.email,
        firstName: user.displayName ? user.displayName.split(" ")[0] : prev.firstName,
        lastName: user.displayName && user.displayName.split(" ").length > 1 ? user.displayName.split(" ").slice(1).join(" ") : prev.lastName,
      }));

      // Fetch saved addresses
      getUserData(user.uid).then(({ data, error: userError }) => {
        if (!userError && data?.addresses && Array.isArray(data.addresses) && data.addresses.length > 0) {
          setSavedAddresses(data.addresses);
          
          // Auto-select the first saved address if form address is empty
          const firstAddr = data.addresses[0];
          if (firstAddr) {
            setSelectedAddressId(firstAddr.id);
            const nameParts = (firstAddr.name || "").trim().split(" ");
            setFormData(prev => ({
              ...prev,
              firstName: nameParts[0] || prev.firstName,
              lastName: nameParts.slice(1).join(" ") || prev.lastName,
              phone: firstAddr.phone || prev.phone,
              address: firstAddr.address || "",
              city: firstAddr.city || "",
              state: firstAddr.state || "",
              pincode: firstAddr.pincode || ""
            }));
          }
        }
      });
    }
  }, [user]);

  // Redirect if cart is empty once loaded
  useEffect(() => {
    if (isLoaded && cartItems.length === 0) {
      router.push("/cart");
    }
  }, [isLoaded, cartItems, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
    setSelectedAddressId(null); // Unmark saved card if user manually modifies address
  };

  const handleSelectAddress = (addr) => {
    if (!addr) return;
    setSelectedAddressId(addr.id);
    setError(null);
    const nameParts = (addr.name || "").trim().split(" ");
    setFormData(prev => ({
      ...prev,
      firstName: nameParts[0] || prev.firstName,
      lastName: nameParts.slice(1).join(" ") || prev.lastName,
      phone: addr.phone || prev.phone,
      address: addr.address || "",
      city: addr.city || "",
      state: addr.state || "",
      pincode: addr.pincode || ""
    }));
  };

  const handleClearAddressForNew = () => {
    setSelectedAddressId(null);
    setFormData(prev => ({
      ...prev,
      address: "",
      city: "",
      state: "",
      pincode: ""
    }));
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (typeof window !== "undefined" && window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleRazorpayPayment = async (orderDataToSave) => {
    const res = await loadRazorpayScript();
    if (!res) {
      setError("Razorpay SDK failed to load. Please check your internet connection.");
      setLoading(false);
      return;
    }

    try {
      // 1. Create order on backend
      const result = await fetch("/api/checkout/razorpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: cartTotal }),
      });

      if (!result.ok) {
        const errData = await result.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to initialize payment gateway order.");
      }
      const order = await result.json();

      const activeKey = order.key_id || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      if (!activeKey || activeKey.includes("YOUR_KEY_HERE")) {
        throw new Error("Razorpay Key ID is not configured yet.");
      }

      // 2. Open Razorpay Checkout In-App Modal
      const options = {
        key: activeKey, 
        amount: order.amount,
        currency: order.currency || "INR",
        name: "The Stone Origin",
        description: `Handcrafted order (${cartItems.length} items)`,
        order_id: order.id,
        handler: async function (response) {
          try {
            // 3. Verify Payment Signature
            const verifyRes = await fetch("/api/checkout/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            const verifyData = await verifyRes.json();
            
            if (verifyData.success) {
              // Save paid order to Firestore
              const finalOrderData = {
                ...orderDataToSave,
                status: "paid",
                paymentId: response.razorpay_payment_id,
              };
              const { id: dbOrderId, orderId: displayId, error: dbError } = await createOrder(finalOrderData);
              
              if (dbError) throw new Error(dbError);
              
              clearCart();
              router.push(`/checkout/success?orderId=${displayId || dbOrderId}`);
            } else {
              setError("Payment verification failed. Please contact support.");
            }
          } catch (verErr) {
            setError("Error recording verified payment: " + verErr.message);
          }
        },
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: "#d97706",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
      
      paymentObject.on("payment.failed", function (response) {
        setError(response.error?.description || "Payment was cancelled or failed.");
        setLoading(false);
      });
      
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validation
    if (!formData.firstName.trim() || !formData.address.trim() || !formData.city.trim() || !formData.pincode.trim()) {
      setError("Please fill all required delivery address fields.");
      setLoading(false);
      return;
    }

    const cleanPhone = formData.phone.replace(/\D/g, "");
    if (cleanPhone.length < 10) {
      setError("Please enter a valid 10-digit mobile number.");
      setLoading(false);
      return;
    }

    const cleanPincode = formData.pincode.replace(/\D/g, "");
    if (cleanPincode.length !== 6) {
      setError("Please enter a valid 6-digit Indian PIN Code.");
      setLoading(false);
      return;
    }

    const orderDataToSave = {
      userId: user?.uid || null,
      userEmail: user?.email || formData.email,
      customer: {
        ...formData,
        phone: cleanPhone,
        pincode: cleanPincode,
      },
      items: cartItems.map(item => ({
        productId: item.product.id,
        title: item.product.title,
        price: item.product.price,
        quantity: item.quantity,
        imageUrl: item.product.imageUrl || (item.product.media && item.product.media[0]?.url) || "",
      })),
      totalAmount: cartTotal,
      paymentMethod,
      status: paymentMethod === "cod" ? "pending" : "processing",
    };

    // Auto save new address to user's address book if not already saved
    if (user?.uid) {
      const isNewAddress = !savedAddresses.some(addr => 
        (addr?.address || "").trim().toLowerCase() === formData.address.trim().toLowerCase() && 
        (addr?.pincode || "").trim() === cleanPincode
      );

      if (isNewAddress) {
        const newAddr = {
          title: "Recent Address",
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          phone: cleanPhone,
          address: formData.address.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          pincode: cleanPincode
        };
        try {
          await saveUserAddress(user.uid, newAddr);
        } catch (addrErr) {
          console.warn("Could not auto-save address:", addrErr);
        }
      }
    }

    if (paymentMethod === "cod") {
      // Cash On Delivery
      const { id, orderId: displayId, error: dbError } = await createOrder(orderDataToSave);
      if (dbError) {
        setError(dbError);
        setLoading(false);
      } else {
        clearCart();
        router.push(`/checkout/success?orderId=${displayId || id}`);
      }
    } else {
      // Razorpay Online Payment
      await handleRazorpayPayment(orderDataToSave);
    }
  };

  if (!isLoaded || cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-stone-50 pt-32 pb-24 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-stone-50 pt-20 pb-32 md:pb-24">
        
        {/* Navigation Breadcrumb */}
        <div className="bg-white border-b border-stone-200 py-3.5 mb-6 sm:mb-8 sticky top-14 md:top-20 z-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            <button 
              onClick={() => router.push("/cart")} 
              className="inline-flex items-center gap-2 text-sm text-stone-600 hover:text-amber-600 transition-colors font-medium active:scale-95"
            >
              <ArrowLeft size={16} /> Back to Cart
            </button>
            <div className="flex items-center gap-1.5 text-xs text-stone-500 font-medium">
              <ShieldCheck size={16} className="text-green-600" />
              <span>100% Safe Checkout</span>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header & Steps */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mb-2">Checkout</h1>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-stone-500">
              <span className="font-semibold text-amber-700">1. Address & Payment</span>
              <span>•</span>
              <span>2. Confirmation</span>
            </div>
          </div>
          
          {/* Global Error Banner */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-2xl border border-red-200 text-sm flex items-start gap-3 shadow-sm animate-in fade-in duration-300">
              <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0" />
              <div className="flex-1">{error}</div>
            </div>
          )}

          {/* Mobile Collapsible Order Summary Accordion */}
          <div className="lg:hidden mb-6 bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
            <button
              type="button"
              onClick={() => setShowSummaryMobile(!showSummaryMobile)}
              className="w-full p-4 flex items-center justify-between text-left bg-stone-50/70 hover:bg-stone-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <ShoppingBag size={18} className="text-amber-600" />
                <div>
                  <p className="text-sm font-bold text-stone-900">
                    Order Summary ({cartCount} {cartCount === 1 ? "item" : "items"})
                  </p>
                  <p className="text-xs text-stone-500">Free Safe Shipping Included</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-amber-700">₹{cartTotal.toLocaleString("en-IN")}</span>
                {showSummaryMobile ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </div>
            </button>

            {showSummaryMobile && (
              <div className="p-4 border-t border-stone-100 space-y-3 bg-white animate-in slide-in-from-top-2 duration-200">
                {cartItems.map((item) => (
                  <div key={item.product.id} className="flex items-center gap-3 py-2 border-b border-stone-50 last:border-0">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-stone-100 shrink-0 border border-stone-200 relative">
                      <Image 
                        src={item.product.imageUrl || (item.product.media && item.product.media[0]?.url) || "https://images.unsplash.com/photo-1600155088924-f7481ba938db?q=80&w=800"} 
                        alt={item.product.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-stone-900 truncate">{item.product.title}</p>
                      <p className="text-[11px] text-stone-500">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-xs font-bold text-stone-900 shrink-0">
                      ₹{(item.product.price * item.quantity).toLocaleString("en-IN")}
                    </div>
                  </div>
                ))}
                <div className="pt-2 text-xs flex justify-between text-stone-500">
                  <span>Shipping:</span>
                  <span className="text-green-600 font-semibold">FREE</span>
                </div>
              </div>
            )}
          </div>

          <form id="checkout-form" onSubmit={handlePlaceOrder} className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            
            {/* Left Column: Delivery Address & Payment */}
            <div className="w-full lg:w-2/3 space-y-6 sm:space-y-8">
              
              {/* SECTION 1: DELIVERY ADDRESS */}
              <div className="bg-white p-5 sm:p-8 rounded-3xl shadow-sm border border-stone-200">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm">
                      1
                    </div>
                    <h2 className="text-lg sm:text-xl font-bold text-stone-900">Delivery Address</h2>
                  </div>

                  {savedAddresses.length > 0 && selectedAddressId && (
                    <button
                      type="button"
                      onClick={handleClearAddressForNew}
                      className="text-xs text-amber-700 hover:text-amber-800 font-semibold flex items-center gap-1 active:scale-95"
                    >
                      <Plus size={14} /> New Address
                    </button>
                  )}
                </div>
                
                {/* Saved Addresses Cards */}
                {savedAddresses.length > 0 && (
                  <div className="mb-6">
                    <p className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-3">Saved Addresses</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {savedAddresses.map((addr) => {
                        const isSelected = selectedAddressId === addr.id;
                        return (
                          <div 
                            key={addr.id} 
                            onClick={() => handleSelectAddress(addr)}
                            className={`p-4 rounded-2xl cursor-pointer border-2 transition-all relative ${
                              isSelected 
                                ? "border-amber-600 bg-amber-50/60 ring-2 ring-amber-500/20 shadow-sm" 
                                : "border-stone-200 hover:border-stone-300 bg-white"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <span className="inline-block text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 mb-1">
                                  {addr.title || "Address"}
                                </span>
                                <h4 className="font-bold text-stone-900 text-sm truncate">{addr.name || "Customer"}</h4>
                              </div>
                              {isSelected && (
                                <CheckCircle2 size={18} className="text-amber-600 shrink-0" />
                              )}
                            </div>
                            <p className="text-xs text-stone-600 mt-1 line-clamp-2 leading-relaxed">
                              {addr.address}, {addr.city}, {addr.state} - {addr.pincode}
                            </p>
                            {addr.phone && (
                              <p className="text-[11px] text-stone-500 mt-1 font-medium">📞 {addr.phone}</p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Address Form Inputs */}
                <div className="space-y-4 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">First Name *</label>
                      <input 
                        required 
                        type="text" 
                        name="firstName" 
                        value={formData.firstName} 
                        onChange={handleChange} 
                        placeholder="e.g. Ramesh"
                        className="w-full bg-stone-50 border border-stone-300 rounded-xl py-3 px-4 text-base text-stone-900 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all placeholder:text-stone-400" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">Last Name</label>
                      <input 
                        type="text" 
                        name="lastName" 
                        value={formData.lastName} 
                        onChange={handleChange} 
                        placeholder="e.g. Sharma"
                        className="w-full bg-stone-50 border border-stone-300 rounded-xl py-3 px-4 text-base text-stone-900 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all placeholder:text-stone-400" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">Mobile Number *</label>
                      <div className="relative flex items-center">
                        <span className="absolute left-3.5 text-stone-400 font-medium text-sm">+91</span>
                        <input 
                          required 
                          type="tel" 
                          inputMode="tel"
                          maxLength={10}
                          name="phone" 
                          value={formData.phone} 
                          onChange={handleChange} 
                          placeholder="9876543210"
                          className="w-full bg-stone-50 border border-stone-300 rounded-xl py-3 pl-12 pr-4 text-base text-stone-900 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all placeholder:text-stone-400" 
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">Email Address *</label>
                      <input 
                        required 
                        type="email" 
                        inputMode="email"
                        name="email" 
                        value={formData.email} 
                        onChange={handleChange} 
                        placeholder="name@example.com"
                        className="w-full bg-stone-50 border border-stone-300 rounded-xl py-3 px-4 text-base text-stone-900 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all placeholder:text-stone-400" 
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">Full Street Address *</label>
                    <input 
                      required 
                      type="text" 
                      name="address" 
                      value={formData.address} 
                      onChange={handleChange} 
                      placeholder="House/Flat No., Building Name, Street / Landmark"
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl py-3 px-4 text-base text-stone-900 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all placeholder:text-stone-400" 
                    />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">City *</label>
                      <input 
                        required 
                        type="text" 
                        name="city" 
                        value={formData.city} 
                        onChange={handleChange} 
                        placeholder="e.g. Jaipur"
                        className="w-full bg-stone-50 border border-stone-300 rounded-xl py-3 px-4 text-base text-stone-900 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all placeholder:text-stone-400" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">State *</label>
                      <input 
                        required 
                        type="text" 
                        name="state" 
                        value={formData.state} 
                        onChange={handleChange} 
                        placeholder="e.g. Rajasthan"
                        className="w-full bg-stone-50 border border-stone-300 rounded-xl py-3 px-4 text-base text-stone-900 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all placeholder:text-stone-400" 
                      />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">PIN Code *</label>
                      <input 
                        required 
                        type="text" 
                        inputMode="numeric"
                        maxLength={6}
                        name="pincode" 
                        value={formData.pincode} 
                        onChange={handleChange} 
                        placeholder="6 Digits (e.g. 302001)"
                        className="w-full bg-stone-50 border border-stone-300 rounded-xl py-3 px-4 text-base text-stone-900 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all placeholder:text-stone-400" 
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 2: PAYMENT METHOD */}
              <div className="bg-white p-5 sm:p-8 rounded-3xl shadow-sm border border-stone-200">
                <div className="flex items-center gap-2.5 mb-5">
                  <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm">
                    2
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-stone-900">Payment Option</h2>
                </div>
                
                <div className="space-y-3">
                  
                  {/* Cash On Delivery (COD) */}
                  <label 
                    onClick={() => setPaymentMethod("cod")}
                    className={`flex items-start gap-4 p-4 sm:p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                      paymentMethod === "cod" 
                        ? "border-amber-600 bg-amber-50/50 ring-2 ring-amber-500/10 shadow-sm" 
                        : "border-stone-200 hover:border-stone-300 bg-white"
                    }`}
                  >
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="cod" 
                      checked={paymentMethod === "cod"} 
                      onChange={() => setPaymentMethod("cod")} 
                      className="w-5 h-5 mt-0.5 text-amber-600 focus:ring-amber-500 accent-amber-600 shrink-0" 
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Banknote className={paymentMethod === "cod" ? "text-amber-700" : "text-stone-500"} size={22} />
                          <span className="font-bold text-stone-900 text-base">Cash on Delivery (COD)</span>
                        </div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                          Available
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                        Pay cash upon safe doorstep delivery. No advance payment required.
                      </p>
                    </div>
                  </label>

                  {/* Pay Online with Razorpay */}
                  <label 
                    onClick={() => setPaymentMethod("razorpay")}
                    className={`flex items-start gap-4 p-4 sm:p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                      paymentMethod === "razorpay" 
                        ? "border-amber-600 bg-amber-50/50 ring-2 ring-amber-500/10 shadow-sm" 
                        : "border-stone-200 hover:border-stone-300 bg-white"
                    }`}
                  >
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="razorpay" 
                      checked={paymentMethod === "razorpay"} 
                      onChange={() => setPaymentMethod("razorpay")} 
                      className="w-5 h-5 mt-0.5 text-amber-600 focus:ring-amber-500 accent-amber-600 shrink-0" 
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CreditCard className={paymentMethod === "razorpay" ? "text-amber-700" : "text-stone-500"} size={22} />
                          <span className="font-bold text-stone-900 text-base">UPI / Card / Netbanking</span>
                        </div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                          Online
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                        Pay safely via GPay, PhonePe, Paytm, Debit/Credit Card or Netbanking.
                      </p>
                    </div>
                  </label>

                </div>

                {/* Trust Badges */}
                <div className="mt-6 pt-5 border-t border-stone-100 grid grid-cols-2 gap-3 text-xs text-stone-500">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={16} className="text-amber-600 shrink-0" />
                    <span>Safe Temple Transit</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck size={16} className="text-amber-600 shrink-0" />
                    <span>Free Pan-India Delivery</span>
                  </div>
                </div>

              </div>

            </div>

            {/* Right Column: Desktop Order Summary */}
            <div className="hidden lg:block w-1/3">
              <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-stone-200 sticky top-32">
                <h3 className="text-lg font-serif font-bold text-stone-900 mb-4 pb-4 border-b border-stone-100">
                  Order Summary ({cartCount})
                </h3>
                
                {/* Cart Items List */}
                <div className="space-y-3.5 mb-6 max-h-72 overflow-y-auto pr-1">
                  {cartItems.map((item) => (
                    <div key={item.product.id} className="flex gap-3 items-center">
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-stone-50 shrink-0 border border-stone-200 relative">
                        <Image 
                          src={item.product.imageUrl || (item.product.media && item.product.media[0]?.url) || "https://images.unsplash.com/photo-1600155088924-f7481ba938db?q=80&w=800"} 
                          alt={item.product.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-stone-900 truncate">{item.product.title}</p>
                        <p className="text-[11px] text-stone-500">Qty: {item.quantity}</p>
                        <p className="text-xs font-bold text-amber-700">₹{(item.product.price * item.quantity).toLocaleString("en-IN")}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="border-t border-stone-100 pt-4 space-y-2.5 mb-6 text-sm">
                  <div className="flex justify-between text-stone-600">
                    <span>Subtotal</span>
                    <span>₹{cartTotal.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>Shipping</span>
                    <span className="text-green-600 font-semibold">Free Delivery</span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>Taxes</span>
                    <span className="text-stone-400 text-xs">Included in price</span>
                  </div>
                </div>

                {/* Grand Total */}
                <div className="border-t border-stone-100 pt-4 mb-6">
                  <div className="flex justify-between items-end">
                    <span className="text-stone-900 font-bold text-base">Total Amount</span>
                    <span className="text-2xl font-bold text-amber-700">₹{cartTotal.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                {/* Desktop Submit Button */}
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-stone-900 hover:bg-amber-600 text-white rounded-full py-4 flex items-center justify-center gap-2 font-medium transition-all shadow-lg shadow-stone-900/10 active:scale-[0.98] disabled:opacity-70 disabled:hover:bg-stone-900"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Processing Order...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck size={18} />
                      <span>{paymentMethod === "cod" ? "Confirm Order (COD)" : `Pay ₹${cartTotal.toLocaleString("en-IN")}`}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
            
          </form>

        </div>

        {/* MOBILE STICKY BOTTOM BAR */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-stone-200 p-3.5 px-4 z-40 shadow-[0_-8px_25px_rgba(0,0,0,0.08)] flex items-center justify-between gap-4">
          <div>
            <span className="text-[10px] text-stone-400 block font-medium uppercase tracking-wider">Total Amount</span>
            <span className="text-lg font-bold text-amber-700 leading-tight">₹{cartTotal.toLocaleString("en-IN")}</span>
          </div>

          <button
            type="submit"
            form="checkout-form"
            disabled={loading}
            className="flex-1 max-w-[240px] bg-stone-900 hover:bg-amber-600 active:scale-95 text-white rounded-full py-3.5 px-5 flex items-center justify-center gap-2 font-semibold text-sm transition-all shadow-md disabled:opacity-70"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <ShieldCheck size={16} />
                <span>{paymentMethod === "cod" ? "Place COD Order" : "Pay Online"}</span>
              </>
            )}
          </button>
        </div>

      </div>
    </ProtectedRoute>
  );
}
