'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface Category {
  _id: string;
  name: string;
}

interface ProductForm {
  name: string;
  ingredients: string;
  full_description: string;
  price: string;
  category: string;
  stock: string;
  isPopular: boolean;
  isSpicy: boolean;
  isActive: boolean;
  spiceLevelEnabled: boolean;
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<ProductForm>({
    name: '',
    ingredients: '',
    full_description: '',
    price: '',
    category: '',
    stock: '0',
    isPopular: false,
    isSpicy: false,
    isActive: true,
    spiceLevelEnabled: false,
  });

  // Current saved images
  const [currentImage, setCurrentImage] = useState('');
  const [currentGallery, setCurrentGallery] = useState<string[]>([]);

  // New image files (replace)
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // New gallery files (append)
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Load product + categories
  const fetchData = useCallback(async () => {
    try {
      const [productRes, catRes] = await Promise.all([
        fetch(`${API}/api/products/${productId}`),
        fetch(`${API}/api/categories`),
      ]);
      const productData = await productRes.json();
      const catData = await catRes.json();

      if (productData.success) {
        const p = productData.data;
        setForm({
          name: p.name || '',
          ingredients: p.ingredients || '',
          full_description: p.description || '',
          price: String(p.price || ''),
          category: p.category || '',
          stock: String(p.stock ?? 0),
          isPopular: p.isPopular || false,
          isSpicy: p.isSpicy || false,
          isActive: p.isActive !== false,
          spiceLevelEnabled: p.spiceLevelEnabled || false,
        });
        setCurrentImage(p.image || '');
        setCurrentGallery(p.gallery || []);
      }

      if (catData.success) setCategories(catData.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load product');
    } finally {
      setFetching(false);
    }
  }, [productId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleToggle = (field: keyof Pick<ProductForm, 'isPopular' | 'isSpicy' | 'isActive' | 'spiceLevelEnabled'>) => {
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

  const removeNewGallery = (index: number) => {
    setGalleryFiles((prev) => prev.filter((_, i) => i !== index));
    setGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.name || !form.price || !form.category) {
      setError('Name, price, and category are required.');
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
      formData.append('stock', form.stock);
      formData.append('isPopular', String(form.isPopular));
      formData.append('isSpicy', String(form.isSpicy));
      formData.append('isActive', String(form.isActive));
      formData.append('spiceLevelEnabled', String(form.spiceLevelEnabled));

      // New thumbnail (optional)
      if (imageFile) formData.append('image', imageFile);

      // New gallery images (optional)
      galleryFiles.forEach((file) => formData.append('gallery', file));

      const res = await fetch(`${API}/api/products/${productId}`, {
        method: 'PUT',
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to update product');
      }

      setSuccess(true);
      setTimeout(() => router.push('/products'), 1200);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-32">
        <svg className="w-8 h-8 text-gray-300 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">

      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/products" className="p-2 rounded-lg text-gray-500 hover:bg-gray-200 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
          <p className="text-sm text-gray-500 mt-0.5">Update details for <span className="font-semibold text-gray-700">{form.name}</span></p>
        </div>
      </div>

      {/* Success */}
      {success && (
        <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700">
          <svg className="w-5 h-5 flex-shrink-0 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Product updated successfully! Redirecting...
        </div>
      )}

      {/* Error */}
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

          {/* ── Left: Main fields ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Basic Info */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100 pb-2">Basic Information</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Product Name *</label>
                <input type="text" name="name" value={form.name} onChange={handleChange}
                  placeholder="e.g. Classic Chicken Shawarma"
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-gray-400" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Ingredients</label>
                <input type="text" name="ingredients" value={form.ingredients} onChange={handleChange}
                  placeholder="Chicken, Rice, Spices..."
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-gray-400" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                <textarea name="full_description" value={form.full_description} onChange={handleChange}
                  rows={4} placeholder="Describe the dish..."
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-gray-400 resize-none" />
              </div>
            </div>

            {/* Pricing + Stock */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100 pb-2">Pricing & Stock</h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Price (AED) *</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-400">AED</span>
                    <input type="number" name="price" value={form.price} onChange={handleChange}
                      placeholder="0.00" min="0" step="0.01"
                      className="w-full pl-14 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-gray-400" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Stock</label>
                  <input type="number" name="stock" value={form.stock} onChange={handleChange}
                    min="0" placeholder="0"
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-gray-400" />
                </div>
              </div>
            </div>

          </div>

          {/* ── Right: Settings + Image ── */}
          <div className="space-y-6">

            {/* Settings */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100 pb-2">Settings</h2>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Category *</label>
                <select name="category" value={form.category} onChange={handleChange}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-700">
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat.name.toLowerCase().replace(/\s+/g, '_')}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Toggles */}
              {([
                { key: 'isActive', label: 'Active (visible on menu)', emoji: '✅' },
                { key: 'isPopular', label: 'Popular Item', emoji: '⭐' },
                { key: 'isSpicy', label: 'Spicy Item', emoji: '🌶️' },
                { key: 'spiceLevelEnabled', label: 'Spice Level Selector', emoji: '🔥' },
              ] as { key: keyof Pick<ProductForm, 'isPopular' | 'isSpicy' | 'isActive' | 'spiceLevelEnabled'>; label: string; emoji: string }[]).map(({ key, label, emoji }) => (
                <div key={key}
                  onClick={() => handleToggle(key)}
                  className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                    form[key] ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                  }`}>
                  <div className="flex items-center gap-2">
                    <span>{emoji}</span>
                    <span className="text-sm font-medium text-gray-700">{label}</span>
                  </div>
                  <div className={`w-11 h-6 rounded-full relative transition-colors ${form[key] ? 'bg-green-500' : 'bg-gray-300'}`}>
                    <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all shadow-sm ${form[key] ? 'left-5' : 'left-0.5'}`} />
                  </div>
                </div>
              ))}
            </div>

            {/* Thumbnail */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100 pb-2">Thumbnail</h2>

              {imagePreview ? (
                <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-gray-200">
                  <Image src={imagePreview} alt="New preview" fill className="object-cover" />
                  <button type="button" onClick={() => { setImagePreview(null); setImageFile(null); }}
                    className="absolute top-2 right-2 w-7 h-7 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center shadow">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/60 text-white text-xs rounded">New image</span>
                </div>
              ) : currentImage ? (
                <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-gray-200">
                  <Image src={currentImage} alt="Current" fill className="object-cover" />
                  <button type="button" onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <span className="text-white text-xs font-semibold bg-black/60 px-3 py-1.5 rounded-lg">Click to replace</span>
                  </button>
                </div>
              ) : (
                <button type="button" onClick={() => fileInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-gray-200 hover:border-green-400 rounded-lg p-8 flex flex-col items-center gap-2 text-gray-400 hover:text-green-600 transition-colors">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  <span className="text-sm font-medium">Click to upload</span>
                </button>
              )}
              <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageChange} className="hidden" />

              {currentImage && !imagePreview && (
                <button type="button" onClick={() => fileInputRef.current?.click()}
                  className="w-full py-2 text-xs text-gray-500 hover:text-green-600 border border-gray-200 hover:border-green-300 rounded-lg transition-colors">
                  Replace thumbnail
                </button>
              )}
            </div>

            {/* Gallery */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100 pb-2">
                Gallery <span className="text-gray-400 font-normal">({currentGallery.length + galleryFiles.length}/5)</span>
              </h2>

              {/* Current gallery */}
              {currentGallery.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {currentGallery.map((src, idx) => (
                    <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200">
                      <Image src={src} alt={`gallery-${idx}`} fill className="object-cover" />
                      <span className="absolute bottom-0 inset-x-0 bg-black/50 text-white text-[9px] text-center py-0.5">saved</span>
                    </div>
                  ))}
                </div>
              )}

              {/* New gallery previews */}
              {galleryPreviews.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {galleryPreviews.map((src, idx) => (
                    <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-green-200">
                      <Image src={src} alt={`new-${idx}`} fill className="object-cover" />
                      <button type="button" onClick={() => removeNewGallery(idx)}
                        className="absolute top-1 right-1 w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center text-xs shadow">×</button>
                      <span className="absolute bottom-0 inset-x-0 bg-green-600/80 text-white text-[9px] text-center py-0.5">new</span>
                    </div>
                  ))}
                </div>
              )}

              {(currentGallery.length + galleryFiles.length) < 5 && (
                <button type="button" onClick={() => galleryInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-gray-200 hover:border-green-400 rounded-lg p-4 flex flex-col items-center gap-1 text-gray-400 hover:text-green-600 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  <span className="text-xs font-medium">Add gallery photos</span>
                </button>
              )}
              <input ref={galleryInputRef} type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={handleGalleryChange} className="hidden" />
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading || success}
              className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Saving...
                </>
              ) : success ? '✓ Saved!' : 'Save Changes'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
