import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';

const ELLEN_AVATAR = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=faces';

export default function FirstTimeBuyerChat({ firstName, onLoginRequired }) {
  const [messages, setMessages] = useState([]);
  const [currentStep, setCurrentStep] = useState('welcome');
  const [userInputMode, setUserInputMode] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [chatState, setChatState] = useState({});
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Start with welcome message
    addMessage('assistant', `Hi there! I'm Ellen 😊. Are you looking to buy your very first home?`, ['Yes', 'No']);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addMessage = (role, content, buttons = null, inputPrompt = null) => {
    setMessages(prev => [...prev, { 
      role, 
      content, 
      buttons,
      inputPrompt,
      timestamp: new Date() 
    }]);
  };

  const handleButtonClick = (buttonText) => {
    // Add user's button choice as message
    addMessage('user', buttonText);
    
    // Process based on current step and choice
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
      case 'welcome':
        if (response === 'Yes') {
          addMessage('assistant', `That's exciting! Buying your first home is a huge milestone. I'll walk you through each step — nice and easy.`);
          setTimeout(() => {
            setCurrentStep('property_interest');
            addMessage('assistant', 'Do you already have a property in mind, or are you still exploring options?', ['Have a property', 'Still exploring']);
          }, 1000);
        } else {
          addMessage('assistant', `No worries! You can still explore our other programs like refinance or government-backed loans.`);
          setCurrentStep('end');
        }
        break;

      case 'property_interest':
        if (response === 'Have a property') {
          setChatState(prev => ({ ...prev, hasProperty: true }));
          addMessage('assistant', 'Great! That helps me narrow things down. Is it a single-family home, condo, or townhouse?', ['Single-family home', 'Condo', 'Townhouse']);
          setCurrentStep('property_type');
        } else {
          setChatState(prev => ({ ...prev, hasProperty: false }));
          addMessage('assistant', 'Awesome, no rush — I can still help you figure out what fits your budget and eligibility.');
          setTimeout(() => {
            setCurrentStep('budget_planning');
            addMessage('assistant', 'Do you have a budget range in mind for your home?', ['Yes', 'No']);
          }, 1000);
        }
        break;

      case 'property_type':
        setChatState(prev => ({ ...prev, propertyType: response }));
        addMessage('assistant', 'Perfect, that gives me a clear picture.');
        setTimeout(() => {
          setCurrentStep('budget_planning');
          addMessage('assistant', 'Do you have a budget range in mind for your home?', ['Yes', 'No']);
        }, 1000);
        break;

      case 'budget_planning':
        if (response === 'Yes') {
          addMessage('assistant', 'Got it! What\'s your estimated budget range?', null, 'Enter amount');
          setUserInputMode(true);
          setCurrentStep('budget_input');
        } else {
          addMessage('assistant', 'No problem! Would you like me to estimate a comfortable budget based on your income and credit score?', ['Yes', 'No']);
          setCurrentStep('budget_estimate');
        }
        break;

      case 'budget_estimate':
        if (response === 'Yes') {
          addMessage('assistant', 'Great — could you share your approximate monthly income?', null, 'Enter monthly income');
          setUserInputMode(true);
          setCurrentStep('income_input');
        } else {
          addMessage('assistant', 'Alright, you can still explore homes, and we\'ll help you estimate when you\'re ready.');
          setTimeout(() => {
            setCurrentStep('down_payment');
            addMessage('assistant', 'Do you already have a down payment saved?', ['Yes', 'No']);
          }, 1000);
        }
        break;

      case 'credit_check':
        if (response === 'Yes') {
          addMessage('assistant', 'Awesome. That gives me enough to calculate a safe budget range.');
          setTimeout(() => {
            setCurrentStep('down_payment');
            addMessage('assistant', 'Do you already have a down payment saved?', ['Yes', 'No']);
          }, 1000);
        } else {
          addMessage('assistant', 'No problem. I can help you check your credit score securely if you\'d like. Want to do that?', ['Yes', 'No']);
          setCurrentStep('credit_score_help');
        }
        break;

      case 'credit_score_help':
        if (response === 'Yes') {
          addMessage('assistant', 'Perfect! I\'ll connect you to our secure checker — it\'ll just take a moment.');
        } else {
          addMessage('assistant', 'That\'s fine! You can add it later; I\'ll use average credit data for now.');
        }
        setTimeout(() => {
          setCurrentStep('down_payment');
          addMessage('assistant', 'Do you already have a down payment saved?', ['Yes', 'No']);
        }, 1000);
        break;

      case 'down_payment':
        if (response === 'Yes') {
          addMessage('assistant', 'Great! What percentage of the home price do you plan to put down?', null, 'Enter percentage');
          setUserInputMode(true);
          setCurrentStep('down_payment_input');
        } else {
          addMessage('assistant', 'That\'s totally fine. Would you like me to show you some down payment assistance programs for first-time buyers?', ['Yes', 'No']);
          setCurrentStep('down_payment_assistance');
        }
        break;

      case 'down_payment_assistance':
        if (response === 'Yes') {
          addMessage('assistant', 'Perfect! We\'ll go over the most common ones available in your state.');
        } else {
          addMessage('assistant', 'No problem — we\'ll continue with other financing options.');
        }
        setTimeout(() => {
          setCurrentStep('loan_preferences');
          addMessage('assistant', 'Do you already know what type of loan you\'re considering — like FHA, Conventional, or VA?', ['Yes', 'No']);
        }, 1000);
        break;

      case 'loan_preferences':
        if (response === 'Yes') {
          addMessage('assistant', 'Perfect, that\'ll help narrow the best rate options for you.');
        } else {
          addMessage('assistant', 'No problem! I can explain each one briefly so you can decide later.');
        }
        setTimeout(() => {
          addMessage('assistant', 'When do you plan to purchase your home?', ['0-3 months', '3-6 months', '6+ months']);
          setCurrentStep('timeline');
        }, 1000);
        break;

      case 'timeline':
        setChatState(prev => ({ ...prev, timeline: response }));
        addMessage('assistant', 'Got it! That helps me understand your readiness and program availability.');
        setTimeout(() => {
          setCurrentStep('pre_approval');
          addMessage('assistant', 'Would you like to get pre-approved for your mortgage today?', ['Yes', 'No']);
        }, 1000);
        break;

      case 'pre_approval':
        if (response === 'Yes') {
          addMessage('assistant', 'Great choice! To start pre-approval, I\'ll need a few quick details — ID verification, proof of income, and consent to check credit. Ready to begin?', ['Yes', 'No']);
          setCurrentStep('pre_approval_ready');
        } else {
          addMessage('assistant', 'That\'s totally fine! Would you like me to keep you updated with homebuyer tips and first-time buyer programs?', ['Yes', 'No']);
          setCurrentStep('updates');
        }
        break;

      case 'pre_approval_ready':
        if (response === 'Yes') {
          // Trigger login requirement before pre-approval
          addMessage('assistant', 'Before we continue, please log in or create an account so I can save your progress and personalized results.', ['Login', 'Create Account']);
          setCurrentStep('login_required');
        } else {
          addMessage('assistant', 'Okay, you can always come back when you\'re ready.');
          setTimeout(() => {
            showFinalMessage();
          }, 1000);
        }
        break;

      case 'login_required':
        if (response === 'Login' || response === 'Create Account') {
          onLoginRequired(response.toLowerCase().replace(' ', '-'));
        }
        break;

      case 'updates':
        if (response === 'Yes') {
          addMessage('assistant', 'Perfect! I\'ll send you helpful updates to your email.');
        } else {
          addMessage('assistant', 'Alright! You can revisit anytime — I\'ll be right here.');
        }
        setTimeout(() => {
          showFinalMessage();
        }, 1000);
        break;

      default:
        break;
    }
  };

  const processTextInput = (step, input) => {
    switch(step) {
      case 'budget_input':
        setChatState(prev => ({ ...prev, budget: input }));
        addMessage('assistant', 'Perfect, that helps me estimate your potential loan size.');
        setTimeout(() => {
          setCurrentStep('down_payment');
          addMessage('assistant', 'Do you already have a down payment saved?', ['Yes', 'No']);
        }, 1000);
        break;

      case 'income_input':
        setChatState(prev => ({ ...prev, monthlyIncome: input }));
        addMessage('assistant', 'Thanks! And do you know your current credit score range?', ['Yes', 'No']);
        setCurrentStep('credit_check');
        break;

      case 'down_payment_input':
        setChatState(prev => ({ ...prev, downPaymentPercent: input }));
        addMessage('assistant', 'Nice — that gives us more flexibility with loan options.');
        setTimeout(() => {
          setCurrentStep('loan_preferences');
          addMessage('assistant', 'Do you already know what type of loan you\'re considering — like FHA, Conventional, or VA?', ['Yes', 'No']);
        }, 1000);
        break;

      default:
        break;
    }
  };

  const showFinalMessage = () => {
    addMessage('assistant', 'All set! 🎉 Based on your info, I\'ve outlined some programs that match your situation. You can view them now or come back anytime to continue your application.', ['View My Matches', 'Save & Exit']);
    setCurrentStep('wrap_up');
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}>
            <div className={`max-w-[80%] ${msg.role === 'user' ? '' : 'flex items-start space-x-3'}`}>
              {msg.role === 'assistant' && (
                <img
                  src={ELLEN_AVATAR}
                  alt="Ellen"
                  className="w-10 h-10 rounded-full flex-shrink-0 border-2 border-[#A9CCE3]"
                />
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
                        className="bg-white border-2 border-[#0F4C81] text-[#0F4C81] hover:bg-[#0F4C81] hover:text-white rounded-full"
                        data-testid={`button-${button.toLowerCase().replace(/\s+/g, '-')}`}
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

      {/* Input Area - Only show when user input mode */}
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
