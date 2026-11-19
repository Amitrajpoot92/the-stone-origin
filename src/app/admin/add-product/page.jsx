"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { addProduct, getAllCategories, getGlobalAttributes } from "@/lib/product-helpers";
import { Upload, Loader2, CheckCircle2, X, ArrowLeft, ArrowRight, Video } from "lucide-react";

export default function AddProductPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    price: "",
    mainCategoryId: "",
    subCategoryId: "",
    description: "",
    dimensions: "",
    size: "",
    material: "",
    inventory: "",
    finish: "",
    placement: "",
    theme: "",
    pose: "",
    customizable: "No",
    weatherResistant: "No",
    isTrending: false
  });
  const [mediaFiles, setMediaFiles] = useState([]);

  const [categories, setCategories] = useState([]);
  const [mainCategories, setMainCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  
  const [globalAttributes, setGlobalAttributes] = useState({
    sizes: [], materials: [], finishes: [], themes: [], poses: [], placements: []
  });

  useEffect(() => {
    const fetchCats = async () => {
      const { categories, error } = await getAllCategories();
      if (!error && categories.length > 0) {
        setCategories(categories);
        const mains = categories.filter(c => c.type === "main" || !c.type);
        setMainCategories(mains);
        
        // Default select first available main category
        if (mains.length > 0) {
          const firstMain = mains[0];
          const firstMainSubs = categories.filter(c => c.parentId === firstMain.id);
          
          setFormData(prev => ({ 
            ...prev, 
            mainCategoryId: firstMain.id,
            subCategoryId: firstMainSubs.length > 0 ? firstMainSubs[0].id : ""
          }));
        }
      }

      const { attributes, error: attrError } = await getGlobalAttributes();
      if (!attrError && attributes) {
        setGlobalAttributes(prev => ({ ...prev, ...attributes }));
      }

      setLoadingCategories(false);
    };
    fetchCats();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // If main category changes, auto-select the first sub-category of the new main category
    if (name === "mainCategoryId") {
      const relatedSubs = categories.filter(c => c.parentId === value);
      setFormData(prev => ({
        ...prev,
        mainCategoryId: value,
        subCategoryId: relatedSubs.length > 0 ? relatedSubs[0].id : ""
      }));
    } else if (e.target.type === "checkbox") {
      setFormData({ ...formData, [name]: e.target.checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    // Basic validation
    if (!formData.title || !formData.price || mediaFiles.length === 0 || !formData.inventory) {
      setError("Title, Price, Inventory, and at least one Media File are required.");
      setLoading(false);
      return;
    }
    
    if (!formData.mainCategoryId || !formData.subCategoryId) {
      setError("Please select both a Main Category and a Sub Category.");
      setLoading(false);
      return;
    }

    try {
      // 1. Upload Media Files sequentially
      const uploadedMedia = [];
      for (const media of mediaFiles) {
        const uploadData = new FormData();
        uploadData.append("file", media.file);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: uploadData,
        });

        if (!uploadRes.ok) {
          throw new Error("Failed to upload a media file.");
        }

        const { url } = await uploadRes.json();
        uploadedMedia.push({ url, type: media.type });
      }

      // 2. Save Product
      const productToSave = {
        title: formData.title,
        description: formData.description,
        dimensions: formData.dimensions,
        size: formData.size,
        material: formData.material,
        finish: formData.finish,
        placement: formData.placement,
        theme: formData.theme,
        pose: formData.pose,
        customizable: formData.customizable,
        weatherResistant: formData.weatherResistant,
        inventory: parseInt(formData.inventory),
        categoryId: formData.subCategoryId, // The actual specific category
        mainCategoryId: formData.mainCategoryId, // Stored for easier querying
        price: parseFloat(formData.price),
        imageUrl: uploadedMedia.length > 0 ? uploadedMedia[0].url : "", // Fallback
        media: uploadedMedia,
        isTrending: formData.isTrending,
      };

      const { error: dbError } = await addProduct(productToSave);

      if (dbError) {
        setError(dbError);
      } else {
        setSuccess(true);
        // Reset form to defaults
        const defaultMainId = mainCategories.length > 0 ? mainCategories[0].id : "";
        const defaultSubs = categories.filter(c => c.parentId === defaultMainId);
        
        setFormData({
          title: "",
          price: "",
          mainCategoryId: defaultMainId,
          subCategoryId: defaultSubs.length > 0 ? defaultSubs[0].id : "",
          description: "",
          dimensions: "",
          size: "",
          material: "",
          inventory: "",
          finish: "",
          placement: "",
          theme: "",
          pose: "",
          customizable: "No",
          weatherResistant: "No",
          isTrending: false
        });
        setMediaFiles([]);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newMedia = files.map(file => {
        const isVideo = file.type.startsWith('video/');
        return {
          file,
          previewUrl: URL.createObjectURL(file),
          type: isVideo ? 'video' : 'image'
        };
      });
      setMediaFiles(prev => [...prev, ...newMedia]);
    }
    e.target.value = null; // allow selecting the same file again
  };

  const removeMedia = (index) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
  };

  const moveMediaLeft = (index) => {
    if (index === 0) return;
    setMediaFiles(prev => {
      const arr = [...prev];
      const temp = arr[index - 1];
      arr[index - 1] = arr[index];
      arr[index] = temp;
      return arr;
    });
  };

  const moveMediaRight = (index) => {
    if (index === mediaFiles.length - 1) return;
    setMediaFiles(prev => {
      const arr = [...prev];
      const temp = arr[index + 1];
      arr[index + 1] = arr[index];
      arr[index] = temp;
      return arr;
    });
  };

  return (
    <div className="max-w-4xl">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-200">
        <h2 className="text-2xl font-serif font-bold text-stone-900 mb-6 border-b border-stone-100 pb-4">
          Add New Product
        </h2>
        
        {success && (
          <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-xl flex items-center gap-3 border border-green-100">
            <CheckCircle2 size={20} />
            <span>Product uploaded successfully!</span>
          </div>
        )}
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-stone-700">Product Title *</label>
            <input 
              type="text" 
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. 2ft Makrana White Ganesha"
              className="w-full bg-stone-50 border border-stone-200 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:border-amber-500" 
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-stone-700">Price (₹) *</label>
              <input 
                type="number" 
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="e.g. 45000"
                className="w-full bg-stone-50 border border-stone-200 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:border-amber-500" 
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-stone-700">Inventory / Stock *</label>
              <input 
                type="number" 
                name="inventory"
                value={formData.inventory}
                onChange={handleChange}
                placeholder="e.g. 10"
                className="w-full bg-stone-50 border border-stone-200 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:border-amber-500" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700">Main Category *</label>
                {loadingCategories ? (
                  <div className="w-full bg-stone-50 border border-stone-200 rounded-xl py-3 px-4 text-stone-400 text-sm flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" /> Loading...
                  </div>
                ) : mainCategories.length === 0 ? (
                  <div className="w-full bg-red-50 border border-red-200 rounded-xl py-3 px-4 text-red-500 text-sm">
                    No main categories!
                  </div>
                ) : (
                  <select 
                    name="mainCategoryId"
                    value={formData.mainCategoryId}
                    onChange={handleChange}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:border-amber-500 appearance-none"
                  >
                    {mainCategories.map(mainCat => (
                      <option key={mainCat.id} value={mainCat.id}>{mainCat.title}</option>
                    ))}
                  </select>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700">Sub Category *</label>
                {loadingCategories ? (
                  <div className="w-full bg-stone-50 border border-stone-200 rounded-xl py-3 px-4 text-stone-400 text-sm flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" /> Loading...
                  </div>
                ) : (
                  <select 
                    name="subCategoryId"
                    value={formData.subCategoryId}
                    onChange={handleChange}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:border-amber-500 appearance-none"
                    disabled={!formData.mainCategoryId}
                  >
                    {categories.filter(c => c.parentId === formData.mainCategoryId).length === 0 ? (
                      <option value="">No sub categories found</option>
                    ) : (
                      categories
                        .filter(c => c.parentId === formData.mainCategoryId)
                        .map(subCat => (
                          <option key={subCat.id} value={subCat.id}>{subCat.title}</option>
                        ))
                    )}
                  </select>
                )}
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700">Size / Height</label>
                <select 
                  name="size"
                  value={formData.size}
                  onChange={handleChange}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:border-amber-500 appearance-none"
                >
                  <option value="">Select Size</option>
                  {globalAttributes.sizes?.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700">Material</label>
                <select 
                  name="material"
                  value={formData.material}
                  onChange={handleChange}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:border-amber-500 appearance-none"
                >
                  <option value="">Select Material</option>
                  {globalAttributes.materials?.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6 space-y-6">
            <h3 className="text-lg font-bold text-stone-900 border-b border-stone-200 pb-3">
              Advanced Filters (Vedstone Architecture)
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700">Finish</label>
                <select 
                  name="finish"
                  value={formData.finish}
                  onChange={handleChange}
                  className="w-full bg-white border border-stone-200 rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:border-amber-500 text-sm appearance-none"
                >
                  <option value="">Select Finish</option>
                  {globalAttributes.finishes?.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700">Placement / Use</label>
                <select 
                  name="placement"
                  value={formData.placement}
                  onChange={handleChange}
                  className="w-full bg-white border border-stone-200 rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:border-amber-500 text-sm appearance-none"
                >
                  <option value="">Select Placement</option>
                  {globalAttributes.placements?.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700">Theme</label>
                <select 
                  name="theme"
                  value={formData.theme}
                  onChange={handleChange}
                  className="w-full bg-white border border-stone-200 rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:border-amber-500 text-sm appearance-none"
                >
                  <option value="">Select Theme</option>
                  {globalAttributes.themes?.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700">Pose</label>
                <select 
                  name="pose"
                  value={formData.pose}
                  onChange={handleChange}
                  className="w-full bg-white border border-stone-200 rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:border-amber-500 text-sm appearance-none"
                >
                  <option value="">Select Pose</option>
                  {globalAttributes.poses?.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700">Customizable</label>
                <select
                  name="customizable"
                  value={formData.customizable}
                  onChange={handleChange}
                  className="w-full bg-white border border-stone-200 rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:border-amber-500 text-sm appearance-none"
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700">Weather Resistant</label>
                <select
                  name="weatherResistant"
                  value={formData.weatherResistant}
                  onChange={handleChange}
                  className="w-full bg-white border border-stone-200 rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:border-amber-500 text-sm appearance-none"
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>
            </div>
          </div>

            <div className="space-y-4">
              <label className="text-sm font-medium text-stone-700">Product Media (Images & Videos) *</label>
              
              <div className="flex flex-wrap gap-4">
                {mediaFiles.map((media, index) => (
                  <div key={index} className="relative w-32 h-32 bg-stone-100 rounded-2xl border border-stone-200 overflow-hidden group shadow-sm shrink-0">
                    {media.type === 'image' ? (
                      <Image src={media.previewUrl} alt={`Preview ${index}`} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-stone-200">
                        <Video className="text-stone-400 w-8 h-8" />
                        <video src={media.previewUrl} className="absolute inset-0 w-full h-full object-cover opacity-50" muted />
                      </div>
                    )}
                    
                    {/* Controls Overlay */}
                    <div className="absolute inset-0 bg-stone-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                      <div className="flex justify-end">
                        <button 
                          type="button" 
                          onClick={() => removeMedia(index)} 
                          className="bg-white/90 text-red-500 rounded-full p-1.5 hover:bg-red-50 hover:scale-110 transition-all"
                        >
                          <X size={14} />
                        </button>
                      </div>
                      <div className="flex justify-between">
                        <button 
                          type="button" 
                          onClick={() => moveMediaLeft(index)} 
                          disabled={index === 0}
                          className="bg-white/90 text-stone-700 rounded-full p-1.5 hover:bg-stone-50 disabled:opacity-30 transition-all"
                        >
                          <ArrowLeft size={14} />
                        </button>
                        <button 
                          type="button" 
                          onClick={() => moveMediaRight(index)} 
                          disabled={index === mediaFiles.length - 1}
                          className="bg-white/90 text-stone-700 rounded-full p-1.5 hover:bg-stone-50 disabled:opacity-30 transition-all"
                        >
                          <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                
                <label className="w-32 h-32 bg-amber-50/50 rounded-2xl border-2 border-dashed border-amber-200 flex flex-col items-center justify-center overflow-hidden shrink-0 cursor-pointer hover:bg-amber-50 hover:border-amber-400 transition-colors">
                  <Upload className="text-amber-500 w-8 h-8 mb-2" />
                  <span className="text-xs font-medium text-amber-700 text-center px-2">Upload Files</span>
                  <input 
                    type="file" 
                    accept="image/*,video/*"
                    multiple
                    onChange={handleMediaChange}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="text-xs text-stone-500">
                You can upload multiple images and videos. The first item will be the main thumbnail. 
                Use the arrows on hover to reorder them, or the X to remove an item.
              </p>
            </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-medium text-stone-700">Description</label>
              <textarea 
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder="Detailed description of the carving, heritage, etc."
                className="w-full bg-stone-50 border border-stone-200 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:border-amber-500 resize-none"
              ></textarea>
            </div>
          </div>

          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6">
            <label className="flex items-start gap-4 cursor-pointer group">
              <div className="relative flex items-center h-5">
                <input
                  type="checkbox"
                  name="isTrending"
                  checked={formData.isTrending}
                  onChange={handleChange}
                  className="w-5 h-5 bg-white border border-stone-300 rounded text-amber-600 focus:ring-amber-500 transition-colors"
                />
              </div>
              <div>
                <span className="text-sm font-bold text-stone-900 group-hover:text-amber-600 transition-colors block mb-1">
                  Show in "Trending Now" Section?
                </span>
                <span className="text-xs text-stone-500 leading-relaxed block">
                  Agar aap ise check karte hain, to ye product home page par Trending Now section me highlight hokar dikhega. Uncheck rakhne par ye bas normal shop aur categories me jayega.
                </span>
              </div>
            </label>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-stone-900 hover:bg-amber-600 text-white rounded-xl py-4 flex items-center justify-center gap-2 font-medium transition-colors shadow-lg shadow-stone-900/10 disabled:opacity-70 mt-6"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Upload size={18} />
                Publish Product
              </>
            )}
          </button>

        </form>
      </div>
    </div>
  );
}
