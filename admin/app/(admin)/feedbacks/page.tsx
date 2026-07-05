'use client';

import { useState } from 'react';
import Image from 'next/image';

type FeedbackStatus = 'approved' | 'pending';

interface Feedback {
  id: string;
  customer: {
    name: string;
    initial: string;
    color: string;
  };
  product: {
    name: string;
    image: string;
  };
  rating: number;
  review: string;
  orderRef: string;
  date: string;
  status: FeedbackStatus;
  visibleToUsers: boolean;
}

// Placeholder — will be replaced with API fetch
const mockFeedbacks: Feedback[] = [];

export default function FeedbacksPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>(mockFeedbacks);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | FeedbackStatus>('all');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const totalReviews = feedbacks.length;
  const approvedCount = feedbacks.filter((f) => f.status === 'approved').length;
  const pendingCount = feedbacks.filter((f) => f.status === 'pending').length;
  const avgRating =
    feedbacks.length > 0
      ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1)
      : '0.0';

  const filtered = feedbacks.filter((f) => {
    const matchTab = activeTab === 'all' || f.status === activeTab;
    const q = search.toLowerCase();
    const matchSearch =
      f.customer.name.toLowerCase().includes(q) ||
      f.product.name.toLowerCase().includes(q) ||
      f.review.toLowerCase().includes(q);
    return matchTab && matchSearch;
  });

  const handleToggleVisible = (id: string) => {
    setFeedbacks((prev) =>
      prev.map((f) => (f.id === id ? { ...f, visibleToUsers: !f.visibleToUsers } : f))
    );
  };

  const handleToggleStatus = (id: string) => {
    setFeedbacks((prev) =>
      prev.map((f) =>
        f.id === id
          ? { ...f, status: f.status === 'approved' ? 'pending' : 'approved' }
          : f
      )
    );
  };

  const handleDelete = (id: string) => {
    setFeedbacks((prev) => prev.filter((f) => f.id !== id));
    setDeleteId(null);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-200'}`}
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ));
  };

  return (
    <div className="space-y-6">

      {/* ── Page Header ── */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Customer Feedbacks</h1>
        <p className="text-sm text-gray-500 mt-1">Manage and moderate product reviews from your customers</p>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Reviews */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{totalReviews}</p>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Reviews</p>
          </div>
        </div>

        {/* Approved */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{approvedCount}</p>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Approved</p>
          </div>
        </div>

        {/* Pending */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{pendingCount}</p>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Pending</p>
          </div>
        </div>

        {/* Avg Rating */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{avgRating}</p>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Avg Rating</p>
          </div>
        </div>
      </div>

      {/* ── Search + Filter Tabs ── */}
      <div className="bg-white rounded-xl border border-gray-200 px-4 py-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search */}
        <div className="flex items-center gap-2 flex-1">
          <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by customer name, product, or review text..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-sm text-gray-700 placeholder-gray-400 focus:outline-none bg-transparent"
          />
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 sm:border-l sm:border-gray-200 sm:pl-3">
          {[
            { label: `ALL (${totalReviews})`, value: 'all' as const },
            { label: `APPROVED (${approvedCount})`, value: 'approved' as const },
            { label: `PENDING (${pendingCount})`, value: 'pending' as const },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                activeTab === tab.value
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Feedback Cards ── */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-gray-200 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-gray-500">No feedbacks yet</p>
          <p className="text-xs text-gray-400 mt-1">Customer reviews will appear here once submitted</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((feedback) => (
            <div key={feedback.id} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-start gap-4">

                {/* Product Image */}
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                  {feedback.product.image ? (
                    <Image
                      src={feedback.product.image}
                      alt={feedback.product.name}
                      width={56}
                      height={56}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">🍽️</div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-gray-900">{feedback.product.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        {/* Customer Avatar */}
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                          style={{ backgroundColor: feedback.customer.color }}
                        >
                          {feedback.customer.initial}
                        </div>
                        <span className="text-sm text-gray-600 font-medium">{feedback.customer.name}</span>
                        <span className="text-xs text-gray-400">{feedback.date}</span>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <button
                      onClick={() => handleToggleStatus(feedback.id)}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0 transition-colors ${
                        feedback.status === 'approved'
                          ? 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100'
                          : 'bg-yellow-50 text-yellow-700 border border-yellow-200 hover:bg-yellow-100'
                      }`}
                    >
                      {feedback.status === 'approved' ? (
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                      {feedback.status === 'approved' ? 'Approved' : 'Pending'}
                    </button>
                  </div>

                  {/* Stars */}
                  <div className="flex items-center gap-0.5 mt-2">
                    {renderStars(feedback.rating)}
                    <span className="text-xs text-gray-500 ml-1">{feedback.rating}/5</span>
                  </div>

                  {/* Review Text */}
                  <p className="text-sm text-gray-700 mt-2 leading-relaxed">{feedback.review}</p>

                  {/* Order Ref */}
                  <p className="text-xs text-gray-400 mt-1">
                    Order: <span className="text-green-600 font-medium">{feedback.orderRef}</span>
                  </p>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                {/* Visible to users toggle */}
                <div
                  onClick={() => handleToggleVisible(feedback.id)}
                  className="flex items-center gap-2 cursor-pointer group"
                >
                  <div className={`w-10 h-5 rounded-full relative transition-colors ${feedback.visibleToUsers ? 'bg-green-500' : 'bg-gray-300'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all shadow-sm ${feedback.visibleToUsers ? 'left-5' : 'left-0.5'}`} />
                  </div>
                  <span className="text-xs font-medium text-gray-600 group-hover:text-gray-900 transition-colors">
                    Visible to users
                  </span>
                </div>

                {/* Delete */}
                {deleteId === feedback.id ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">Delete this review?</span>
                    <button
                      onClick={() => handleDelete(feedback.id)}
                      className="px-3 py-1 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                    >
                      Yes, delete
                    </button>
                    <button
                      onClick={() => setDeleteId(null)}
                      className="px-3 py-1 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setDeleteId(feedback.id)}
                    className="flex items-center gap-1.5 text-xs font-medium text-red-500 hover:text-red-700 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
