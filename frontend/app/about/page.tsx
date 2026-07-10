import type { Metadata } from 'next';
import Image from 'next/image';
import PageTransition from '@/src/components/PageTransition';

export const metadata: Metadata = {
  title: 'About Us - Gulfgate Cafeteria',
  description: 'Learn about Gulfgate Cafeteria, our story, values, and commitment to serving authentic Middle Eastern cuisine in Dhaid, Sharjah.',
};

export default function AboutPage() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-[#0a0a0a]">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#121212] via-[#1A1A1A] to-[#121212] text-white py-20 md:py-32 border-b border-[#FFC107]/20">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FFC107' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#FFC107] to-[#FFD54F] bg-clip-text text-transparent">
            About Us
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
            Bringing the authentic taste of the Middle East to your table
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 md:py-24 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#FFC107] to-[#FFD54F] bg-clip-text text-transparent">
                Our Story
              </h2>
              <div className="space-y-4 text-gray-400 leading-relaxed">
                <p>
                  Founded in 2020, Gulfgate Cafeteria has been serving the community of Dhaid, Sharjah 
                  with authentic Middle Eastern cuisine that celebrates the rich culinary traditions 
                  of the region.
                </p>
                <p>
                  What started as a small family-owned establishment has grown into one of the most 
                  beloved dining destinations in the area, known for our signature shawarma, crispy 
                  broasted chicken, and freshly prepared juices.
                </p>
                <p>
                  Every dish we serve is crafted with passion, using only the finest halal ingredients 
                  and time-honored recipes passed down through generations. Our commitment to quality 
                  and authenticity has earned us the trust and loyalty of thousands of customers.
                </p>
              </div>
            </div>
            
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl border border-[#FFC107]/20 group">
              <Image
                src="https://res.cloudinary.com/cqiajkaj/image/upload/v1783706347/WhatsApp_Image_2026-07-09_at_12.43.51_PM_3_kohyac.jpg"
                alt="Gulfgate Cafeteria dining area"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#121212]/60 to-transparent"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Restaurant Gallery Section */}
      <section className="py-16 md:py-24 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#FFC107] to-[#FFD54F] bg-clip-text text-transparent mb-4">
              Our Restaurant
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              A warm and welcoming space in the heart of Dhaid, Sharjah
            </p>
          </div>

          {/* Main featured image */}
          <div className="relative h-80 sm:h-[500px] rounded-2xl overflow-hidden shadow-2xl border border-[#FFC107]/20 mb-4 group">
            <Image
              src="https://res.cloudinary.com/cqiajkaj/image/upload/v1783706330/WhatsApp_Image_2026-07-09_at_12.43.51_PM_1_ydaaan.jpg"
              alt="Gulfgate Cafeteria main dining hall"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#121212]/50 to-transparent" />
            <div className="absolute bottom-4 left-4">
              <span className="px-4 py-2 bg-[#FFC107] text-[#121212] text-sm font-bold rounded-full shadow-lg">
                Main Dining Area
              </span>
            </div>
          </div>

          {/* 2x2 grid of remaining photos */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { src: 'https://res.cloudinary.com/cqiajkaj/image/upload/v1783706363/WhatsApp_Image_2026-07-09_at_12.43.52_PM_s5x4me.jpg', label: 'Counter & Beverages' },
              { src: 'https://res.cloudinary.com/cqiajkaj/image/upload/v1783706356/WhatsApp_Image_2026-07-09_at_12.43.51_PM_dqvr7d.jpg', label: 'Dining Section' },
              { src: 'https://res.cloudinary.com/cqiajkaj/image/upload/v1783706347/WhatsApp_Image_2026-07-09_at_12.43.51_PM_3_kohyac.jpg', label: 'Seating Area' },
              { src: 'https://res.cloudinary.com/cqiajkaj/image/upload/v1783706339/WhatsApp_Image_2026-07-09_at_12.43.51_PM_2_kvowp3.jpg', label: 'Window Seats' },
              { src: 'https://res.cloudinary.com/cqiajkaj/image/upload/v1783706289/WhatsApp_Image_2026-07-09_at_12.43.50_PM_1_yqerqo.jpg', label: 'Interior View' },
              { src: 'https://res.cloudinary.com/cqiajkaj/image/upload/v1783706276/WhatsApp_Image_2026-07-09_at_12.43.49_PM_ugbjix.jpg', label: 'Dining Tables' },
              { src: 'https://res.cloudinary.com/cqiajkaj/image/upload/v1783706233/WhatsApp_Image_2026-07-09_at_12.43.48_PM_qnq6tl.jpg', label: 'Restaurant Ambiance' },
            ].map((photo, idx) => (
              <div key={idx} className="relative h-52 sm:h-64 rounded-xl overflow-hidden shadow-lg border border-[#FFC107]/15 group hover:border-[#FFC107]/40 transition-all duration-300 hover:-translate-y-1">
                <Image
                  src={photo.src}
                  alt={photo.label}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121212]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-white text-xs font-semibold text-center">{photo.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-24 bg-[#121212] border-y border-[#FFC107]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#FFC107] to-[#FFD54F] bg-clip-text text-transparent mb-4">
              Our Values
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#1A1A1A] rounded-2xl p-8 space-y-4 border border-[#FFC107]/20 hover:border-[#FFC107]/50 hover:shadow-xl hover:shadow-[#FFC107]/20 transition-all duration-300 group hover:-translate-y-2">
              <div className="w-14 h-14 bg-gradient-to-br from-[#FFC107] to-[#FFD54F] rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-2xl group-hover:shadow-[#FFC107]/50 group-hover:scale-110 transition-all duration-300">
                <svg className="w-7 h-7 text-[#121212]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#FFC107]">Quality First</h3>
              <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                We source only the finest ingredients and maintain the highest standards in food 
                preparation and service.
              </p>
            </div>

            <div className="bg-[#1A1A1A] rounded-2xl p-8 space-y-4 border border-[#4CAF50]/20 hover:border-[#4CAF50]/50 hover:shadow-xl hover:shadow-[#4CAF50]/20 transition-all duration-300 group hover:-translate-y-2">
              <div className="w-14 h-14 bg-gradient-to-br from-[#4CAF50] to-[#66BB6A] rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-2xl group-hover:shadow-[#4CAF50]/50 group-hover:scale-110 transition-all duration-300">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#4CAF50]">Community Focus</h3>
              <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                We're proud to be part of the Dhaid community and are committed to serving our 
                neighbors with care and respect.
              </p>
            </div>

            <div className="bg-[#1A1A1A] rounded-2xl p-8 space-y-4 border border-[#E53935]/20 hover:border-[#E53935]/50 hover:shadow-xl hover:shadow-[#E53935]/20 transition-all duration-300 group hover:-translate-y-2">
              <div className="w-14 h-14 bg-gradient-to-br from-[#E53935] to-[#EF5350] rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-2xl group-hover:shadow-[#E53935]/50 group-hover:scale-110 transition-all duration-300">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#E53935]">Authentic Tradition</h3>
              <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                Every recipe honors the authentic flavors and cooking techniques of traditional 
                Middle Eastern cuisine.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 md:py-24 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#FFC107] to-[#FFD54F] bg-clip-text text-transparent mb-4">
              Meet Our Team
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Dedicated professionals passionate about serving you the best
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { id: 1, role: 'Head Chef', image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400&q=80' },
              { id: 2, role: 'Restaurant Manager', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80' },
              { id: 3, role: 'Senior Chef', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80' }
            ].map((member) => (
              <div key={member.id} className="bg-[#1A1A1A] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-[#FFC107]/20 transition-all duration-500 border border-[#FFC107]/20 hover:border-[#FFC107]/50 group hover:-translate-y-2">
                <div className="relative h-64 bg-[#121212]">
                  <Image
                    src={member.image}
                    alt={`Team member ${member.id}`}
                    fill
                    className="object-cover object-center group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-transparent to-transparent opacity-60"></div>
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold text-[#FFC107] mb-1">
                    Team Member {member.id}
                  </h3>
                  <p className="text-gray-400">
                    {member.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-[#121212] via-[#1A1A1A] to-[#121212] border-t border-[#FFC107]/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-[#FFC107] to-[#FFD54F] bg-clip-text text-transparent">
            Visit Us Today
          </h2>
          <p className="text-xl mb-8 text-gray-300">
            Experience the authentic flavors that have made us a community favorite
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/"
              className="px-8 py-4 bg-gradient-to-r from-[#FFC107] to-[#FFD54F] text-[#121212] font-bold rounded-full shadow-xl hover:shadow-2xl hover:shadow-[#FFC107]/50 hover:scale-105 transition-all duration-300 btn-glow"
            >
              View Menu
            </a>
            <a
              href="/contact"
              className="px-8 py-4 bg-transparent border-2 border-[#FFC107] text-[#FFC107] font-semibold rounded-full hover:bg-[#FFC107]/10 transition-all duration-300 hover:scale-105"
            >
              Get Directions
            </a>
          </div>
        </div>
      </section>
    </div>
    </PageTransition>
  );
}
