"use client";

import React, { useState, useEffect } from "react";
import { getGlobalAttributes, updateGlobalAttributes } from "@/lib/product-helpers";
import { Loader2, Plus, Trash2, Save, CheckCircle2 } from "lucide-react";

export default function ManageAttributesPage() {
  const [attributes, setAttributes] = useState({
    sizes: [],
    materials: [],
    finishes: [],
    themes: [],
    poses: [],
    placements: []
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const [newValues, setNewValues] = useState({
    sizes: "", materials: "", finishes: "", themes: "", poses: "", placements: ""
  });

  useEffect(() => {
    const fetchAttributes = async () => {
      const { attributes: fetchedData, error } = await getGlobalAttributes();
      if (!error && fetchedData) {
        // Ensure all arrays exist even if DB is empty
        setAttributes({
          sizes: fetchedData.sizes || [],
          materials: fetchedData.materials || [],
          finishes: fetchedData.finishes || [],
          themes: fetchedData.themes || [],
          poses: fetchedData.poses || [],
          placements: fetchedData.placements || []
        });
      }
      setLoading(false);
    };
    fetchAttributes();
  }, []);

  const handleAddValue = (key) => {
    const val = newValues[key].trim();
    if (!val) return;
    
    // Prevent duplicates
    if (!attributes[key].includes(val)) {
      setAttributes(prev => ({
        ...prev,
        [key]: [...prev[key], val]
      }));
    }
    
    // Clear input
    setNewValues(prev => ({ ...prev, [key]: "" }));
  };

  const handleRemoveValue = (key, valueToRemove) => {
    setAttributes(prev => ({
      ...prev,
      [key]: prev[key].filter(v => v !== valueToRemove)
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);

    const { error: saveError } = await updateGlobalAttributes(attributes);
    
    if (saveError) {
      setError(saveError);
    } else {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
    setSaving(false);
  };

  const attributeSections = [
    { key: "sizes", title: "Sizes & Heights", placeholder: "e.g. 1 Feet, Life Size" },
    { key: "materials", title: "Materials", placeholder: "e.g. Makrana Marble, Brass" },
    { key: "finishes", title: "Finishes", placeholder: "e.g. Polished, Antique" },
    { key: "placements", title: "Placements / Uses", placeholder: "e.g. Home, Temple, Garden" },
    { key: "themes", title: "Themes", placeholder: "e.g. Traditional, Abstract" },
    { key: "poses", title: "Poses", placeholder: "e.g. Sitting, Standing" },
  ];

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="w-10 h-10 animate-spin text-amber-600" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-serif font-bold text-stone-900">Manage Filters & Attributes</h2>
          <p className="text-stone-500 text-sm mt-1">Pre-define the options that will appear when adding products.</p>
        </div>
        
        <button 
          onClick={handleSave}
          disabled={saving}
          className="bg-amber-600 hover:bg-stone-900 text-white rounded-xl py-3 px-6 flex items-center justify-center gap-2 font-medium transition-colors shadow-lg shadow-amber-600/20 disabled:opacity-70"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save size={18} />}
          Save Changes
        </button>
      </div>

      {success && (
        <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-xl flex items-center gap-3 border border-green-100">
          <CheckCircle2 size={20} />
          <span>Attributes saved successfully! They will now appear in the Add Product form.</span>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {attributeSections.map(({ key, title, placeholder }) => (
          <div key={key} className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col">
            <h3 className="text-lg font-bold text-stone-900 mb-4">{title}</h3>
            
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newValues[key]}
                onChange={(e) => setNewValues(prev => ({ ...prev, [key]: e.target.value }))}
                onKeyDown={(e) => e.key === 'Enter' && handleAddValue(key)}
                placeholder={placeholder}
                className="flex-1 px-4 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all text-sm"
              />
              <button
                onClick={() => handleAddValue(key)}
                className="bg-stone-900 text-white p-2 rounded-xl hover:bg-amber-600 transition-colors"
                type="button"
              >
                <Plus size={20} />
              </button>
            </div>

            <div className="flex-1 bg-stone-50 rounded-xl p-4 border border-stone-100 overflow-y-auto max-h-48">
              {attributes[key].length === 0 ? (
                <p className="text-sm text-stone-400 text-center italic mt-4">No options added yet.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {attributes[key].map(val => (
                    <div key={val} className="flex items-center gap-2 bg-white border border-stone-200 px-3 py-1.5 rounded-lg text-sm text-stone-700 shadow-sm">
                      {val}
                      <button 
                        onClick={() => handleRemoveValue(key, val)}
                        className="text-stone-400 hover:text-red-500 transition-colors"
                        type="button"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
