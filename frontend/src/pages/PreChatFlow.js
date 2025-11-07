import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, ArrowRight, Home, Building, CheckCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

// Processing animation component
function ProcessingStep({ serviceTitle, onComplete }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3000); // Auto-advance after 3 seconds
    
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="bg-white rounded-3xl shadow-lg border border-[#E5E7EB] p-8 md:p-12 animate-fadeIn text-center" data-testid="step-processing">
      <div className="py-12">
        <div className="relative inline-block mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-[#0F4C81] to-[#2A6F9E] rounded-full flex items-center justify-center animate-pulse">
            <CheckCircle className="h-12 w-12 text-white" />
          </div>
          <div className="absolute inset-0 w-24 h-24 border-4 border-[#A9CCE3] rounded-full animate-ping"></div>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-[#0A1929] mb-4" style={{ fontFamily: 'Space Grotesk' }}>
          Preparing Your Experience...
        </h1>
        <p className="text-lg text-[#667085] mb-8">
          Connecting you with Ellen, your mortgage guide
        </p>

        <div className="space-y-3 text-left max-w-md mx-auto">
          <div className="flex items-center space-x-3 animate-fadeIn" style={{ animationDelay: '0.5s' }}>
            <CheckCircle className="h-5 w-5 text-[#10B981]" />
            <span className="text-[#667085]">Property details confirmed</span>
          </div>
          <div className="flex items-center space-x-3 animate-fadeIn" style={{ animationDelay: '1s' }}>
            <CheckCircle className="h-5 w-5 text-[#10B981]" />
            <span className="text-[#667085]">Analyzing {serviceTitle}</span>
          </div>
          <div className="flex items-center space-x-3 animate-fadeIn" style={{ animationDelay: '1.5s' }}>
            <CheckCircle className="h-5 w-5 text-[#10B981]" />
            <span className="text-[#667085]">Loading Ellen...</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PreChatFlow() {
  const navigate = useNavigate();
  const location = useLocation();
  const serviceType = location.state?.serviceType || 'purchase';
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    street: '',
    unit: '',
    propertyType: '',
    termsAccepted: false
  });

  const totalSteps = 5;
  const progress = (step / totalSteps) * 100;

  const getServiceTitle = () => {
    const titles = {
      purchase: 'Purchase a New Home',
      refinance: 'Refinance Mortgage',
      investment: 'Investment Property',
      'home-equity': 'Home Equity Loan',
      calculator: 'Mortgage Calculator',
      default: 'Mortgage Service'
    };
    return titles[serviceType] || titles.default;
  };

  const handleNext = () => {
    if (step === 1 && (!formData.firstName || !formData.lastName)) {
      alert('Please enter your first and last name');
      return;
    }
    if (step === 2 && !formData.street) {
      alert('Please enter your street address');
      return;
    }
    if (step === 3 && !formData.propertyType) {
      alert('Please select a property type');
      return;
    }
    if (step === 4 && !formData.termsAccepted) {
      alert('Please accept the terms and conditions');
      return;
    }

    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Navigate to Ellen chat with all collected data
      navigate('/ellen', { 
        state: { 
          serviceType, 
          userData: formData 
        } 
      });
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigate('/');
    }
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

      {/* Progress Bar */}
      <div className="bg-white border-b border-[#E5E7EB] py-4">
        <div className="max-w-2xl mx-auto px-4">
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-[#667085] mt-2 text-center">
            Step {step} of {totalSteps}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="max-w-2xl w-full">
          {/* Ellen's Avatar - Always Visible */}
          <div className="text-center mb-8 animate-fadeIn">
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=faces"
              alt="Ellen - Your Mortgage Guide"
              className="w-20 h-20 rounded-full mx-auto mb-3 border-4 border-[#A9CCE3] shadow-lg"
            />
            <p className="text-sm text-[#667085]">Ellen, your mortgage guide</p>
          </div>

          {/* Step 1: Name Collection */}
          {step === 1 && (
            <div className="bg-white rounded-3xl shadow-lg border border-[#E5E7EB] p-8 md:p-12 animate-fadeIn" data-testid="step-name">
              <div className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-[#0A1929] mb-3" style={{ fontFamily: 'Space Grotesk' }}>
                  Let's get started!
                </h1>
                <p className="text-lg text-[#667085]">
                  What's your name?
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <Label htmlFor="firstName" className="text-base font-medium">First Name</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    placeholder="e.g., John"
                    className="mt-2 h-14 text-base placeholder:text-[#CBD5E0]"
                    autoFocus
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
                    data-testid="input-lastname"
                  />
                </div>

                <Button
                  onClick={handleNext}
                  className="w-full h-14 bg-[#0F4C81] hover:bg-[#0A3A61] text-white rounded-full text-lg mt-8"
                  data-testid="next-button"
                >
                  Let's Do It
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Address */}
          {step === 2 && (
            <div className="bg-white rounded-3xl shadow-lg border border-[#E5E7EB] p-8 md:p-12 animate-fadeIn" data-testid="step-address">
              <div className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-[#0A1929] mb-3" style={{ fontFamily: 'Space Grotesk' }}>
                  Great, {formData.firstName}!
                </h1>
                <p className="text-lg text-[#667085]">
                  Where is the property located?
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <Label htmlFor="street" className="text-base">Street Address</Label>
                  <Input
                    id="street"
                    value={formData.street}
                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                    placeholder="123 Main Street"
                    className="mt-2 h-14 text-base"
                    autoFocus
                    data-testid="input-street"
                  />
                </div>
                <div>
                  <Label htmlFor="unit" className="text-base">Unit Number (Optional)</Label>
                  <Input
                    id="unit"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    placeholder="Apt 4B"
                    className="mt-2 h-14 text-base"
                    data-testid="input-unit"
                  />
                </div>

                <Button
                  onClick={handleNext}
                  className="w-full h-14 bg-[#0F4C81] hover:bg-[#0A3A61] text-white rounded-full text-lg mt-8"
                  data-testid="next-button"
                >
                  Continue
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Property Type */}
          {step === 3 && (
            <div className="bg-white rounded-3xl shadow-lg border border-[#E5E7EB] p-8 md:p-12 animate-fadeIn" data-testid="step-property-type">
              <div className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-[#0A1929] mb-3" style={{ fontFamily: 'Space Grotesk' }}>
                  What type of property?
                </h1>
                <p className="text-lg text-[#667085]">
                  Select the property type
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {['Condo', 'Co-op', 'House', 'Other'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setFormData({ ...formData, propertyType: type })}
                    className={`p-8 rounded-2xl border-2 transition-all duration-300 ${
                      formData.propertyType === type
                        ? 'border-[#0F4C81] bg-[#E8F4F8]'
                        : 'border-[#E5E7EB] hover:border-[#A9CCE3]'
                    }`}
                    data-testid={`property-type-${type.toLowerCase()}`}
                  >
                    <div className="flex flex-col items-center space-y-3">
                      {type === 'House' ? (
                        <Home className="h-12 w-12 text-[#0F4C81]" />
                      ) : (
                        <Building className="h-12 w-12 text-[#0F4C81]" />
                      )}
                      <span className="text-lg font-semibold">{type}</span>
                    </div>
                  </button>
                ))}
              </div>

              <Button
                onClick={handleNext}
                disabled={!formData.propertyType}
                className="w-full h-14 bg-[#0F4C81] hover:bg-[#0A3A61] text-white rounded-full text-lg mt-8"
                data-testid="next-button"
              >
                Continue
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          )}

          {/* Step 4: Terms & Conditions */}
          {step === 4 && (
            <div className="bg-white rounded-3xl shadow-lg border border-[#E5E7EB] p-8 md:p-12 animate-fadeIn" data-testid="step-terms">
              <div className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-[#0A1929] mb-3" style={{ fontFamily: 'Space Grotesk' }}>
                  Almost there!
                </h1>
                <p className="text-lg text-[#667085]">
                  Please review and accept our terms
                </p>
              </div>

              <div className="bg-[#F8F9FA] rounded-2xl p-6 max-h-64 overflow-y-auto mb-6">
                <h3 className="font-semibold mb-3">Terms and Conditions</h3>
                <p className="text-sm text-[#667085] leading-relaxed">
                  By proceeding, you agree to MortsGage's Terms of Service and Privacy Policy. 
                  We will use your information to provide mortgage quotes and services. 
                  Your data is secure and will not be shared without your consent.
                  <br /><br />
                  By clicking "I Accept", you acknowledge that you have read and understood these terms.
                </p>
              </div>

              <div className="flex items-start space-x-3 mb-8">
                <Checkbox
                  id="terms"
                  checked={formData.termsAccepted}
                  onCheckedChange={(checked) => setFormData({ ...formData, termsAccepted: checked })}
                  className="mt-1"
                  data-testid="terms-checkbox"
                />
                <label htmlFor="terms" className="text-sm text-[#667085] cursor-pointer">
                  I have read and accept the Terms and Conditions and Privacy Policy
                </label>
              </div>

              <Button
                onClick={handleNext}
                disabled={!formData.termsAccepted}
                className="w-full h-14 bg-[#0F4C81] hover:bg-[#0A3A61] text-white rounded-full text-lg"
                data-testid="next-button"
              >
                I Accept
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          )}

          {/* Step 5: Processing Animation */}
          {step === 5 && (
            <ProcessingStep 
              serviceTitle={getServiceTitle()} 
              onComplete={() => navigate('/ellen', { state: { serviceType, userData: formData } })} 
            />
          )}
        </div>
      </div>
    </div>
  );
}
