import React from 'react';
import { ShoppingBag, Shield, Zap, Heart } from 'lucide-react';

export default function AboutUs() {
  const features = [
    {
      icon: <ShoppingBag className="w-8 h-8 text-[#088395] dark:text-[#7AB2B2]" />,
      title: "Vast Selection",
      description: "Explore thousands of premium products across multiple categories."
    },
    {
      icon: <Shield className="w-8 h-8 text-[#088395] dark:text-[#7AB2B2]" />,
      title: "Secure Shopping",
      description: "Your data and transactions are protected by industry-leading security."
    },
    {
      icon: <Zap className="w-8 h-8 text-[#088395] dark:text-[#7AB2B2]" />,
      title: "Fast Delivery",
      description: "Experience lightning-fast shipping right to your doorstep."
    },
    {
      icon: <Heart className="w-8 h-8 text-[#088395] dark:text-[#7AB2B2]" />,
      title: "Customer First",
      description: "Our dedicated support team is always here to help you."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-[#088395]/10 dark:bg-[#7AB2B2]/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#088395]/10 dark:bg-[#7AB2B2]/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight">
            Redefining Your <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#088395] to-[#7AB2B2]">Shopping Experience</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Welcome to DigiMart. We believe in bringing the best technology and premium lifestyle products to your fingertips with unparalleled convenience and trust.
          </p>
        </div>
      </div>

      {/* Our Story */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Our Story</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
              Founded with a simple yet powerful vision, DigiMart started as a small tech hub and has grown into a leading e-commerce destination. We noticed a gap in the market for a truly customer-centric electronics retailer.
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
              Today, we serve millions of customers, offering everything from the latest smartphones to smart home devices, always keeping our core promise: quality, affordability, and exceptional service.
            </p>
          </div>
          <div className="relative">
            <div className="aspect-square md:aspect-video lg:aspect-square rounded-3xl overflow-hidden shadow-2xl relative z-10 bg-gray-200 dark:bg-gray-800">
               <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt="Team collaborating" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-6 -right-6 w-full h-full bg-gradient-to-br from-[#088395]/20 to-[#7AB2B2]/20 rounded-3xl z-0 blur-xl"></div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="bg-white dark:bg-gray-900 border-y border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Why Choose DigiMart</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">We go above and beyond to ensure you have the best possible shopping experience.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="bg-gray-50 dark:bg-gray-800/50 p-8 rounded-2xl border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="w-16 h-16 bg-white dark:bg-gray-900 rounded-2xl flex items-center justify-center shadow-sm mb-6 border border-gray-100 dark:border-gray-800">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
