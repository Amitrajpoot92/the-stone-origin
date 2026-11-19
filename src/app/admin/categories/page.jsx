"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { addCategory, getAllCategories } from "@/lib/product-helpers";
import { Loader2, Plus, CheckCircle2, Image as ImageIcon } from "lucide-react";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    type: "main",
    parentId: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const mainCategories = categories.filter(c => c.type === "main" || !c.type);

  const fetchCategories = async () => {
    setLoading(true);
    const { categories, error } = await getAllCategories();
    if (!error) {
      setCategories(categories);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    if (!formData.title) {
      setError("Category Title is required.");
      setIsSubmitting(false);
      return;
    }

    if (formData.type === "sub" && !imageFile) {
      setError("An Image File is required for Sub Categories.");
      setIsSubmitting(false);
      return;
    }
    
    if (formData.type === "sub" && !formData.parentId) {
      setError("Please select a Parent Category for this Sub Category.");
      setIsSubmitting(false);
      return;
    }

    try {
      let url = "";

      // 1. Upload Image (only if an image file was selected)
      if (imageFile) {
        const uploadData = new FormData();
        uploadData.append("file", imageFile);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: uploadData,
        });

        if (!uploadRes.ok) {
          throw new Error("Failed to upload image.");
        }

        const resData = await uploadRes.json();
        url = resData.url;
      }

      // 2. Save Category
      // Auto-generate slug from title for the database ID
      const slugId = formData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
      
      const categoryDataToSave = { ...formData, id: slugId, image: url };
      if (categoryDataToSave.type === "main") {
        delete categoryDataToSave.parentId;
      }

      const { error: dbError } = await addCategory(categoryDataToSave);

      if (dbError) {
        setError(dbError);
      } else {
        setSuccess(true);
        setFormData({ title: "", type: "main", parentId: "" });
        setImageFile(null);
        setImagePreview(null);
        fetchCategories(); // Refresh list
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      setError(err.message);
    }

    setIsSubmitting(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* Left Column: Form */}
      <div className="lg:col-span-1">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 sticky top-24">
          <h2 className="text-xl font-serif font-bold text-stone-900 mb-6 border-b border-stone-100 pb-4">
            Create Category
          </h2>
          
          {success && (
            <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-xl flex items-center gap-3 border border-green-100 text-sm">
              <CheckCircle2 size={16} />
              <span>Category added!</span>
            </div>
          )}
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            
            <div className="flex items-center gap-4 p-3 bg-stone-50 rounded-xl border border-stone-200">
              <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-stone-700">
                <input 
                  type="radio" 
                  name="type" 
                  value="main" 
                  checked={formData.type === "main"}
                  onChange={handleChange}
                  className="accent-amber-600"
                />
                Main Category
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-stone-700">
                <input 
                  type="radio" 
                  name="type" 
                  value="sub" 
                  checked={formData.type === "sub"}
                  onChange={handleChange}
                  className="accent-amber-600"
                />
                Sub Category
              </label>
            </div>

            {formData.type === "sub" && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700">Parent Category *</label>
                <select
                  name="parentId"
                  value={formData.parentId}
                  onChange={handleChange}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl py-2.5 px-4 focus:outline-none focus:ring-2 focus:border-amber-500 appearance-none"
                >
                  <option value="">Select Parent Category</option>
                  {mainCategories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.title}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-stone-700">Category Title</label>
              <input 
                type="text" 
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Makrana Marble"
                className="w-full bg-stone-50 border border-stone-200 rounded-xl py-2.5 px-4 focus:outline-none focus:ring-2 focus:border-amber-500" 
              />
            </div>

            {formData.type === "sub" && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700">Category Image</label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-stone-100 rounded-xl border border-stone-200 flex items-center justify-center overflow-hidden relative shrink-0">
                    {imagePreview ? (
                      <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                    ) : (
                      <ImageIcon className="text-stone-300 w-6 h-6" />
                    )}
                  </div>
                  <div className="flex-1">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full text-sm text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100 transition-colors"
                    />
                  </div>
                </div>
              </div>
            )}

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-stone-900 hover:bg-amber-600 text-white rounded-xl py-3 flex items-center justify-center gap-2 font-medium transition-colors shadow-lg shadow-stone-900/10 disabled:opacity-70 mt-2"
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Plus size={18} /> Add Category</>}
            </button>
          </form>
        </div>
      </div>

      {/* Right Column: List */}
      <div className="lg:col-span-2">
        <h2 className="text-2xl font-serif font-bold text-stone-900 mb-6">Existing Categories</h2>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
          </div>
        ) : categories.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-stone-200 text-center text-stone-500">
            No categories found. Create one to get started!
          </div>
        ) : (
          <div className="space-y-6">
            {mainCategories.map((mainCat) => {
              const subCats = categories.filter(c => c.parentId === mainCat.id);
              
              return (
                <div key={mainCat.id} className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
                  {/* Main Category Header */}
                  <div className="flex items-center gap-4 p-4 border-b border-stone-100 bg-stone-50">
                    <div className="w-16 h-16 relative shrink-0 bg-stone-200 rounded-lg overflow-hidden">
                      {mainCat.image ? (
                        <Image src={mainCat.image} alt={mainCat.title} fill className="object-cover" />
                      ) : (
                        <ImageIcon className="text-stone-400 w-6 h-6 m-auto absolute inset-0" />
                      )}
                    </div>
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full mb-1 inline-block">Main</span>
                      <h3 className="font-bold text-stone-900 text-lg leading-tight">{mainCat.title}</h3>
                    </div>
                  </div>
                  
                  {/* Sub Categories List */}
                  {subCats.length > 0 && (
                    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {subCats.map(subCat => (
                        <div key={subCat.id} className="flex items-center gap-3 p-3 border border-stone-100 rounded-xl">
                          <div className="w-12 h-12 relative shrink-0 bg-stone-100 rounded-lg overflow-hidden">
                            {subCat.image && <Image src={subCat.image} alt={subCat.title} fill className="object-cover" />}
                          </div>
                          <div>
                            <h4 className="font-semibold text-stone-800 text-sm">{subCat.title}</h4>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {subCats.length === 0 && (
                    <div className="p-4 text-sm text-stone-400 italic text-center">
                      No sub-categories yet.
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
