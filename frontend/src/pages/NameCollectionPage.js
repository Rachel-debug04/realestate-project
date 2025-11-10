import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, ArrowRight } from 'lucide-react';

// Ellen's avatar
const ELLEN_AVATAR = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=faces';

export default function NameCollectionPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const serviceType = location.state?.serviceType || 'first-time-buyer';
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName) {
      alert('Please enter both first and last name');
      return;
    }

    // Navigate directly to Ellen chat with collected name
    navigate('/ellen', { 
      state: { 
        serviceType, 
        userData: formData 
      } 
    });
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8F9FA] to-white flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-[#E5E7EB] sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Button
              variant="ghost"
              onClick={handleBack}
              className="flex items-center space-x-2 text-[#667085] hover:text-[#0F4C81]"
              data-testid="back-button"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>
            
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-[#0F4C81] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">M</span>
              </div>
              <span className="text-xl font-bold text-[#0F4C81]" style={{ fontFamily: 'Space Grotesk' }}>
                MortsGage
              </span>
            </div>

            <div className="w-20"></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="max-w-2xl w-full">
          {/* Ellen's Avatar */}
          <div className="text-center mb-8 animate-fadeIn">
            <img
              src={ELLEN_AVATAR}
              alt="Ellen - Your Mortgage Guide"
              className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-[#A9CCE3] shadow-lg"
            />
            <p className="text-lg font-medium text-[#0A1929]">Meet Ellen</p>
            <p className="text-sm text-[#667085]">Your friendly mortgage guide</p>
          </div>

          {/* Name Collection Form */}
          <div className="bg-white rounded-3xl shadow-lg border border-[#E5E7EB] p-8 md:p-12 animate-fadeIn" data-testid="name-collection-form">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-[#0A1929] mb-3" style={{ fontFamily: 'Space Grotesk' }}>
                Let's get started!
              </h1>
              <p className="text-lg text-[#667085]">
                What's your name?
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="firstName" className="text-base font-medium">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="e.g., John"
                  className="mt-2 h-14 text-base placeholder:text-[#CBD5E0]"
                  autoFocus
                  required
                  data-testid="input-firstname"
                />
              </div>
              
              <div>
                <Label htmlFor="lastName" className="text-base font-medium">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="e.g., Smith"
                  className="mt-2 h-14 text-base placeholder:text-[#CBD5E0]"
                  required
                  data-testid="input-lastname"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-14 bg-[#0F4C81] hover:bg-[#0A3A61] text-white rounded-full text-lg mt-8"
                data-testid="lets-do-it-button"
              >
                Let's Do It
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
