import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';

const ELLEN_AVATAR = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=faces';

export default function JumboLoansChat({ firstName, onLoginRequired }) {
  const [messages, setMessages] = useState([]);
  const [currentStep, setCurrentStep] = useState('greeting');
  const [userInputMode, setUserInputMode] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [chatState, setChatState] = useState({});
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Start with greeting
    addMessage('assistant', `Hi ${firstName} 👋, welcome! Are you looking to explore Jumbo Loan options for purchasing a high-value home?`, ['Yes', 'No']);
  }, [firstName]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addMessage = (role, content, buttons = null) => {
    setMessages(prev => [...prev, { role, content, buttons, timestamp: new Date() }]);
  };

  const handleButtonClick = (buttonText) => {
    addMessage('user', buttonText);
    processUserResponse(currentStep, buttonText);
  };

  const handleTextInput = () => {
    if (!inputValue.trim()) return;
    addMessage('user', inputValue);
    processTextInput(currentStep, inputValue);
    setInputValue('');
    setUserInputMode(false);
  };

  const processUserResponse = (step, response) => {
    switch(step) {
      case 'greeting':
        if (response === 'Yes') {
          addMessage('assistant', 'Perfect! Let\'s make sure this type of loan is the right fit for your goals.');
          setTimeout(() => {
            setCurrentStep('property_type');
            addMessage('assistant', 'Are you purchasing a home that\'s priced above the conforming loan limit in your area?', ['Yes', 'No']);
          }, 1000);
        } else {
          addMessage('assistant', `No problem, ${firstName}. Would you like to look into another mortgage option instead?`, ['Yes', 'No']);
          setCurrentStep('other_options');
        }
        break;

      case 'other_options':
        if (response === 'Yes') {
          addMessage('assistant', 'I can help with that! Which one would you like to explore — First-Time Buyer, Government-Backed Loan, or Refinance?', ['First-Time Buyer', 'Government-Backed Loan', 'Refinance']);
          setCurrentStep('redirect_service');
        } else {
          addMessage('assistant', 'That\'s okay! You can always come back when you\'re ready — I\'ll save your preferences.');
          setCurrentStep('end');
        }
        break;

      case 'redirect_service':
        addMessage('assistant', `Great! Redirecting you to ${response} options...`);
        setCurrentStep('end');
        break;

      case 'property_type':
        if (response === 'Yes') {
          addMessage('assistant', 'Got it. That usually means a property over $750,000, depending on location. Let\'s confirm a few details.');
          setTimeout(() => {
            setCurrentStep('budget');
            addMessage('assistant', 'Do you already know your target price range?', ['Yes', 'No']);
          }, 1000);
        } else {
          addMessage('assistant', 'Then you might not need a Jumbo Loan. Would you like to see conventional mortgage options instead?', ['Yes', 'No']);
          setCurrentStep('conventional_option');
        }
        break;

      case 'conventional_option':
        if (response === 'Yes') {
          addMessage('assistant', 'Great! I\'ll take you to the First-Time Buyer or Conventional flow to explore your options.');
          setCurrentStep('end');
        } else {
          addMessage('assistant', 'No problem! We can still explore Jumbo eligibility — it\'s good to know all your options.');
          setTimeout(() => {
            setCurrentStep('budget');
            addMessage('assistant', 'Do you already know your target price range?', ['Yes', 'No']);
          }, 1000);
        }
        break;

      case 'budget':
        if (response === 'Yes') {
          addMessage('assistant', 'Awesome! How much are you planning to spend on your new home?', null);
          setUserInputMode(true);
          setCurrentStep('budget_input');
        } else {
          addMessage('assistant', 'No worries — I can estimate a comfortable budget for you. Do you want me to do that?', ['Yes', 'No']);
          setCurrentStep('budget_estimate');
        }
        break;

      case 'budget_estimate':
        if (response === 'Yes') {
          addMessage('assistant', 'Perfect. I\'ll need your approximate income and credit score to do that. Ready to share those?', ['Yes', 'No']);
          setCurrentStep('budget_estimate_ready');
        } else {
          addMessage('assistant', 'Okay, we\'ll skip the estimation and move on.');
          setTimeout(() => {
            setCurrentStep('credit_profile');
            addMessage('assistant', 'Would you say your credit score is 700 or higher?', ['Yes', 'No']);
          }, 1000);
        }
        break;

      case 'budget_estimate_ready':
        if (response === 'Yes') {
          setTimeout(() => {
            setCurrentStep('credit_profile');
            addMessage('assistant', 'Would you say your credit score is 700 or higher?', ['Yes', 'No']);
          }, 1000);
        } else {
          addMessage('assistant', 'That\'s fine! I\'ll keep your budget open-ended for now and show you flexible options later.');
          setTimeout(() => {
            setCurrentStep('credit_profile');
            addMessage('assistant', 'Would you say your credit score is 700 or higher?', ['Yes', 'No']);
          }, 1000);
        }
        break;

      case 'credit_profile':
        if (response === 'Yes') {
          addMessage('assistant', 'Excellent — that\'s great for Jumbo Loan qualification.');
          setTimeout(() => {
            setCurrentStep('income_check');
            addMessage('assistant', 'Do you currently have verifiable income or substantial liquid assets?', ['Yes', 'No']);
          }, 1000);
        } else {
          addMessage('assistant', 'That\'s totally fine. Jumbo loans often start at 700+, but there are exceptions. Would you like me to show how to boost your score or check alternative lenders?', ['Yes', 'No']);
          setCurrentStep('credit_boost');
        }
        break;

      case 'credit_boost':
        if (response === 'Yes') {
          addMessage('assistant', 'I\'ll send you a short guide and lender options that work with mid-level scores.');
        } else {
          addMessage('assistant', 'Alright, I\'ll just note that and keep your file flexible.');
        }
        setTimeout(() => {
          setCurrentStep('income_check');
          addMessage('assistant', 'Do you currently have verifiable income or substantial liquid assets?', ['Yes', 'No']);
        }, 1000);
        break;

      case 'income_check':
        if (response === 'Yes') {
          addMessage('assistant', 'Perfect — lenders will love that stability. Let\'s move to down payment details.');
          setTimeout(() => {
            setCurrentStep('down_payment');
            addMessage('assistant', 'Do you already have a down payment saved?', ['Yes', 'No']);
          }, 1000);
        } else {
          addMessage('assistant', 'No worries — there are programs that use asset-based verification or co-borrowers. Do you want to explore those options?', ['Yes', 'No']);
          setCurrentStep('income_alternatives');
        }
        break;

      case 'income_alternatives':
        if (response === 'Yes') {
          addMessage('assistant', 'I\'ll share a summary of flexible income verification programs once we\'re done here.');
        } else {
          addMessage('assistant', 'Okay, I\'ll note that. Let\'s still review your down payment options.');
        }
        setTimeout(() => {
          setCurrentStep('down_payment');
          addMessage('assistant', 'Do you already have a down payment saved?', ['Yes', 'No']);
        }, 1000);
        break;

      case 'down_payment':
        if (response === 'Yes') {
          addMessage('assistant', 'Awesome! Are you planning to put down at least 10–20% of the home\'s value?', ['Yes', 'No']);
          setCurrentStep('down_payment_amount');
        } else {
          addMessage('assistant', 'No problem. We can help you plan toward a down payment. Would you like to connect with our financial advisor?', ['Yes', 'No']);
          setCurrentStep('down_payment_advisor');
        }
        break;

      case 'down_payment_amount':
        if (response === 'Yes') {
          addMessage('assistant', 'Fantastic — that\'s perfect for Jumbo Loan standards.');
          setTimeout(() => {
            setCurrentStep('property_intent');
            addMessage('assistant', 'Is this home going to be your primary residence?', ['Yes', 'No']);
          }, 1000);
        } else {
          addMessage('assistant', 'That\'s okay — you might still qualify, but we\'ll explore options that require higher rates or secondary financing. Want me to explain?', ['Yes', 'No']);
          setCurrentStep('down_payment_explain');
        }
        break;

      case 'down_payment_explain':
        if (response === 'Yes') {
          addMessage('assistant', 'I\'ll share examples of secondary loan combinations to help lower your total cost.');
        } else {
          addMessage('assistant', 'Alright, I\'ll mark your down payment as flexible for now.');
        }
        setTimeout(() => {
          setCurrentStep('property_intent');
          addMessage('assistant', 'Is this home going to be your primary residence?', ['Yes', 'No']);
        }, 1000);
        break;

      case 'down_payment_advisor':
        if (response === 'Yes') {
          addMessage('assistant', 'Perfect — I\'ll schedule a free consultation link for you after this chat.');
        } else {
          addMessage('assistant', 'Got it. We\'ll move ahead with estimated assumptions.');
        }
        setTimeout(() => {
          setCurrentStep('property_intent');
          addMessage('assistant', 'Is this home going to be your primary residence?', ['Yes', 'No']);
        }, 1000);
        break;

      case 'property_intent':
        if (response === 'Yes') {
          setChatState(prev => ({ ...prev, propertyType: 'Primary' }));
          addMessage('assistant', 'Perfect — that usually means better terms and lower rates.');
          setTimeout(() => {
            setCurrentStep('location');
            addMessage('assistant', 'Which state or city are you planning to buy in?', null);
            setUserInputMode(true);
          }, 1000);
        } else {
          addMessage('assistant', 'Got it. Is it a second home or an investment property?', ['Second Home', 'Investment']);
          setCurrentStep('property_secondary');
        }
        break;

      case 'property_secondary':
        setChatState(prev => ({ ...prev, propertyType: response }));
        if (response === 'Second Home') {
          addMessage('assistant', 'Alright — we\'ll mark it as secondary use.');
        } else {
          addMessage('assistant', 'Okay — investment Jumbo Loans have stricter terms, but you can still qualify with solid credit.');
        }
        setTimeout(() => {
          setCurrentStep('location');
          addMessage('assistant', 'Which state or city are you planning to buy in?', null);
          setUserInputMode(true);
        }, 1000);
        break;

      case 'loan_term':
        setChatState(prev => ({ ...prev, rateType: response }));
        if (response === 'Fixed') {
          addMessage('assistant', 'Stable choice — predictable payments, great for long-term planning.');
          setTimeout(() => {
            setCurrentStep('rate_estimate');
            addMessage('assistant', 'Would you like to get a rate estimate based on your profile?', ['Yes', 'No']);
          }, 1000);
        } else {
          addMessage('assistant', 'Got it — adjustable loans can start lower, but may rise over time. Want me to compare both side-by-side?', ['Yes', 'No']);
          setCurrentStep('rate_compare');
        }
        break;

      case 'rate_compare':
        if (response === 'Yes') {
          addMessage('assistant', 'I\'ll prepare a comparison summary for you.');
        } else {
          addMessage('assistant', 'No worries, I\'ll just show you the adjustable estimates.');
        }
        setTimeout(() => {
          setCurrentStep('rate_estimate');
          addMessage('assistant', 'Would you like to get a rate estimate based on your profile?', ['Yes', 'No']);
        }, 1000);
        break;

      case 'rate_estimate':
        if (response === 'Yes') {
          addMessage('assistant', 'Great! Please sign in or create an account to generate your personalized rate.', ['Log in', 'Create account']);
          setCurrentStep('login_trigger');
        } else {
          addMessage('assistant', 'That\'s okay — I can still give you a summary of your eligibility right now.');
          setTimeout(() => showSummary(), 1000);
        }
        break;

      case 'login_trigger':
        if (response === 'Log in' || response === 'Create account') {
          onLoginRequired(response.toLowerCase().replace(' ', '-'));
        }
        break;

      case 'summary_save':
        if (response === 'Yes') {
          addMessage('assistant', 'Great! Please share your email address so I can send your summary.', null);
          setUserInputMode(true);
          setCurrentStep('email_input');
        } else {
          addMessage('assistant', 'No problem — your preferences are saved securely for when you\'re ready to continue.');
          setCurrentStep('end');
        }
        break;

      default:
        break;
    }
  };

  const processTextInput = (step, input) => {
    switch(step) {
      case 'budget_input':
        setChatState(prev => ({ ...prev, budget: input }));
        addMessage('assistant', `Thanks, ${firstName}. That helps tailor the loan amount we'll estimate later.`);
        setTimeout(() => {
          setCurrentStep('credit_profile');
          addMessage('assistant', 'Would you say your credit score is 700 or higher?', ['Yes', 'No']);
        }, 1000);
        break;

      case 'location':
        setChatState(prev => ({ ...prev, location: input }));
        addMessage('assistant', 'Thanks! That helps me confirm your local loan limits and property tax factors.');
        setTimeout(() => {
          setCurrentStep('loan_term');
          addMessage('assistant', 'Would you prefer a fixed-rate or adjustable-rate loan?', ['Fixed', 'Adjustable']);
        }, 1000);
        break;

      case 'email_input':
        addMessage('assistant', 'Perfect! I\'ll send your Jumbo Loan summary to that email shortly.');
        setCurrentStep('end');
        break;

      default:
        break;
    }
  };

  const showSummary = () => {
    const summary = `Here's a quick summary of your Jumbo Loan profile, ${firstName}:

• Loan Type: Jumbo (Purchase)
• Minimum Down Payment: 10–20%
• Credit Score: Ideally 700+
• Income/Asset Verification: Required
• Rate Type: ${chatState.rateType || 'Not specified'}
• Property Type: ${chatState.propertyType || 'Not specified'}`;

    addMessage('assistant', summary);
    setTimeout(() => {
      addMessage('assistant', 'Would you like me to email or save your loan profile for later access?', ['Yes', 'No']);
      setCurrentStep('summary_save');
    }, 1000);
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}>
            <div className={`max-w-[80%] ${msg.role === 'user' ? '' : 'flex items-start space-x-3'}`}>
              {msg.role === 'assistant' && (
                <img src={ELLEN_AVATAR} alt="Ellen" className="w-10 h-10 rounded-full flex-shrink-0 border-2 border-[#A9CCE3]" />
              )}
              <div>
                <div className={`p-4 rounded-2xl ${msg.role === 'user' ? 'bg-[#0F4C81] text-white' : 'bg-[#F8F9FA] text-[#0A1929]'}`}>
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </div>
                {msg.buttons && msg.buttons.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {msg.buttons.map((button, i) => (
                      <Button
                        key={i}
                        onClick={() => handleButtonClick(button)}
                        className="bg-white border-2 border-[#0F4C81] text-[#0F4C81] hover:bg-[#0F4C81] hover:text-white rounded-full text-sm"
                        data-testid={`button-${button.toLowerCase().replace(/[\s/—–]+/g, '-')}`}
                      >
                        {button}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      {userInputMode && (
        <div className="p-6 border-t border-[#E5E7EB] bg-white">
          <div className="flex space-x-4">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleTextInput()}
              placeholder="Type your answer..."
              className="flex-1 h-14 border-[#E5E7EB] focus:border-[#0F4C81] text-base"
              autoFocus
              data-testid="text-input"
            />
            <Button
              onClick={handleTextInput}
              disabled={!inputValue.trim()}
              className="h-14 px-8 bg-[#0F4C81] hover:bg-[#0A3A61] text-white rounded-full"
              data-testid="send-button"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
