import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle, Home, TrendingUp, Building, DollarSign } from 'lucide-react';
import Footer from '@/components/Footer';

export default function ServiceDetailPage() {
  const navigate = useNavigate();
  const { serviceId } = useParams();

  const serviceContent = {
    'first-time-buyer': {
      title: 'First-Time Buyer Program',
      icon: Home,
      overview: 'Buying your first home is an exciting milestone! Our First-Time Buyer Program offers special financing options, lower down payment requirements, and educational resources to guide you through every step of the home buying journey.',
      benefits: [
        'Down payments as low as 3% of purchase price',
        'Special interest rates for first-time buyers',
        'Access to down payment assistance programs',
        'Step-by-step guidance from application to closing',
        'Educational resources and homebuyer workshops',
        'Flexible credit requirements and qualifying options'
      ],
      scenarios: [
        {
          question: 'What qualifies me as a first-time buyer?',
          answer: 'Generally, you\'re considered a first-time buyer if you haven\'t owned a home in the past 3 years. Some programs may have different criteria, but we\'ll help you determine eligibility.'
        },
        {
          question: 'How much do I need for a down payment?',
          answer: 'With our First-Time Buyer Program, you can put down as little as 3% of the home price. We also connect you with down payment assistance programs that may cover some or all of your down payment.'
        },
        {
          question: 'What if my credit isn\'t perfect?',
          answer: 'That\'s okay! Many first-time buyer programs have flexible credit requirements. We\'ll work with you to find the best option for your situation and help you improve your credit if needed.'
        }
      ]
    },
    'government-backed': {
      title: 'Government-Backed Loans',
      icon: Building,
      overview: 'Government-backed loans offer unique benefits for eligible buyers, including low or no down payment options, flexible credit requirements, and competitive interest rates. Explore FHA, VA, and USDA loan programs designed to make homeownership accessible.',
      benefits: [
        'FHA loans with as low as 3.5% down payment',
        'VA loans with $0 down for eligible veterans and service members',
        'USDA loans with $0 down for eligible rural properties',
        'More flexible credit score requirements',
        'Lower PMI costs or no PMI (VA loans)',
        'Competitive interest rates backed by the government'
      ],
      scenarios: [
        {
          question: 'What\'s the difference between FHA, VA, and USDA loans?',
          answer: 'FHA loans are for buyers with lower credit scores or down payments (3.5% minimum). VA loans are for veterans and military members with $0 down and no PMI. USDA loans are for rural properties with $0 down and income limits.'
        },
        {
          question: 'Do I qualify for a VA loan?',
          answer: 'VA loans are available to active duty service members, veterans, certain National Guard and Reserve members, and eligible surviving spouses. You\'ll need a Certificate of Eligibility (COE) which we can help you obtain.'
        },
        {
          question: 'What are the income limits for USDA loans?',
          answer: 'USDA income limits vary by location and household size. Generally, your household income must be at or below 115% of the median income for your area. We can help check eligibility for your specific location.'
        }
      ]
    },
    'jumbo-loans': {
      title: 'Jumbo Loans',
      icon: TrendingUp,
      overview: 'Jumbo loans are designed for high-value properties that exceed conforming loan limits. Perfect for luxury homes, high-cost areas, or investment properties, jumbo loans offer competitive rates with tailored terms for qualified borrowers.',
      benefits: [
        'Finance properties above $766,550 (2024 conforming limit)',
        'Competitive rates for high-value purchases',
        'Fixed and adjustable-rate options available',
        'Flexible terms: 10, 15, 20, or 30-year mortgages',
        'Finance primary residences, second homes, or investment properties',
        'Customized solutions for high-net-worth individuals'
      ],
      scenarios: [
        {
          question: 'What credit score do I need for a jumbo loan?',
          answer: 'Most lenders require a minimum credit score of 700 for jumbo loans, though some may accept 680 with compensating factors. Higher scores typically result in better rates and terms.'
        },
        {
          question: 'How much down payment is required?',
          answer: 'Jumbo loans typically require 10-20% down payment, depending on the property type and your financial profile. Primary residences may qualify with 10-15% down, while investment properties usually require 20-30%.'
        },
        {
          question: 'What are the income and asset requirements?',
          answer: 'Lenders look for stable, verifiable income and substantial liquid assets (typically 6-12 months of reserves). Self-employed borrowers may need additional documentation. Asset-based qualification options are also available.'
        }
      ]
    },
    purchase: {
      title: 'Purchase a New Home',
      icon: Home,
      overview: 'Ready to buy your dream home? Our purchase mortgage service helps first-time buyers and experienced homeowners secure financing with competitive rates and flexible terms.',
      benefits: [
        'Competitive interest rates starting from 5.75%',
        'Down payments as low as 3%',
        'Pre-approval in minutes, not days',
        'Multiple loan options: Conventional, FHA, VA, USDA',
        'Expert guidance throughout the entire process',
        'No hidden fees or surprises'
      ],
      scenarios: [
        {
          question: 'What if I\'m a first-time buyer?',
          answer: 'We offer special programs for first-time buyers with lower down payment requirements and educational resources to guide you through the process.'
        },
        {
          question: 'How much can I afford?',
          answer: 'Our pre-qualification tool will analyze your income, debts, and credit to give you an accurate budget range. Most buyers qualify for 3-5x their annual income.'
        },
        {
          question: 'What documents do I need?',
          answer: 'Typically: pay stubs, W-2s, bank statements, tax returns, and photo ID. We\'ll guide you through document collection step by step.'
        }
      ]
    },
    refinance: {
      title: 'Refinance Your Mortgage',
      icon: TrendingUp,
      overview: 'Lower your monthly payments, shorten your loan term, or access your home\'s equity. Refinancing can save you thousands over the life of your loan.',
      benefits: [
        'Reduce monthly payments by up to 30%',
        'Switch from adjustable to fixed-rate mortgages',
        'Shorten loan term to build equity faster',
        'Cash-out refinancing for home improvements or debt consolidation',
        'No closing costs options available',
        'Rate-and-term or cash-out refinancing'
      ],
      scenarios: [
        {
          question: 'When should I refinance?',
          answer: 'Consider refinancing when rates drop at least 0.5-1% below your current rate, or when you want to change loan terms.'
        },
        {
          question: 'What are the costs?',
          answer: 'Typical closing costs range from 2-5% of the loan amount. We offer no-closing-cost options where costs are rolled into the loan.'
        },
        {
          question: 'How long does it take?',
          answer: 'From application to closing, most refinances complete in 30-45 days. Our streamlined process can be even faster.'
        }
      ]
    },
    investment: {
      title: 'Investment Property Loans',
      icon: Building,
      overview: 'Build wealth through real estate investing. Finance rental properties, multi-family homes, or commercial real estate with specialized investment property loans.',
      benefits: [
        'Finance up to 10 properties',
        'Rental income counts toward qualification',
        'Competitive rates for investors',
        'Options for single-family, multi-family, and commercial',
        'Portfolio loans for multiple properties',
        'Cash-out refinancing for additional investments'
      ],
      scenarios: [
        {
          question: 'What\'s the down payment for investment properties?',
          answer: 'Typically 15-25% for investment properties, depending on credit score and rental income projections.'
        },
        {
          question: 'Can I use rental income to qualify?',
          answer: 'Yes! Expected rental income can be used to offset the property\'s mortgage payment in our calculations.'
        },
        {
          question: 'What types of properties qualify?',
          answer: 'Single-family homes, 2-4 unit properties, condos, and certain commercial properties all qualify for investment loans.'
        }
      ]
    },
    'home-equity': {
      title: 'Home Equity Loans',
      icon: DollarSign,
      overview: 'Tap into your home\'s equity for major expenses, home improvements, debt consolidation, or education costs. Get cash while keeping your first mortgage intact.',
      benefits: [
        'Access up to 85% of your home equity',
        'Lower rates than credit cards or personal loans',
        'Fixed or variable rate options',
        'Tax-deductible interest in many cases',
        'No restrictions on how you use the funds',
        'Quick approval and funding process'
      ],
      scenarios: [
        {
          question: 'How much equity can I borrow?',
          answer: 'Most lenders allow you to borrow up to 85% of your home\'s value minus your existing mortgage balance.'
        },
        {
          question: 'What\'s the difference between HELOC and home equity loan?',
          answer: 'A home equity loan provides a lump sum with fixed payments. A HELOC is a line of credit you can draw from as needed with variable rates.'
        },
        {
          question: 'What can I use the money for?',
          answer: 'Anything! Common uses include home renovations, debt consolidation, education expenses, or emergency funds.'
        }
      ]
    },
    calculator: {
      title: 'Mortgage Calculator',
      icon: TrendingUp,
      overview: 'Get instant estimates on mortgage rates, monthly payments, and affordability. Our calculator uses real-time data to give you accurate projections.',
      benefits: [
        'Instant rate estimates',
        'Compare different loan scenarios',
        'Calculate affordability based on income',
        'See total cost over loan lifetime',
        'Factor in taxes, insurance, and PMI',
        'Save and share calculations'
      ],
      scenarios: [
        {
          question: 'How accurate are the estimates?',
          answer: 'Our calculator uses current market rates and your inputs to provide accurate estimates. Final rates depend on credit score and full application review.'
        },
        {
          question: 'What factors affect my rate?',
          answer: 'Credit score, down payment amount, loan type, property location, and current market conditions all impact your rate.'
        },
        {
          question: 'Should I include PMI in my calculation?',
          answer: 'Yes, if your down payment is less than 20%. PMI typically costs 0.5-1% of the loan amount annually.'
        }
      ]
    }
  };

  const service = serviceContent[serviceId] || serviceContent.purchase;
  const Icon = service.icon;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8F9FA] to-white">
      {/* Header */}
      <div className="bg-white border-b border-[#E5E7EB] sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 text-[#667085] hover:text-[#0F4C81]"
              data-testid="back-to-home"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </Button>
            
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-[#0F4C81] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">M</span>
              </div>
              <span className="text-xl font-bold text-[#0F4C81]" style={{ fontFamily: 'Space Grotesk' }}>
                MortsGage
              </span>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                onClick={() => navigate('/login')}
                className="text-[#0F4C81]"
              >
                Log In
              </Button>
              <Button
                onClick={() => navigate('/signup')}
                className="bg-[#0F4C81] hover:bg-[#0A3A61] text-white rounded-full"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#0F4C81] to-[#2A6F9E] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center mb-6">
            <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center">
              <Icon className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-6" style={{ fontFamily: 'Space Grotesk' }}>
            {service.title}
          </h1>
          <p className="text-xl text-center text-[#A9CCE3] max-w-3xl mx-auto mb-8">
            {service.overview}
          </p>
          <div className="flex justify-center">
            <Button
              size="lg"
              onClick={() => navigate('/name-collection', { state: { serviceType: serviceId } })}
              className="bg-white text-[#0F4C81] hover:bg-[#F8F9FA] rounded-full px-12 text-lg h-16"
              data-testid="get-started-btn"
            >
              Get Started
            </Button>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-[#0A1929] mb-8 text-center" style={{ fontFamily: 'Space Grotesk' }}>
          Key Benefits
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {service.benefits.map((benefit, index) => (
            <div key={index} className="flex items-start space-x-3 p-6 bg-white rounded-2xl shadow-md border border-[#E5E7EB]">
              <CheckCircle className="h-6 w-6 text-[#10B981] flex-shrink-0 mt-1" />
              <p className="text-[#667085]">{benefit}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-[#F8F9FA] py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#0A1929] mb-8 text-center" style={{ fontFamily: 'Space Grotesk' }}>
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {service.scenarios.map((scenario, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-md border border-[#E5E7EB]">
                <h3 className="text-lg font-semibold text-[#0A1929] mb-3">
                  {scenario.question}
                </h3>
                <p className="text-[#667085]">{scenario.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="bg-[#0F4C81] rounded-3xl p-12 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6" style={{ fontFamily: 'Space Grotesk' }}>
            Ready to Get Started?
          </h2>
          <p className="text-lg text-[#A9CCE3] mb-8 max-w-2xl mx-auto">
            Talk to Ellen and get personalized guidance for your {service.title.toLowerCase()}.
          </p>
          <Button
            size="lg"
            onClick={() => navigate('/name-collection', { state: { serviceType: serviceId } })}
            className="bg-white text-[#0F4C81] hover:bg-[#F8F9FA] rounded-full px-12 text-lg h-16"
            data-testid="cta-get-started"
          >
            Get Started
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
