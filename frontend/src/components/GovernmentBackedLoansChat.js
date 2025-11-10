import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';

const ELLEN_AVATAR = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=faces';

export default function GovernmentBackedLoansChat({ firstName, onLoginRequired }) {
  const [messages, setMessages] = useState([]);
  const [currentStep, setCurrentStep] = useState('greeting');
  const [userInputMode, setUserInputMode] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [chatState, setChatState] = useState({});
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Start with greeting
    addMessage('assistant', `Hi ${firstName} 👋 — I can help with government-backed loans like FHA, VA, or USDA. Are you interested in a government-backed loan today?`, ['Yes', 'No']);
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
          addMessage('assistant', 'Awesome — I\'ll walk you through quick eligibility checks and options. Quick note: I\'ll ask a few short questions to find the best fit.');
          setTimeout(() => {
            setCurrentStep('purpose');
            addMessage('assistant', 'Is this for a purchase or for refinancing an existing mortgage?', ['Purchase', 'Refinance', 'Not sure']);
          }, 1000);
        } else {
          addMessage('assistant', 'No problem! Would you like to explore our other mortgage services instead? (You can always come back to government-backed loans.)', ['Show other services', 'Not right now']);
          setCurrentStep('other_services');
        }
        break;

      case 'other_services':
        if (response === 'Show other services') {
          addMessage('assistant', 'Here are the other services — pick one when you\'re ready.');
          setCurrentStep('end');
        } else {
          addMessage('assistant', 'Alright — you can return anytime. I\'ll be here.');
          setCurrentStep('end');
        }
        break;

      case 'purpose':
        setChatState(prev => ({ ...prev, purpose: response }));
        if (response === 'Purchase') {
          addMessage('assistant', 'Great — government programs often help buyers with lower down payments. Let\'s check eligibility.');
        } else if (response === 'Refinance') {
          addMessage('assistant', 'Got it — we can also check if a government-backed refinance (if available) or other refinance options are a better fit. Want to continue?');
        } else {
          addMessage('assistant', 'No worries — I\'ll ask a few questions and then suggest the best path.');
        }
        setTimeout(() => {
          setCurrentStep('program_selection');
          addMessage('assistant', 'Do you have a specific program in mind — FHA, VA, or USDA — or would you like me to recommend the best one?', ['FHA', 'VA', 'USDA', 'Not sure / Recommend']);
        }, 1000);
        break;

      case 'program_selection':
        setChatState(prev => ({ ...prev, program: response }));
        if (response === 'FHA') {
          addMessage('assistant', 'FHA loans often allow low down payments (as low as 3.5%) and are friendly to buyers with lower credit scores. Shall I check your likely FHA eligibility?', ['Yes', 'No']);
          setCurrentStep('fha_check');
        } else if (response === 'VA') {
          addMessage('assistant', 'VA loans are for eligible veterans and active military members — often no down payment and no PMI. Do you or a family member have military service?', ['Yes', 'No']);
          setCurrentStep('va_check');
        } else if (response === 'USDA') {
          addMessage('assistant', 'USDA loans are for eligible rural properties and often have no down payment but have income limits. Is the property in a rural area or small town?', ['Yes', 'No']);
          setCurrentStep('usda_check');
        } else {
          addMessage('assistant', 'No problem — I\'ll recommend the best option based on a few quick eligibility checks. Shall we proceed?', ['Yes', 'No']);
          setCurrentStep('eligibility_consent');
        }
        break;

      case 'fha_check':
      case 'va_check':
      case 'usda_check':
        if (response === 'Yes') {
          setCurrentStep('eligibility_consent');
          addMessage('assistant', 'Can I ask a couple of short questions about your income and credit so I can recommend the right program?', ['Yes', 'No']);
        } else {
          addMessage('assistant', 'Okay — we can still show general program info. Would you like general details or to continue without checks?', ['Show general details', 'Continue without checks']);
          setCurrentStep('general_info');
        }
        break;

      case 'general_info':
        if (response === 'Show general details') {
          addMessage('assistant', 'I\'ll show basic program overviews (FHA, VA, USDA) so you can learn more.');
          setCurrentStep('end');
        } else {
          addMessage('assistant', 'Alright — I\'ll proceed using general rules and follow-up questions.');
          setTimeout(() => {
            setCurrentStep('property_type');
            addMessage('assistant', 'Is the property a single-family home, condo, or multi-unit property (2–4 units)?', ['Single-family', 'Condo', '2-4 units']);
          }, 1000);
        }
        break;

      case 'eligibility_consent':
        if (response === 'Yes') {
          addMessage('assistant', 'What is your approximate annual income before taxes? (You can round.)', null);
          setUserInputMode(true);
          setCurrentStep('income_input');
        } else {
          addMessage('assistant', 'Okay — we can still show general program info. Would you like general details or to continue without checks?', ['Show general details', 'Continue without checks']);
          setCurrentStep('general_info');
        }
        break;

      case 'credit_check_consent':
        if (response === 'Yes (soft check)') {
          addMessage('assistant', 'Perfect — I\'ll run a soft check and use the result to match programs. This takes just a moment.');
        } else {
          addMessage('assistant', 'No problem — I\'ll continue using the income info and general guidelines. You can always consent later for a more accurate match.');
        }
        setTimeout(() => {
          continueToProgram();
        }, 1000);
        break;

      case 'fha_credit_score':
        if (response === 'Yes') {
          addMessage('assistant', 'Great — with a score above 580 you\'re likely eligible for the 3.5% down payment option. Would you like an estimate of monthly payments using that down payment?', ['Yes', 'No']);
          setCurrentStep('fha_estimate');
        } else if (response === 'No') {
          addMessage('assistant', 'Even if your score is 500–579, some lenders accept FHA with a larger down payment. Would you like info on those options?', ['Yes', 'No']);
          setCurrentStep('fha_lower_score');
        } else {
          addMessage('assistant', 'Want me to help you check your score securely now? It\'s a soft check and won\'t affect your credit.', ['Yes', 'No']);
          setCurrentStep('credit_score_help');
        }
        break;

      case 'fha_estimate':
      case 'fha_lower_score':
      case 'credit_score_help':
        if (response === 'Yes') {
          addMessage('assistant', 'Great! I\'ll prepare that information for you.');
        } else {
          addMessage('assistant', 'No problem. Let\'s continue with other details.');
        }
        setTimeout(() => {
          setCurrentStep('property_type');
          addMessage('assistant', 'Is the property a single-family home, condo, or multi-unit property (2–4 units)?', ['Single-family', 'Condo', '2-4 units']);
        }, 1000);
        break;

      case 'va_eligible':
        if (response === 'Yes — I\'m eligible') {
          addMessage('assistant', 'Fantastic — VA loans could be a great fit. Do you already have your Certificate of Eligibility (COE)?', ['Yes', 'No']);
          setCurrentStep('va_coe');
        } else if (response === 'I\'m not sure / Need help confirming') {
          addMessage('assistant', 'I can help check your eligibility quickly. Do you want to proceed?', ['Yes', 'No']);
          setCurrentStep('va_help');
        } else {
          addMessage('assistant', 'Okay — we\'ll look at FHA or conventional options that suit your profile.');
          setTimeout(() => {
            setCurrentStep('property_type');
            addMessage('assistant', 'Is the property a single-family home, condo, or multi-unit property (2–4 units)?', ['Single-family', 'Condo', '2-4 units']);
          }, 1000);
        }
        break;

      case 'va_coe':
        if (response === 'Yes') {
          addMessage('assistant', 'Perfect — we can proceed to a VA-specific pre-approval check when you\'re ready. Would you like that?', ['Yes', 'No']);
          setCurrentStep('va_preapproval');
        } else {
          addMessage('assistant', 'No problem — I can guide you through getting a COE. Want help now?', ['Yes', 'No']);
          setCurrentStep('va_coe_help');
        }
        break;

      case 'va_preapproval':
      case 'va_coe_help':
      case 'va_help':
        setTimeout(() => {
          setCurrentStep('property_type');
          addMessage('assistant', 'Is the property a single-family home, condo, or multi-unit property (2–4 units)?', ['Single-family', 'Condo', '2-4 units']);
        }, 1000);
        break;

      case 'usda_rural':
        if (response === 'Yes') {
          addMessage('assistant', 'Great — next: does your household income fall within the USDA income limits for your area? (I can help check if you want.)', ['Yes', 'No', 'Help me check']);
          setCurrentStep('usda_income');
        } else if (response === 'No') {
          addMessage('assistant', 'You likely won\'t qualify for USDA, but FHA or conventional loans may still fit. Want to review those?', ['Yes', 'No']);
          setCurrentStep('usda_alternatives');
        } else {
          addMessage('assistant', 'I can estimate eligibility for your ZIP code. Want me to check?', ['Yes', 'No']);
          setCurrentStep('usda_zip_check');
        }
        break;

      case 'usda_income':
      case 'usda_alternatives':
      case 'usda_zip_check':
        setTimeout(() => {
          setCurrentStep('property_type');
          addMessage('assistant', 'Is the property a single-family home, condo, or multi-unit property (2–4 units)?', ['Single-family', 'Condo', '2-4 units']);
        }, 1000);
        break;

      case 'property_type':
        setChatState(prev => ({ ...prev, propertyType: response }));
        if (response === 'Condo') {
          addMessage('assistant', 'Some programs have condo requirements. Do you know if the condo project is FHA/VA-approved?', ['Yes', 'No', 'Not sure']);
          setCurrentStep('condo_approval');
        } else if (response === '2-4 units') {
          addMessage('assistant', 'Certain programs treat 2–4 unit properties differently (income from units may help qualify). Want to use rental income in the estimate?', ['Yes', 'No']);
          setCurrentStep('multi_unit');
        } else {
          setTimeout(() => {
            setCurrentStep('down_payment');
            addMessage('assistant', 'Do you plan to put down less than 20%?', ['Yes', 'No', 'Not sure']);
          }, 1000);
        }
        break;

      case 'condo_approval':
      case 'multi_unit':
        setTimeout(() => {
          setCurrentStep('down_payment');
          addMessage('assistant', 'Do you plan to put down less than 20%?', ['Yes', 'No', 'Not sure']);
        }, 1000);
        break;

      case 'down_payment':
        if (response === 'Yes') {
          addMessage('assistant', 'Okay — some government programs allow very low down payments; FHA and USDA can be helpful. Would you like an estimated monthly payment with a low down payment?', ['Yes', 'No']);
          setCurrentStep('down_payment_estimate');
        } else if (response === 'No') {
          addMessage('assistant', 'Great — with 20% or more down, you may avoid PMI and get better rates. Want to see options tailored for that?', ['Yes', 'No']);
          setCurrentStep('down_payment_20plus');
        } else {
          addMessage('assistant', 'No problem — what amount can you put down today? (If unsure, enter an approximate percentage.)', null);
          setUserInputMode(true);
          setCurrentStep('down_payment_input');
        }
        break;

      case 'down_payment_estimate':
      case 'down_payment_20plus':
        setTimeout(() => {
          setCurrentStep('timeline');
          addMessage('assistant', 'When do you plan to buy or refinance? This helps match you to available programs.', ['0-3 months', '3-6 months', '6+ months', 'Just exploring']);
        }, 1000);
        break;

      case 'timeline':
        setChatState(prev => ({ ...prev, timeline: response }));
        addMessage('assistant', 'Thanks — that helps. I\'ll tailor recommendations based on timing.');
        setTimeout(() => {
          setCurrentStep('pre_approval');
          addMessage('assistant', 'Based on what you\'ve shared, I can create a personalized eligibility summary and—if you want—a pre-approval estimate. Would you like me to prepare that now?', ['Yes — prepare estimate', 'No — show summary only', 'Not yet']);
        }, 1000);
        break;

      case 'pre_approval':
        if (response === 'Yes — prepare estimate') {
          addMessage('assistant', `Before we proceed to generate a pre-approval estimate and save your results, please log in or create an account. This keeps your data secure and lets you pick up later. Would you like to Log in or Create account now?`, ['Log in', 'Create account', 'Maybe later']);
          setCurrentStep('login_trigger');
        } else if (response === 'No — show summary only') {
          addMessage('assistant', 'Sure — I\'ll show a summary of programs and eligibility based on the info you gave. You can log in anytime to get an official pre-approval.');
          setTimeout(() => showWrapUp(), 1000);
        } else {
          addMessage('assistant', 'No rush — I\'ll keep this session active for now. Want tips on improving eligibility while you prepare?', ['Yes', 'No']);
          setCurrentStep('tips');
        }
        break;

      case 'login_trigger':
        if (response === 'Log in' || response === 'Create account') {
          onLoginRequired(response.toLowerCase().replace(' ', '-'));
        } else {
          addMessage('assistant', 'Okay — I\'ll hold off. I can still show a non-saved estimate (approximate). Would you like that?', ['Yes', 'No']);
          setCurrentStep('rough_estimate');
        }
        break;

      case 'rough_estimate':
      case 'tips':
        setTimeout(() => showWrapUp(), 1000);
        break;

      default:
        break;
    }
  };

  const processTextInput = (step, input) => {
    switch(step) {
      case 'income_input':
        setChatState(prev => ({ ...prev, income: input }));
        addMessage('assistant', 'Thanks — do you consent to a secure soft credit check to estimate program eligibility? (This won\'t affect your score.)', ['Yes (soft check)', 'No (skip)']);
        setCurrentStep('credit_check_consent');
        break;

      case 'down_payment_input':
        setChatState(prev => ({ ...prev, downPayment: input }));
        setTimeout(() => {
          setCurrentStep('timeline');
          addMessage('assistant', 'When do you plan to buy or refinance? This helps match you to available programs.', ['0-3 months', '3-6 months', '6+ months', 'Just exploring']);
        }, 1000);
        break;

      default:
        break;
    }
  };

  const continueToProgram = () => {
    const program = chatState.program;
    if (program === 'FHA') {
      setCurrentStep('fha_credit_score');
      addMessage('assistant', 'FHA loans allow down payments starting at 3.5% and are more flexible on credit. Quick question — is your credit score above 580?', ['Yes', 'No', 'Not sure']);
    } else if (program === 'VA') {
      setCurrentStep('va_eligible');
      addMessage('assistant', 'VA loans often require no down payment and no PMI. Are you an eligible veteran, active duty service member, or spouse of someone eligible?', ['Yes — I\'m eligible', 'I\'m not sure / Need help confirming', 'No']);
    } else if (program === 'USDA') {
      setCurrentStep('usda_rural');
      addMessage('assistant', 'USDA loans require the property to be in an eligible rural area and household income to be within limits. Is the property you\'re considering in a rural area or small town?', ['Yes', 'No', 'Not sure']);
    } else {
      setCurrentStep('property_type');
      addMessage('assistant', 'Is the property a single-family home, condo, or multi-unit property (2–4 units)?', ['Single-family', 'Condo', '2-4 units']);
    }
  };

  const showWrapUp = () => {
    addMessage('assistant', `All set for now, ${firstName}! Here's what I can do next for you:`, ['View eligibility summary & program details', 'Get a rough estimate (no login)', 'Save and continue later (requires login)', 'Connect with a mortgage advisor']);
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
