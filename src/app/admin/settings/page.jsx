"use client";

import React, { useState, useEffect } from "react";
import { getStoreInfo, updateStoreInfo } from "@/lib/product-helpers";
import { Save, Loader2, CheckCircle2 } from "lucide-react";

export default function SettingsPage() {
  const [formData, setFormData] = useState({
    address: "",
    phone: "",
    email: "",
    instagram: "",
    facebook: "",
    twitter: "",
    whatsapp: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInfo = async () => {
      const { storeInfo, error } = await getStoreInfo();
      if (!error && storeInfo) {
        setFormData({
          address: storeInfo.address || "",
          phone: storeInfo.phone || "",
          email: storeInfo.email || "",
          instagram: storeInfo.instagram || "",
          facebook: storeInfo.facebook || "",
          twitter: storeInfo.twitter || "",
          whatsapp: storeInfo.whatsapp || ""
        });
      }
      setLoading(false);
    };
    fetchInfo();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    const { error: saveError } = await updateStoreInfo(formData);
    
    if (saveError) {
      setError(saveError);
    } else {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-200">
        <h2 className="text-2xl font-serif font-bold text-stone-900 mb-2 border-b border-stone-100 pb-4">
          Store Information Settings
        </h2>
        <p className="text-stone-500 text-sm mb-6">
          Update the address, phone number, and email. These details will be displayed in the website footer.
        </p>
        
        {success && (
          <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-xl flex items-center gap-3 border border-green-100">
            <CheckCircle2 size={20} />
            <span>Store information updated successfully!</span>
          </div>
        )}
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-stone-700">Store Address</label>
            <textarea 
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows={3}
              placeholder="e.g. 123 Heritage Lane, Makrana, Rajasthan 341505"
              className="w-full bg-stone-50 border border-stone-200 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:border-amber-500 resize-none" 
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-stone-700">Phone / Mobile Number</label>
              <input 
                type="text" 
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="e.g. +91 98765 43210"
                className="w-full bg-stone-50 border border-stone-200 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:border-amber-500" 
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-stone-700">Support Email</label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g. namaste@thestoneorigin.com"
                className="w-full bg-stone-50 border border-stone-200 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:border-amber-500" 
              />
            </div>
          </div>

          <div className="pt-4 border-t border-stone-100">
            <h3 className="text-lg font-serif font-bold text-stone-900 mb-4">Social Media Links</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700">Instagram URL</label>
                <input 
                  type="url" 
                  name="instagram"
                  value={formData.instagram}
                  onChange={handleChange}
                  placeholder="https://instagram.com/yourpage"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:border-amber-500" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700">Facebook URL</label>
                <input 
                  type="url" 
                  name="facebook"
                  value={formData.facebook}
                  onChange={handleChange}
                  placeholder="https://facebook.com/yourpage"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:border-amber-500" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700">Twitter URL</label>
                <input 
                  type="url" 
                  name="twitter"
                  value={formData.twitter}
                  onChange={handleChange}
                  placeholder="https://twitter.com/yourpage"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:border-amber-500" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700">WhatsApp Number</label>
                <input 
                  type="text" 
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  placeholder="e.g. +919876543210 (include country code)"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:border-amber-500" 
                />
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={saving}
            className="w-full sm:w-auto px-8 bg-stone-900 hover:bg-amber-600 text-white rounded-xl py-4 flex items-center justify-center gap-2 font-medium transition-colors shadow-lg shadow-stone-900/10 disabled:opacity-70 mt-6"
          >
            {saving ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Save size={18} />
                Save Settings
              </>
            )}
          </button>

        </form>
      </div>
    </div>
  );
}
