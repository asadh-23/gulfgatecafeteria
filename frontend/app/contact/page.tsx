'use client';

import { useState } from 'react';
import PageTransition from '@/src/components/PageTransition';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', phone: '', message: '' });
      
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 5000);
    }, 1500);
  };

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
            Get In Touch
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
            We'd love to hear from you. Visit us or send us a message!
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16 md:py-24 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#FFC107] to-[#FFD54F] bg-clip-text text-transparent mb-6">
                  Contact Information
                </h2>
                <p className="text-gray-400 leading-relaxed">
                  Have a question or want to make a reservation? Reach out to us through any of 
                  the following channels, and we'll get back to you as soon as possible.
                </p>
              </div>

              <div className="space-y-6">
                {/* Address */}
                <div className="flex items-start space-x-4 p-6 bg-[#1A1A1A] rounded-xl shadow-md hover:shadow-xl hover:shadow-[#FFC107]/20 transition-all duration-300 border border-[#FFC107]/20 hover:border-[#FFC107]/50 group">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#FFC107] to-[#FFD54F] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6 text-[#121212]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#FFC107] mb-1">Address</h3>
                    <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                      Al Dhaid Road<br />
                      Dhaid, Sharjah<br />
                      United Arab Emirates
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start space-x-4 p-6 bg-[#1A1A1A] rounded-xl shadow-md hover:shadow-xl hover:shadow-[#4CAF50]/20 transition-all duration-300 border border-[#4CAF50]/20 hover:border-[#4CAF50]/50 group">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#4CAF50] to-[#66BB6A] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#4CAF50] mb-1">Phone</h3>
                    <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                      +971 XX XXX XXXX<br />
                      Available daily: 10:00 AM - 11:00 PM
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start space-x-4 p-6 bg-[#1A1A1A] rounded-xl shadow-md hover:shadow-xl hover:shadow-[#E53935]/20 transition-all duration-300 border border-[#E53935]/20 hover:border-[#E53935]/50 group">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#E53935] to-[#EF5350] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#E53935] mb-1">Email</h3>
                    <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                      info@gulfgatecafeteria.ae<br />
                      We'll respond within 24 hours
                    </p>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start space-x-4 p-6 bg-[#1A1A1A] rounded-xl shadow-md hover:shadow-xl hover:shadow-[#FFC107]/20 transition-all duration-300 border border-[#FFC107]/20 hover:border-[#FFC107]/50 group">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#FFC107] to-[#FFD54F] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6 text-[#121212]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#FFC107] mb-1">Opening Hours</h3>
                    <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                      Monday - Sunday<br />
                      10:00 AM - 11:00 PM<br />
                      Open every day
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-[#1A1A1A] rounded-2xl shadow-xl p-8 border border-[#FFC107]/20">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-[#FFC107] to-[#FFD54F] bg-clip-text text-transparent mb-6">
                Send Us a Message
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-[#FFC107]/30 bg-[#121212] text-white placeholder-gray-500 focus:ring-2 focus:ring-[#FFC107] focus:border-[#FFC107] transition-all duration-300 hover:border-[#FFC107]/50"
                    placeholder="John Doe"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-[#FFC107]/30 bg-[#121212] text-white placeholder-gray-500 focus:ring-2 focus:ring-[#FFC107] focus:border-[#FFC107] transition-all duration-300 hover:border-[#FFC107]/50"
                    placeholder="john@example.com"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-[#FFC107]/30 bg-[#121212] text-white placeholder-gray-500 focus:ring-2 focus:ring-[#FFC107] focus:border-[#FFC107] transition-all duration-300 hover:border-[#FFC107]/50"
                    placeholder="+971 XX XXX XXXX"
                  />
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 rounded-lg border border-[#FFC107]/30 bg-[#121212] text-white placeholder-gray-500 focus:ring-2 focus:ring-[#FFC107] focus:border-[#FFC107] transition-all duration-300 resize-none hover:border-[#FFC107]/50"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-6 py-4 bg-gradient-to-r from-[#FFC107] to-[#FFD54F] hover:from-[#FFD54F] hover:to-[#FFC107] text-[#121212] font-bold rounded-xl shadow-lg hover:shadow-2xl hover:shadow-[#FFC107]/50 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-[#121212]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    'Send Message'
                  )}
                </button>

                {/* Success Message */}
                {submitStatus === 'success' && (
                  <div className="bg-[#4CAF50]/20 border border-[#4CAF50] rounded-lg p-4 animate-slideDown">
                    <p className="text-[#4CAF50] text-sm flex items-center font-medium">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Thank you! Your message has been sent successfully. We'll get back to you soon.
                    </p>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-[#121212] to-[#1A1A1A] border-t border-[#FFC107]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#FFC107] to-[#FFD54F] bg-clip-text text-transparent mb-4">
              Find Us Here
            </h2>
            <p className="text-lg text-gray-400">
              Visit us at our location in Dhaid, Sharjah
            </p>
          </div>

          <div className="rounded-2xl overflow-hidden shadow-2xl border border-[#FFC107]/30 h-96 bg-[#1A1A1A] flex items-center justify-center hover:border-[#FFC107]/50 transition-all duration-300">
            <div className="text-center">
              <svg className="w-16 h-16 mx-auto mb-4 text-[#FFC107]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="text-gray-400 text-lg">
                Map integration placeholder
              </p>
              <p className="text-gray-500 text-sm mt-2">
                Add Google Maps or other map service
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
    </PageTransition>
  );
}
