'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface Product {
  _id: string;
  name: string;
  description: string;
  ingredients: string;
  category: string;
  price: number;
  image: string;
  gallery?: string[];
  stock?: number;
  isPopular?: boolean;
  isSpicy?: boolean;
  isActive?: boolean;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Delete confirm
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Duplicate
  const [duplicatingId, setDuplicatingId] = useState<string | null>(null);

  // Stock toggle
  const [togglingStockId, setTogglingStockId] = useState<string | null>(null);

  // Toast
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/products`);
      const data = await res.json();
      if (data.success) setProducts(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`${API}/api/products/${deleteTarget._id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) => prev.filter((p) => p._id !== deleteTarget._id));
        showToast(`"${deleteTarget.name}" deleted successfully`);
        setDeleteTarget(null);
      } else {
        showToast(data.message || 'Delete failed', 'error');
      }
    } catch {
      showToast('Network error', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const handleDuplicate = async (product: Product) => {
    setDuplicatingId(product._id);
    try {
      const res = await fetch(`${API}/api/products/${product._id}/duplicate`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) => [data.data, ...prev]);
        showToast(`"${product.name}" duplicated as "${data.data.name}"`);
      } else {
        showToast(data.message || 'Duplicate failed', 'error');
      }
    } catch {
      showToast('Network error', 'error');
    } finally {
      setDuplicatingId(null);
    }
  };

  const handleToggleStock = async (product: Product) => {
    setTogglingStockId(product._id);
    const newStock = (product.stock ?? 0) === 0 ? 10 : 0; // toggle: 0 → 10 (back in stock), any → 0 (out of stock)
    try {
      const formData = new FormData();
      formData.append('stock', String(newStock));
      const res = await fetch(`${API}/api/products/${product._id}`, {
        method: 'PUT',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) =>
          prev.map((p) => p._id === product._id ? { ...p, stock: newStock } : p)
        );
        showToast(
          newStock === 0
            ? `"${product.name}" marked as out of stock`
            : `"${product.name}" is back in stock`
        );
      } else {
        showToast(data.message || 'Failed to update stock', 'error');
      }
    } catch {
      showToast('Network error', 'error');
    } finally {
      setTogglingStockId(null);
    }
  };

  const categories = Array.from(new Set(products.map((p) => p.category)));

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === 'all' || p.category === categoryFilter;
    return matchSearch && matchCat;
  });

  const totalInventory = products.length;
  const popularCount = products.filter((p) => p.isPopular).length;
  const outOfStock = products.filter((p) => (p.stock ?? 1) === 0).length;
  const activeCount = products.filter((p) => p.isActive !== false).length;

  return (
    <div className="space-y-6">

      {/* ── Toast ── */}
      {toast && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-[999] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl border text-sm font-medium ${
          toast.type === 'success' ? 'bg-white border-green-200 text-green-700' : 'bg-white border-red-200 text-red-700'
        }`}>
          {toast.type === 'success' ? (
            <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          {toast.msg}
        </div>
      )}

      {/* ── Page Header ── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your menu items</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Refresh */}
          <button
            onClick={() => { setLoading(true); fetchProducts(); }}
            className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-xl border border-gray-200 transition-colors shadow-sm"
            title="Refresh products"
          >
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
          {/* Add */}
          <Link
            href="/products/create"
            className="flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Product
          </Link>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{totalInventory}</p>
          </div>
          <div className="w-11 h-11 bg-green-50 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
            </svg>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Active</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{activeCount}</p>
          </div>
          <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Popular</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{popularCount}</p>
          </div>
          <div className="w-11 h-11 bg-yellow-50 rounded-xl flex items-center justify-center">
            <span className="text-xl">⭐</span>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Out of Stock</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{outOfStock}</p>
          </div>
          <div className="w-11 h-11 bg-red-50 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
          </div>
        </div>
      </div>

      {/* ── Search + Filters ── */}
      <div className="bg-white rounded-xl border border-gray-200 px-4 py-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="flex items-center gap-2 flex-1">
          <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-sm text-gray-700 placeholder-gray-400 focus:outline-none bg-transparent"
          />
        </div>
        <div className="flex items-center gap-3 sm:border-l sm:border-gray-200 sm:pl-3">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-sm text-gray-600 border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat} className="capitalize">{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Product Grid ── */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <svg className="w-8 h-8 text-gray-300 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-gray-200 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
            </svg>
          </div>
          <p className="font-semibold text-gray-900">No products found</p>
          <p className="text-sm text-gray-500 mt-1">Add your first menu item</p>
          <Link href="/products/create" className="mt-4 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-xl transition-colors">
            Add Product
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((product) => (
            <div key={product._id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 group">

              {/* Image */}
              <div className="relative h-44 bg-gray-100">
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl">🍽️</div>
                )}

                {/* Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  {product.isPopular && (
                    <span className="px-2 py-0.5 bg-yellow-400 text-yellow-900 text-[10px] font-bold rounded-full">⭐ Popular</span>
                  )}
                  {product.isSpicy && (
                    <span className="px-2 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full">🌶️ Spicy</span>
                  )}
                </div>

                {/* Stock badge — clickable toggle */}
                <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleToggleStock(product); }}
                    disabled={togglingStockId === product._id}
                    title={(product.stock ?? 1) > 0 ? 'Click to mark out of stock' : 'Click to mark in stock'}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold shadow transition-all hover:scale-105 active:scale-95 disabled:opacity-60 ${
                      (product.stock ?? 1) > 0
                        ? 'bg-green-500 hover:bg-green-600 text-white'
                        : 'bg-red-500 hover:bg-red-600 text-white'
                    }`}
                  >
                    {togglingStockId === product._id ? (
                      <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-white/80" />
                    )}
                    {(product.stock ?? 1) > 0 ? 'IN STOCK' : 'OUT OF STOCK'}
                  </button>
                </div>
              </div>

              {/* Info */}
              <div className="p-3 space-y-2">
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">{product.name}</h3>
                  <p className="text-xs text-gray-400 capitalize mt-0.5">{product.category}</p>
                </div>

                {/* Description preview */}
                {(product.description || product.ingredients) && (
                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                    {product.description || product.ingredients}
                  </p>
                )}

                <div className="flex items-center justify-between pt-1">
                  <span className="text-sm font-bold text-green-600">AED {product.price}</span>
                  <div className="flex items-center gap-1">
                    {/* Edit */}
                    <Link
                      href={`/products/${product._id}/edit`}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors"
                      title="Edit product"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </Link>
                    {/* Duplicate */}
                    <button
                      onClick={() => handleDuplicate(product)}
                      disabled={duplicatingId === product._id}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors disabled:opacity-50"
                      title="Duplicate product"
                    >
                      {duplicatingId === product._id ? (
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      )}
                    </button>
                    {/* Delete */}
                    <button
                      onClick={() => setDeleteTarget(product)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Delete product"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Delete Confirm Modal ── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center space-y-4">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-7 h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Delete Product</h3>
              <p className="text-sm text-gray-500 mt-1">
                Are you sure you want to delete{' '}
                <span className="font-semibold text-gray-800">&quot;{deleteTarget.name}&quot;</span>?
                <br />This will also remove its images from Cloudinary. This cannot be undone.
              </p>
            </div>
            <div className="flex gap-3 pt-1">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="flex-1 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {deleting && (
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                )}
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
