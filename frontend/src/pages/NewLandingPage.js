import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, TrendingUp, DollarSign, Building, BarChart3, BookOpen } from 'lucide-react';
import EllenChat from '@/components/EllenChat';
import Footer from '@/components/Footer';

export default function NewLandingPage() {
  const navigate = useNavigate();
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const services = [
    { 
      id: 'homeowners', 
      title: 'Homeowners', 
      icon: Home,
      description: 'Find your dream home loan'
    },
    { 
      id: 'first-time', 
      title: 'First-Time Buyers', 
      icon: TrendingUp,
      description: 'Start your homeownership journey'
    },
    { 
      id: 'refinance', 
      title: 'Refinance', 
      icon: DollarSign,
      description: 'Lower your rate or payment'
    },
    { 
      id: 'investment', 
      title: 'Investment Properties', 
      icon: Building,
      description: 'Expand your portfolio'
    },
    { 
      id: 'compare', 
      title: 'Rate Compare', 
      icon: BarChart3,
      description: 'See the best rates'
    },
    { 
      id: 'learn', 
      title: 'Learn', 
      icon: BookOpen,
      description: 'Mortgage education'
    }
  ];

  const openChat = (serviceId) => {
    setSelectedService(serviceId);
    setChatOpen(true);
  };

  const handleSignupPrompt = (userData) => {
    navigate('/signup', { state: { fromEllen: true, userData } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8F9FA] to-white">
      {/* Navigation */}
      <nav className="sticky top-0 bg-white/95 backdrop-blur-lg border-b border-[#E5E7EB] z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 items-center h-16 gap-4">
            {/* Left - Service Links */}
            <div className="hidden lg:flex items-center space-x-4 xl:space-x-6 justify-start">
              {services.slice(0, 3).map((service) => (
                <button
                  key={service.id}
                  onClick={() => service.id === 'learn' ? navigate('/products') : navigate('/ellen', { state: { serviceType: service.id } })}
                  className="text-sm text-[#667085] hover:text-[#0F4C81] font-medium transition-colors duration-200 whitespace-nowrap"
                  data-testid={`nav-${service.id}`}
                >
                  {service.title}
                </button>
              ))}
            </div>

            {/* Center - Logo */}
            <div className="flex items-center space-x-2 justify-center">
              <div className="w-10 h-10 bg-[#0F4C81] rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-xl">M</span>
              </div>
              <span className="text-xl lg:text-2xl font-bold text-[#0F4C81] whitespace-nowrap" style={{ fontFamily: 'Space Grotesk' }}>
                MortsGage
              </span>
            </div>

            {/* Right - Auth Buttons */}
            <div className="flex items-center space-x-3 justify-end">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/login')} 
                className="text-[#0F4C81] text-sm"
                data-testid="nav-login-btn"
              >
                Log In
              </Button>
              <Button 
                onClick={() => navigate('/signup')} 
                className="bg-[#0F4C81] hover:bg-[#0A3A61] text-white rounded-full text-sm px-4"
                data-testid="nav-signup-btn"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="text-center max-w-4xl mx-auto">
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#0A1929] mb-6 leading-tight"
            style={{ fontFamily: 'Space Grotesk' }}
            data-testid="hero-headline"
          >
            Find Your Best Mortgage
            <br />
            <span className="text-[#0F4C81]">in Minutes.</span>
          </h1>
          <p className="text-lg sm:text-xl text-[#667085] mb-8 max-w-2xl mx-auto">
            Zero stress. Great rates. Guided by Ellen.
          </p>
          <Button
            size="lg"
            onClick={() => openChat('default')}
            className="bg-gradient-to-r from-[#0F4C81] to-[#2A6F9E] hover:from-[#0A3A61] hover:to-[#1F5580] text-white rounded-full px-12 text-lg h-16 shadow-lg hover:shadow-xl transition-all duration-300"
            data-testid="check-rates-cta"
          >
            CHECK MY RATES
          </Button>
        </div>

        {/* Illustration Placeholder */}
        <div className="mt-16 flex justify-center">
          <div className="w-full max-w-3xl h-64 bg-gradient-to-br from-[#E8F4F8] to-[#A9CCE3]/20 rounded-3xl flex items-center justify-center border-2 border-dashed border-[#A9CCE3]">
            <div className="text-center">
              <Home className="h-24 w-24 text-[#0F4C81]/30 mx-auto mb-4" />
              <p className="text-[#667085] text-sm">[Lemonade-style illustration here]</p>
            </div>
          </div>
        </div>
      </div>

      {/* Service Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2
          className="text-3xl sm:text-4xl font-bold text-[#0A1929] mb-12 text-center"
          style={{ fontFamily: 'Space Grotesk' }}
        >
          How Can We Help You?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.slice(0, 6).map((service) => {
            const Icon = service.icon;
            return (
              <button
                key={service.id}
                onClick={() => service.id === 'learn' ? navigate('/products') : openChat(service.id)}
                className="card-hover bg-white rounded-2xl p-8 shadow-md border border-[#E5E7EB] text-left hover:border-[#0F4C81] transition-all duration-300"
                data-testid={`service-card-${service.id}`}
              >
                <div className="w-14 h-14 bg-[#E8F4F8] rounded-xl flex items-center justify-center mb-6">
                  <Icon className="h-7 w-7 text-[#0F4C81]" />
                </div>
                <h3 className="text-xl font-semibold mb-3" style={{ fontFamily: 'Space Grotesk' }}>
                  {service.title}
                </h3>
                <p className="text-[#667085]">{service.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Trust Section */}
      <div className="bg-gradient-to-r from-[#E8F4F8] to-[#F8F9FA] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2
              className="text-3xl sm:text-4xl font-bold text-[#0A1929] mb-6"
              style={{ fontFamily: 'Space Grotesk' }}
            >
              Why Choose MortsGage?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-[#0F4C81] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl font-bold">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-2" style={{ fontFamily: 'Space Grotesk' }}>
                  Chat with Ellen
                </h3>
                <p className="text-[#667085]">Your friendly AI guide makes mortgages simple</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-[#0F4C81] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl font-bold">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-2" style={{ fontFamily: 'Space Grotesk' }}>
                  Get Instant Quotes
                </h3>
                <p className="text-[#667085]">Compare rates from top lenders in minutes</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-[#0F4C81] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl font-bold">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-2" style={{ fontFamily: 'Space Grotesk' }}>
                  Close with Confidence
                </h3>
                <p className="text-[#667085]">Transparent process from start to finish</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="bg-[#0F4C81] rounded-3xl p-12 text-center">
          <h2
            className="text-3xl sm:text-4xl font-bold text-white mb-6"
            style={{ fontFamily: 'Space Grotesk' }}
          >
            Ready to Get Started?
          </h2>
          <p className="text-lg text-[#A9CCE3] mb-8 max-w-2xl mx-auto">
            Talk to Ellen and find your perfect mortgage in just a few minutes.
          </p>
          <Button
            size="lg"
            onClick={() => openChat('default')}
            className="bg-white text-[#0F4C81] hover:bg-[#F8F9FA] rounded-full px-12 text-lg h-16"
            data-testid="footer-cta"
          >
            Talk to Ellen Now
          </Button>
        </div>
      </div>

      <Footer />

      {/* Ellen Chat Overlay */}
      <EllenChat 
        isOpen={chatOpen} 
        onClose={() => setChatOpen(false)} 
        serviceType={selectedService}
        onSignupPrompt={handleSignupPrompt}
      />
    </div>
  );
}