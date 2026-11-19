"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { getProductById, updateProduct, getAllCategories, getGlobalAttributes } from "@/lib/product-helpers";
import { Upload, Loader2, CheckCircle2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
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
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null); // Will hold the existing Image URL initially

  const [categories, setCategories] = useState([]);
  const [mainCategories, setMainCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const [globalAttributes, setGlobalAttributes] = useState({
    sizes: [], materials: [], finishes: [], themes: [], poses: [], placements: []
  });

  // 1. Fetch Categories and Product Data
  useEffect(() => {
    const fetchData = async () => {
      // Fetch categories
      const { categories: cats, error: catsError } = await getAllCategories();
      let fetchedCategories = [];
      let fetchedMainCategories = [];

      if (!catsError && cats.length > 0) {
        fetchedCategories = cats;
        setCategories(cats);
        fetchedMainCategories = cats.filter(c => c.type === "main" || !c.type);
        setMainCategories(fetchedMainCategories);
      }
      setLoadingCategories(false);

      // Fetch product details
      const { product, error: productError } = await getProductById(id);
      
      if (productError) {
        setError("Failed to load product details.");
      } else if (product) {
        setFormData({
          title: product.title || "",
          price: product.price || "",
          mainCategoryId: product.mainCategoryId || "",
          subCategoryId: product.categoryId || "", // The specific category ID is the subcategory
          description: product.description || "",
          dimensions: product.dimensions || "",
          size: product.size || "",
          material: product.material || "",
          inventory: product.inventory || "",
          finish: product.finish || "",
          placement: product.placement || "",
          theme: product.theme || "",
          pose: product.pose || "",
          customizable: product.customizable || "No",
          weatherResistant: product.weatherResistant || "No",
          isTrending: product.isTrending || false
        });
        setImagePreview(product.imageUrl); // Show existing image
      }
      
      const { attributes, error: attrError } = await getGlobalAttributes();
      if (!attrError && attributes) {
        setGlobalAttributes(prev => ({ ...prev, ...attributes }));
      }
      
      setInitialLoading(false);
    };
    
    fetchData();
  }, [id]);

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
    if (!formData.title || !formData.price) {
      setError("Title and Price are required.");
      setLoading(false);
      return;
    }
    
    if (!formData.mainCategoryId || !formData.subCategoryId) {
      setError("Please select both a Main Category and a Sub Category.");
      setLoading(false);
      return;
    }

    try {
      let finalImageUrl = imagePreview; // Default to existing image URL

      // 1. Upload NEW Image if selected
      if (imageFile) {
        const uploadData = new FormData();
        uploadData.append("file", imageFile);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: uploadData,
        });

        if (!uploadRes.ok) {
          throw new Error("Failed to upload new image.");
        }

        const { url } = await uploadRes.json();
        finalImageUrl = url;
      }

      // 2. Save Updated Product
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
        imageUrl: finalImageUrl,
        isTrending: formData.isTrending,
      };

      const { error: dbError } = await updateProduct(id, productToSave);

      if (dbError) {
        setError(dbError);
      } else {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          router.push("/admin/inventory"); // Redirect back to inventory after success
        }, 1500);
      }
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-6 flex items-center gap-4">
        <Link href="/admin/inventory" className="p-2 bg-white text-stone-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors border border-stone-200">
          <ArrowLeft size={20} />
        </Link>
        <h2 className="text-2xl font-serif font-bold text-stone-900">
          Edit Product
        </h2>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-200">
        
        {success && (
          <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-xl flex items-center gap-3 border border-green-100">
            <CheckCircle2 size={20} />
            <span>Product updated successfully! Returning to inventory...</span>
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
                    <option value="">Select Main Category</option>
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
          </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-stone-700">Product Image (Optional to update)</label>
              <div className="flex items-center gap-6">
                <div className="w-32 h-32 bg-stone-100 rounded-2xl border border-stone-200 flex items-center justify-center overflow-hidden relative shrink-0">
                  {imagePreview ? (
                    <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                  ) : (
                    <Upload className="text-stone-300 w-8 h-8" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-xs text-stone-500 mb-2">Upload a new image only if you want to replace the existing one.</p>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full text-sm text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100 transition-colors"
                  />
                </div>
              </div>
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
            <div className="space-y-2">
              <label className="text-sm font-medium text-stone-700">Size / Height Filter</label>
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
              <label className="text-sm font-medium text-stone-700">Material Filter</label>
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
                Update Product
              </>
            )}
          </button>

        </form>
      </div>
    </div>
  );
}
