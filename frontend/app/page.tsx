'use client';

import { useState, useEffect } from 'react';
import FoodCard from '@/src/components/FoodCard';
import FoodModal from '@/src/components/FoodModal';
import PageTransition from '@/src/components/PageTransition';
import { categories as staticCategories } from '@/src/data/menu';
import { MenuItem } from '@/src/types';
import { useAppDispatch, useAppSelector } from '@/src/store/hooks';
import { fetchProducts, setActiveCategory } from '@/src/store/productsSlice';

export default function Home() {
  const dispatch = useAppDispatch();
  const { items: products, loading, activeCategory } = useAppSelector((state) => state.products);

  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Build categories by combining static categories with any dynamic ones from products
  const productCategoryIds = Array.from(new Set(products.map((p) => p.category)));
  const dynamicCategories = [
    ...staticCategories,
    ...productCategoryIds
      .filter((cat) => !staticCategories.some((sc) => sc.id === cat || sc.name.toLowerCase() === cat.toLowerCase()))
      .map((cat) => ({
        id: cat,
        name: cat.charAt(0).toUpperCase() + cat.slice(1),
        icon: '🍽️',
      })),
  ];

  const filteredItems = [...(activeCategory === 'all'
    ? products
    : products.filter((item) => item.category === activeCategory))]
    .sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0));

  const handleCardClick = (item: MenuItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedItem(null), 300);
  };

  return (
    <PageTransition>
      <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#121212] via-[#1A1A1A] to-[#121212] text-white overflow-hidden border-b border-[#FFC107]/20">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FFC107' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        {/* Animated Glow Effect */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FFC107]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#E53935]/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              Welcome to{' '}
              <span className="block mt-2 bg-gradient-to-r from-[#FFC107] via-[#FFD54F] to-[#FFC107] bg-clip-text text-transparent animate-shimmer bg-[length:200%_100%]">
                Gulfgate Cafeteria
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Experience the authentic flavors of the Middle East in the heart of Dhaid, Sharjah. 
              Every dish tells a story of tradition and passion.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
              <button 
                onClick={() => {
                  document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-8 py-4 bg-gradient-to-r from-[#FFC107] to-[#FFD54F] text-[#121212] font-bold rounded-full shadow-xl hover:shadow-2xl hover:shadow-[#FFC107]/50 hover:scale-105 transition-all duration-300 btn-glow"
              >
                Explore Our Menu
              </button>
              <a 
                href="/contact" 
                className="px-8 py-4 bg-transparent border-2 border-[#FFC107] text-[#FFC107] font-semibold rounded-full hover:bg-[#FFC107]/10 transition-all duration-300 hover:scale-105"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#0a0a0a"/>
          </svg>
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="py-16 md:py-24 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#FFC107] to-[#FFD54F] bg-clip-text text-transparent">
              Our Menu
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Discover our carefully curated selection of authentic Middle Eastern delights
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {dynamicCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => dispatch(setActiveCategory(category.id))}
                className={`relative px-6 py-3 rounded-xl font-semibold transition-all duration-300 overflow-hidden group ${
                  activeCategory === category.id
                    ? 'bg-gradient-to-r from-[#FFC107] to-[#FFD54F] text-[#121212] shadow-lg shadow-[#FFC107]/30 scale-105'
                    : 'bg-[#1A1A1A] text-gray-300 border border-[#FFC107]/20 hover:border-[#FFC107] hover:text-[#FFC107] hover:scale-105'
                }`}
              >
                {activeCategory !== category.id && (
                  <span className="absolute inset-0 bg-gradient-to-r from-[#FFC107]/10 to-[#FFD54F]/10 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <span>{category.icon}</span>
                  {category.name}
                </span>
              </button>
            ))}
          </div>

          {/* Menu Grid */}
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-4 border-[#FFC107] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 animate-stagger">
              {filteredItems.map((item) => (
                <FoodCard
                  key={item._id || item.id}
                  item={item}
                  onClick={() => handleCardClick(item)}
                />
              ))}
            </div>
          )}

          {/* No Results */}
          {filteredItems.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">
                No items found in this category.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-[#121212] border-t border-[#FFC107]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-4 p-8 bg-[#1A1A1A] rounded-2xl border border-[#FFC107]/20 hover:border-[#FFC107]/50 hover:shadow-lg hover:shadow-[#FFC107]/20 transition-all duration-300 group">
              <div className="w-16 h-16 bg-gradient-to-br from-[#FFC107] to-[#FFD54F] rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:shadow-2xl group-hover:shadow-[#FFC107]/50 group-hover:scale-110 transition-all duration-300">
                <svg className="w-8 h-8 text-[#121212]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#FFC107]">Fast Service</h3>
              <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">Fresh food prepared and served within 15-20 minutes</p>
            </div>

            <div className="text-center space-y-4 p-8 bg-[#1A1A1A] rounded-2xl border border-[#4CAF50]/20 hover:border-[#4CAF50]/50 hover:shadow-lg hover:shadow-[#4CAF50]/20 transition-all duration-300 group">
              <div className="w-16 h-16 bg-gradient-to-br from-[#4CAF50] to-[#66BB6A] rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:shadow-2xl group-hover:shadow-[#4CAF50]/50 group-hover:scale-110 transition-all duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#4CAF50]">100% Halal</h3>
              <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">All ingredients are certified halal and fresh</p>
            </div>

            <div className="text-center space-y-4 p-8 bg-[#1A1A1A] rounded-2xl border border-[#E53935]/20 hover:border-[#E53935]/50 hover:shadow-lg hover:shadow-[#E53935]/20 transition-all duration-300 group">
              <div className="w-16 h-16 bg-gradient-to-br from-[#E53935] to-[#EF5350] rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:shadow-2xl group-hover:shadow-[#E53935]/50 group-hover:scale-110 transition-all duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#E53935]">Quality Guaranteed</h3>
              <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">Premium ingredients and authentic recipes</p>
            </div>
          </div>
        </div>
      </section>

      {/* Modal */}
      <FoodModal
        item={selectedItem}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
      </div>
    </PageTransition>
  );
}
