"use client";

import React, { useState, useEffect } from "react";
import { Mail, MapPin, Phone, ArrowRight, Instagram, Facebook, Twitter, MessageCircle } from "lucide-react";
import { getStoreInfo } from "@/lib/product-helpers";

export default function ContactPage() {
  const [storeInfo, setStoreInfo] = useState({ 
    address: "", phone: "", email: "", instagram: "", facebook: "", twitter: "", whatsapp: "" 
  });
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    inquiryType: "General Inquiry",
    message: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!storeInfo.whatsapp) {
      alert("WhatsApp contact is not configured by the admin yet.");
      return;
    }

    const { firstName, lastName, email, inquiryType, message } = formData;
    const fullName = `${firstName} ${lastName}`.trim();
    
    let waMessage = `*New Inquiry: ${inquiryType}*\n`;
    waMessage += `------------------------\n`;
    waMessage += `*Name:* ${fullName}\n`;
    if (email) waMessage += `*Email:* ${email}\n`;
    waMessage += `*Message:*\n${message}`;

    const encodedMessage = encodeURIComponent(waMessage);
    const waNumber = storeInfo.whatsapp.replace(/\D/g, '');
    
    window.open(`https://wa.me/${waNumber}?text=${encodedMessage}`, "_blank");
  };

  useEffect(() => {
    const fetchInfo = async () => {
      const { storeInfo: info, error } = await getStoreInfo();
      if (!error && info) {
        setStoreInfo(info);
      }
    };
    fetchInfo();
  }, []);

  return (
    <div className="min-h-screen bg-stone-50 pt-32 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16 lg:mb-24">
          <span className="text-amber-500 font-medium tracking-[0.3em] uppercase text-xs sm:text-sm mb-4 block">Get in Touch</span>
          <h1 className="text-5xl sm:text-7xl font-serif font-bold text-stone-900 mb-6">
            Contact <span className="font-cursive text-6xl sm:text-8xl text-amber-600 font-normal">Us</span>
          </h1>
          <p className="text-stone-500 font-light max-w-xl mx-auto text-lg">
            Whether you seek a custom masterpiece or have an inquiry about our collection, our artisans are here to guide you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          
          {/* Left Column: Contact Details */}
          <div className="space-y-12">
            <div>
              <h2 className="text-3xl font-serif font-bold text-stone-900 mb-8">Studio & Workshop</h2>
              
              <div className="space-y-8">
                {storeInfo.address && (
                  <div className="flex items-start gap-6 group">
                    <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shrink-0 group-hover:bg-amber-600 group-hover:text-white transition-colors duration-300">
                      <MapPin size={24} strokeWidth={1.5} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-stone-900 mb-1">Studio & Workshop</h3>
                      <p className="text-stone-500 font-light leading-relaxed whitespace-pre-line">
                        {storeInfo.address}
                      </p>
                    </div>
                  </div>
                )}

                {storeInfo.phone && (
                  <div className="flex items-start gap-6 group">
                    <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shrink-0 group-hover:bg-amber-600 group-hover:text-white transition-colors duration-300">
                      <Phone size={24} strokeWidth={1.5} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-stone-900 mb-1">Phone</h3>
                      <p className="text-stone-500 font-light leading-relaxed">
                        <a href={`tel:${storeInfo.phone.replace(/\s+/g, '')}`} className="hover:text-amber-600 transition-colors">{storeInfo.phone}</a>
                      </p>
                    </div>
                  </div>
                )}

                {storeInfo.email && (
                  <div className="flex items-start gap-6 group">
                    <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shrink-0 group-hover:bg-amber-600 group-hover:text-white transition-colors duration-300">
                      <Mail size={24} strokeWidth={1.5} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-stone-900 mb-1">Email</h3>
                      <p className="text-stone-500 font-light leading-relaxed">
                        <a href={`mailto:${storeInfo.email}`} className="hover:text-amber-600 transition-colors break-all">{storeInfo.email}</a>
                      </p>
                    </div>
                  </div>
                )}

                {(storeInfo.instagram || storeInfo.facebook || storeInfo.twitter || storeInfo.whatsapp) && (
                  <div className="pt-4 flex gap-4">
                    {storeInfo.whatsapp && (
                      <a href={`https://wa.me/${storeInfo.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-stone-200 flex items-center justify-center text-stone-500 hover:bg-[#25D366] hover:text-white hover:border-[#25D366] transition-all">
                        <MessageCircle size={18} />
                      </a>
                    )}
                    {storeInfo.instagram && (
                      <a href={storeInfo.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-stone-200 flex items-center justify-center text-stone-500 hover:bg-[#E1306C] hover:text-white hover:border-[#E1306C] transition-all">
                        <Instagram size={18} />
                      </a>
                    )}
                    {storeInfo.facebook && (
                      <a href={storeInfo.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-stone-200 flex items-center justify-center text-stone-500 hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] transition-all">
                        <Facebook size={18} />
                      </a>
                    )}
                    {storeInfo.twitter && (
                      <a href={storeInfo.twitter} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-stone-200 flex items-center justify-center text-stone-500 hover:bg-black hover:text-white hover:border-black transition-all">
                        <Twitter size={18} />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-8 bg-stone-900 rounded-[2rem] text-white">
              <h3 className="text-2xl font-serif font-bold mb-4">Custom Orders</h3>
              <p className="text-stone-400 font-light leading-relaxed mb-6">
                Looking for a specific deity, size, or material? Our master artisans can carve bespoke idols tailored to your spiritual and architectural needs.
              </p>
              <button className="text-amber-500 font-medium hover:text-white transition-colors flex items-center gap-2">
                Request a Custom Quote <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="bg-white p-8 sm:p-12 rounded-[2rem] shadow-xl shadow-stone-200/50 border border-stone-100 h-fit">
            <h2 className="text-2xl font-serif font-bold text-stone-900 mb-8">Send a Message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-700">First Name *</label>
                  <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required className="w-full bg-stone-50 border border-stone-200 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-700">Last Name</label>
                  <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="w-full bg-stone-50 border border-stone-200 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700">Email Address</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-stone-50 border border-stone-200 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700">Inquiry Type</label>
                <select name="inquiryType" value={formData.inquiryType} onChange={handleChange} className="w-full bg-stone-50 border border-stone-200 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-stone-600 appearance-none">
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Order Status">Order Status</option>
                  <option value="Custom Idol Request">Custom Idol Request</option>
                  <option value="Wholesale/B2B">Wholesale/B2B</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700">Message *</label>
                <textarea name="message" value={formData.message} onChange={handleChange} required rows={5} className="w-full bg-stone-50 border border-stone-200 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all resize-none"></textarea>
              </div>

              <button type="submit" className="w-full bg-[#25D366] hover:bg-[#1DA851] text-white rounded-xl py-4 flex items-center justify-center gap-2 font-medium transition-colors shadow-lg shadow-green-900/10 mt-4">
                Send via WhatsApp <MessageCircle size={18} />
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
