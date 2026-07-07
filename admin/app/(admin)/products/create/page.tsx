'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

interface Category {
  _id: string;
  name: string;
}

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function CreateProductPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: '',
    ingredients: '',
    full_description: '',
    price: '',
    category: '',
    stock: '0',
    isPopular: false,
    isSpicy: false,
    spiceLevelEnabled: false,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);

  // Load categories from API
  useEffect(() => {
    fetch(`${API}/api/categories`)
      .then((r) => r.json())
      .then((data) => { if (data.success) setCategories(data.data); })
      .catch(console.error);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleToggle = (field: 'isPopular' | 'isSpicy' | 'spiceLevelEnabled') => {
    setForm((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const remaining = 5 - galleryFiles.length;
    const selected = files.slice(0, remaining);
    setGalleryFiles((prev) => [...prev, ...selected]);
    setGalleryPreviews((prev) => [...prev, ...selected.map((f) => URL.createObjectURL(f))]);
  };

  const removeGalleryImage = (index: number) => {
    setGalleryFiles((prev) => prev.filter((_, i) => i !== index));
    setGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.name || !form.price || !form.category) {
      setError('Please fill in all required fields.');
      return;
    }
    if (!imageFile) {
      setError('Please upload a product image.');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('ingredients', form.ingredients);
      formData.append('full_description', form.full_description);
      formData.append('price', form.price);
      formData.append('category', form.category);
      formData.append('isPopular', String(form.isPopular));
      formData.append('isSpicy', String(form.isSpicy));
      formData.append('stock', form.stock);
      formData.append('spiceLevelEnabled', String(form.spiceLevelEnabled));
      formData.append('image', imageFile);
      galleryFiles.forEach((file) => {
        formData.append('gallery', file);
      });

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to create product');
      }

      router.push('/products');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/products"
          className="p-2 rounded-lg text-gray-500 hover:bg-gray-200 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
          <p className="text-sm text-gray-500 mt-0.5">Create a new dish for your digital menu</p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Left Column (Basic Info + Pricing) ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Basic Information */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
              <div className="flex items-center gap-2 pb-1 border-b border-gray-100">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Basic Information</h2>
              </div>

              {/* Product Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Classic Chicken Shawarma"
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-gray-400"
                />
              </div>

              {/* Ingredients */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Ingredients (comma separated)
                </label>
                <input
                  type="text"
                  name="ingredients"
                  value={form.ingredients}
                  onChange={handleChange}
                  placeholder="Chicken, Basmati Rice, Ginger-Garlic, Spices"
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-gray-400"
                />
              </div>

              {/* Full Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Full Description
                </label>
                <textarea
                  name="full_description"
                  value={form.full_description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Describe the dish, its preparation, and taste..."
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-gray-400 resize-none"
                />
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
              <div className="flex items-center gap-2 pb-1 border-b border-gray-100">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Pricing</h2>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Price (AED) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-400">AED</span>
                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className="w-full pl-14 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-gray-400"
                  />
                </div>
              </div>
            </div>

            {/* Initial Stock Level */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
              <div className="flex items-center gap-2 pb-1 border-b border-gray-100">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock</h2>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Initial Stock Level</label>
                <div className="relative">
                  <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <input
                    type="number"
                    name="stock"
                    value={form.stock}
                    onChange={handleChange}
                    min="0"
                    placeholder="0"
                    className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-gray-400"
                  />
                </div>
              </div>
            </div>

            {/* Spice Level Configuration */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
              <div className="flex items-center gap-2 pb-1 border-b border-gray-100">
                <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                </svg>
                <div>
                  <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Spice Level Configuration</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Enable spice level selection for this product</p>
                </div>
              </div>
              <div
                onClick={() => handleToggle('spiceLevelEnabled')}
                className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                  form.spiceLevelEnabled ? 'bg-orange-50 border-orange-200' : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <svg className={`w-4 h-4 ${form.spiceLevelEnabled ? 'text-orange-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                  </svg>
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {form.spiceLevelEnabled ? 'Spice Level Enabled' : 'Spice Level Disabled'}
                  </span>
                </div>
                <div className={`w-11 h-6 rounded-full relative transition-colors ${form.spiceLevelEnabled ? 'bg-orange-500' : 'bg-gray-300'}`}>
                  <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all shadow-sm ${form.spiceLevelEnabled ? 'left-5' : 'left-0.5'}`} />
                </div>
              </div>
            </div>

          </div>

          {/* ── Right Column (Settings + Image) ── */}
          <div className="space-y-6">

            {/* Settings */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
              <div className="flex items-center gap-2 pb-1 border-b border-gray-100">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Settings</h2>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-700"
                >
                  <option value="">Select category</option>
                  {categories.length === 0 ? (
                    <option value="" disabled>No categories — add in Categories page</option>
                  ) : (
                    categories.map((cat) => (
                      <option key={cat._id} value={cat.name.toLowerCase().replace(/\s+/g, '_')}>
                        {cat.name}
                      </option>
                    ))
                  )}
                </select>
              </div>

              {/* Is Popular Toggle */}
              <div
                onClick={() => handleToggle('isPopular')}
                className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                  form.isPopular ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">⭐</span>
                  <span className="text-sm font-medium text-gray-700">Popular Item</span>
                </div>
                <div className={`w-11 h-6 rounded-full relative transition-colors ${form.isPopular ? 'bg-green-500' : 'bg-gray-300'}`}>
                  <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all shadow-sm ${form.isPopular ? 'left-5' : 'left-0.5'}`} />
                </div>
              </div>

              {/* Is Spicy Toggle */}
              <div
                onClick={() => handleToggle('isSpicy')}
                className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                  form.isSpicy ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">🌶️</span>
                  <span className="text-sm font-medium text-gray-700">Spicy Item</span>
                </div>
                <div className={`w-11 h-6 rounded-full relative transition-colors ${form.isSpicy ? 'bg-red-500' : 'bg-gray-300'}`}>
                  <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all shadow-sm ${form.isSpicy ? 'left-5' : 'left-0.5'}`} />
                </div>
              </div>
            </div>

            {/* Media / Image Upload */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
              <div className="flex items-center gap-2 pb-1 border-b border-gray-100">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Media Assets</h2>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Thumbnail <span className="text-red-500">*</span>
                </p>

                {imagePreview ? (
                  <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-gray-200">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => { setImagePreview(null); setImageFile(null); }}
                      className="absolute top-2 right-2 w-7 h-7 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center shadow"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full border-2 border-dashed border-gray-200 hover:border-green-400 rounded-lg p-8 flex flex-col items-center gap-2 text-gray-400 hover:text-green-600 transition-colors"
                  >
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    <span className="text-sm font-medium">Click to upload</span>
                    <span className="text-xs">JPG, PNG, WEBP</span>
                  </button>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>

              {/* Gallery Images */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Gallery Photos <span className="text-gray-400 text-xs">(up to 5)</span>
                </p>

                {/* Gallery Previews */}
                {galleryPreviews.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    {galleryPreviews.map((src, idx) => (
                      <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200">
                        <Image src={src} alt={`gallery-${idx}`} fill className="object-cover" />
                        <button
                          type="button"
                          onClick={() => removeGalleryImage(idx)}
                          className="absolute top-1 right-1 w-5 h-5 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center shadow text-xs"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {galleryFiles.length < 5 && (
                  <button
                    type="button"
                    onClick={() => galleryInputRef.current?.click()}
                    className="w-full border-2 border-dashed border-gray-200 hover:border-green-400 rounded-lg p-4 flex flex-col items-center gap-1 text-gray-400 hover:text-green-600 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    <span className="text-xs font-medium">Add gallery photos</span>
                    <span className="text-xs">{5 - galleryFiles.length} remaining</span>
                  </button>
                )}

                <input
                  ref={galleryInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  onChange={handleGalleryChange}
                  className="hidden"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Creating...
                </>
              ) : (
                'Create Product Now'
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
