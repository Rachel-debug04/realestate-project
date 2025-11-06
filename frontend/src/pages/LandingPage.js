import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, MessageSquare, Shield, Zap, TrendingUp } from 'lucide-react';
import Footer from '@/components/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="hero-gradient">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-[#0F4C81] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">EM</span>
              </div>
              <span className="text-2xl font-bold text-[#0F4C81]" style={{ fontFamily: 'Space Grotesk' }}>
                EasyMortgage
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost" className="text-[#0F4C81]" data-testid="nav-login">
                  Log In
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-[#0F4C81] hover:bg-[#0A3A61] text-white rounded-full" data-testid="nav-signup">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#0A1929] mb-6 leading-tight"
              style={{ fontFamily: 'Space Grotesk' }}
              data-testid="hero-title"
            >
              Your Home Loan Journey,
              <span className="text-[#0F4C81]"> Simplified</span>
            </h1>
            <p className="text-base sm:text-lg text-[#667085] mb-8 max-w-2xl mx-auto">
              Fast, transparent mortgage pre-qualification and application powered by AI.
              Get approved in minutes, not weeks.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/signup">
                <Button
                  size="lg"
                  className="bg-[#0F4C81] hover:bg-[#0A3A61] text-white rounded-full px-8 text-lg h-14"
                  data-testid="cta-get-started"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-[#0F4C81] text-[#0F4C81] hover:bg-[#0F4C81] hover:text-white rounded-full px-8 text-lg h-14"
                  data-testid="cta-see-how"
                >
                  See How It Works
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2
            className="text-3xl sm:text-4xl font-bold text-[#0A1929] mb-4"
            style={{ fontFamily: 'Space Grotesk' }}
          >
            Why Choose EasyMortgage?
          </h2>
          <p className="text-lg text-[#667085] max-w-2xl mx-auto">
            We combine cutting-edge AI with empathetic service to make your mortgage journey seamless.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="card-hover bg-white rounded-2xl p-8 shadow-md border border-[#E5E7EB]" data-testid="feature-ai">
            <div className="w-14 h-14 bg-[#E8F4F8] rounded-xl flex items-center justify-center mb-6">
              <MessageSquare className="h-7 w-7 text-[#0F4C81]" />
            </div>
            <h3 className="text-xl font-semibold mb-3" style={{ fontFamily: 'Space Grotesk' }}>
              AI Mortgage Advisor
            </h3>
            <p className="text-[#667085]">
              Get instant answers and personalized recommendations from our intelligent assistant.
            </p>
          </div>

          <div className="card-hover bg-white rounded-2xl p-8 shadow-md border border-[#E5E7EB]" data-testid="feature-fast">
            <div className="w-14 h-14 bg-[#E8F4F8] rounded-xl flex items-center justify-center mb-6">
              <Zap className="h-7 w-7 text-[#0F4C81]" />
            </div>
            <h3 className="text-xl font-semibold mb-3" style={{ fontFamily: 'Space Grotesk' }}>
              Lightning Fast
            </h3>
            <p className="text-[#667085]">
              Pre-qualify in minutes with our streamlined process. No waiting, no hassle.
            </p>
          </div>

          <div className="card-hover bg-white rounded-2xl p-8 shadow-md border border-[#E5E7EB]" data-testid="feature-transparent">
            <div className="w-14 h-14 bg-[#E8F4F8] rounded-xl flex items-center justify-center mb-6">
              <Shield className="h-7 w-7 text-[#0F4C81]" />
            </div>
            <h3 className="text-xl font-semibold mb-3" style={{ fontFamily: 'Space Grotesk' }}>
              Fully Transparent
            </h3>
            <p className="text-[#667085]">
              Understand every decision with clear explanations and no hidden fees.
            </p>
          </div>

          <div className="card-hover bg-white rounded-2xl p-8 shadow-md border border-[#E5E7EB]" data-testid="feature-rates">
            <div className="w-14 h-14 bg-[#E8F4F8] rounded-xl flex items-center justify-center mb-6">
              <TrendingUp className="h-7 w-7 text-[#0F4C81]" />
            </div>
            <h3 className="text-xl font-semibold mb-3" style={{ fontFamily: 'Space Grotesk' }}>
              Best Rates
            </h3>
            <p className="text-[#667085]">
              Compare offers from multiple lenders to find the perfect loan for you.
            </p>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="gradient-bg py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2
              className="text-3xl sm:text-4xl font-bold text-[#0A1929] mb-4"
              style={{ fontFamily: 'Space Grotesk' }}
            >
              Get Approved in 3 Simple Steps
            </h2>
            <p className="text-lg text-[#667085] max-w-2xl mx-auto">
              Our streamlined process gets you from application to approval faster than ever.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center" data-testid="step-1">
              <div className="w-16 h-16 bg-[#0F4C81] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3" style={{ fontFamily: 'Space Grotesk' }}>
                Create Your Profile
              </h3>
              <p className="text-[#667085]">
                Sign up and tell us about your financial situation in just a few minutes.
              </p>
            </div>

            <div className="text-center" data-testid="step-2">
              <div className="w-16 h-16 bg-[#0F4C81] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3" style={{ fontFamily: 'Space Grotesk' }}>
                Get Pre-Qualified
              </h3>
              <p className="text-[#667085]">
                Our AI analyzes your profile and provides instant pre-qualification results.
              </p>
            </div>

            <div className="text-center" data-testid="step-3">
              <div className="w-16 h-16 bg-[#0F4C81] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3" style={{ fontFamily: 'Space Grotesk' }}>
                Submit Your Application
              </h3>
              <p className="text-[#667085]">
                Complete your application with our guided process and get approved.
              </p>
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
            data-testid="cta-title"
          >
            Ready to Get Started?
          </h2>
          <p className="text-lg text-[#A9CCE3] mb-8 max-w-2xl mx-auto">
            Join thousands of homebuyers who have found their perfect mortgage with EasyMortgage.
          </p>
          <Link to="/signup">
            <Button
              size="lg"
              className="bg-white text-[#0F4C81] hover:bg-[#F8F9FA] rounded-full px-8 text-lg h-14"
              data-testid="cta-signup"
            >
              Start Your Application
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}