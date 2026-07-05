'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';

interface Profile {
  name: string;
  email: string;
  role: string;
  avatar: string;
}

const DEFAULT_PROFILE: Profile = {
  name: 'Gulfgate Admin',
  email: 'admin@gulfgatecafeteria.com',
  role: 'ADMIN',
  avatar: '',
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
  const [showModal, setShowModal] = useState(false);

  // Form state
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formAvatar, setFormAvatar] = useState('');
  const [formError, setFormError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const openModal = () => {
    setFormName(profile.name);
    setFormEmail(profile.email);
    setFormAvatar(profile.avatar);
    setFormError('');
    setShowModal(true);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setFormAvatar(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    setFormError('');
    if (!formName.trim()) { setFormError('Name is required.'); return; }
    if (!formEmail.trim()) { setFormError('Email is required.'); return; }
    setProfile((prev) => ({
      ...prev,
      name: formName.trim(),
      email: formEmail.trim(),
      avatar: formAvatar,
    }));
    setShowModal(false);
  };

  return (
    <div className="flex flex-col items-center space-y-6">

      {/* ── Page Header ── */}
      <div className="w-full max-w-xl flex items-start justify-between">
        <div className="text-center flex-1">
          <h1 className="text-3xl font-bold text-gray-900">Account</h1>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mt-1">
            Security &amp; Identity Manifest
          </p>
        </div>
      </div>

      {/* ── Avatar ── */}
      <div className="flex flex-col items-center gap-4">
        <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-900 border-4 border-white shadow-xl">
          {profile.avatar ? (
            <Image
              src={profile.avatar}
              alt="Admin Avatar"
              width={128}
              height={128}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-4xl font-bold text-white">
                {profile.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>
        <button
          onClick={openModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Modify Profile
        </button>
      </div>

      {/* ── Profile Info Card ── */}
      <div className="w-full max-w-xl bg-white rounded-xl border border-gray-200 overflow-hidden">

        {/* Legal Identity */}
        <div className="px-6 py-5 border-b border-gray-100 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Legal Identity</p>
          </div>
          <p className="text-lg font-bold text-gray-900">{profile.name}</p>
        </div>

        {/* Communication + Authorization */}
        <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
          {/* Communication */}
          <div className="px-6 py-5 text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Communication</p>
            </div>
            <p className="text-sm text-gray-700 font-medium">{profile.email}</p>
          </div>

          {/* Authorization Tier */}
          <div className="px-6 py-5 text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Authorization Tier</p>
            </div>
            <span className="inline-flex items-center px-2.5 py-1 bg-green-50 border border-green-200 text-green-700 text-xs font-bold rounded-lg uppercase tracking-wider">
              {profile.role}
            </span>
          </div>
        </div>

        {/* Restaurant Info */}
        <div className="px-6 py-5 border-t border-gray-100 bg-gray-50 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Restaurant</p>
          </div>
          <p className="text-sm font-semibold text-gray-700">Gulfgate Cafeteria</p>
          <p className="text-xs text-gray-400 mt-0.5">Dhaid, Sharjah, UAE</p>
        </div>
      </div>

      {/* ── Modify Profile Modal ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md animate-fadeIn">

            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-base font-bold text-gray-900">Modify Profile</h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-5 space-y-4">
              {formError && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {formError}
                </div>
              )}

              {/* Avatar Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Profile Avatar</label>
                <div className="flex items-center gap-4">
                  <div
                    className="w-16 h-16 rounded-full overflow-hidden bg-gray-900 border-2 border-gray-200 flex-shrink-0 cursor-pointer"
                    onClick={() => fileRef.current?.click()}
                  >
                    {formAvatar ? (
                      <Image src={formAvatar} alt="preview" width={64} height={64} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-xl font-bold text-white">{formName.charAt(0).toUpperCase() || 'G'}</span>
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="px-3 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    Upload Image
                  </button>
                  {formAvatar && (
                    <button
                      type="button"
                      onClick={() => setFormAvatar('')}
                      className="px-3 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                    >
                      Remove
                    </button>
                  )}
                  <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Role — read only */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Authorization Tier</label>
                <input
                  type="text"
                  value={profile.role}
                  readOnly
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-400 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-5 py-2 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
