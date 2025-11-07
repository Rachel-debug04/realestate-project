import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Send } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Ellen's avatar as woman in late 20s-30s (professional, friendly)
const ELLEN_AVATAR = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=faces';

export default function EllenPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const serviceType = location.state?.serviceType || 'purchase';
  const preCollectedData = location.state?.userData || null;
  
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(preCollectedData || { firstName: '', lastName: '' });
  const [sessionId, setSessionId] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Redirect to pre-chat if no data collected
    if (!preCollectedData || !preCollectedData.firstName) {
      navigate('/prechat', { state: { serviceType } });
      return;
    }
    
    // Clear previous session for this service
    const storageKey = `ellen_session_${serviceType}`;
    const existingSession = localStorage.getItem(storageKey);
    
    if (existingSession) {
      const session = JSON.parse(existingSession);
      setSessionId(session.sessionId);
      setMessages(session.messages);
    } else {
      // Initialize new chat with greeting
      const greeting = getGreeting(serviceType, preCollectedData.firstName);
      setMessages([{ role: 'assistant', content: greeting, timestamp: new Date() }]);
    }
  }, [serviceType, preCollectedData, navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    // Save session per service
    if (messages.length > 0) {
      const storageKey = `ellen_session_${serviceType}`;
      localStorage.setItem(storageKey, JSON.stringify({
        sessionId,
        messages,
        serviceType
      }));
    }
  }, [messages, sessionId, serviceType]);

  const getGreeting = (service, firstName) => {
    const greetings = {
      purchase: `Hi ${firstName}! 😊 I'm Ellen, your mortgage guide. I see you're looking to purchase a new home. I'll help you find the best rates and loan options. What's your budget range?`,
      refinance: `Hey ${firstName}! 😊 I'm Ellen. You're looking to refinance - smart move! Tell me about your current mortgage. What's your main goal: lower monthly payments or a shorter loan term?`,
      investment: `Hi ${firstName}! 😊 I'm Ellen. Investing in property is exciting! What type of investment property are you considering, and do you have expected rental income in mind?`,
      'home-equity': `Hey ${firstName}! 😊 I'm Ellen. Home equity loans can be great for accessing your home's value. What's the purpose of this loan, and how much equity do you think you have?`,
      calculator: `Hi ${firstName}! 😊 I'm Ellen. Let me help you calculate mortgage rates. What loan amount are you considering?`,
      default: `Hi ${firstName}! 😊 I'm Ellen, your mortgage guide. How can I help you today?`
    };
    return greetings[service] || greetings.default;
  };

  const getServiceQuestion = (service) => {
    const questions = {
      homeowners: "Can I ask where your new home is located?",
      'first-time': "Is this your first home purchase? What type of property are you looking at?",
      refinance: "Are you hoping to lower your monthly payments or shorten your loan term?",
      investment: "Is this a personal or business investment? What's your budget range?",
      compare: "What loan amount are you considering?",
      default: "What brings you here today? Are you looking to buy, refinance, or just explore options?"
    };
    return questions[service] || questions.default;
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage, timestamp: new Date() }]);
    setLoading(true);

    try {
      if (stage === 'name_collection') {
        handleNameCollection(userMessage);
      } else if (stage === 'conversation') {
        await handleConversation(userMessage);
      }
    } catch (error) {
      console.error('Chat error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNameCollection = (message) => {
    const names = message.trim().split(/\\s+/);
    if (names.length >= 2) {
      const firstName = names[0];
      const lastName = names.slice(1).join(' ');
      setUserData(prev => ({ ...prev, firstName, lastName }));
      
      const response = `Nice to meet you, ${firstName}! ${getServiceQuestion(serviceType)}`;
      setMessages(prev => [...prev, { role: 'assistant', content: response, timestamp: new Date() }]);
      setStage('conversation');
    } else {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "Could you share both your first and last name? For example: 'John Smith'", 
        timestamp: new Date() 
      }]);
    }
  };

  const handleConversation = async (message) => {
    try {
      let currentSessionId = sessionId;
      if (!currentSessionId) {
        currentSessionId = `guest_${Date.now()}`;
        setSessionId(currentSessionId);
      }

      const response = await axios.post(`${API}/chat/guest`, {
        message,
        session_id: currentSessionId,
        use_primary: true,
        context: {
          service_type: serviceType,
          user_name: userData.firstName,
          stage: 'conversation'
        }
      });

      const aiResponse = response.data.message;
      setMessages(prev => [...prev, { role: 'assistant', content: aiResponse, timestamp: new Date() }]);

      if (shouldPromptSignup(response.data.intent)) {
        setTimeout(() => {
          setMessages(prev => [...prev, { 
            role: 'assistant', 
            content: `Great! To save your progress and see personalized quotes, would you like to create a quick account? It takes just 30 seconds. 😊`,
            timestamp: new Date(),
            showSignupButton: true
          }]);
        }, 2000);
      }
    } catch (error) {
      console.error('AI chat error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I'd love to help you with that! To give you accurate information, could you tell me a bit more?",
        timestamp: new Date() 
      }]);
    }
  };

  const shouldPromptSignup = (intent) => {
    return intent === 'getQuote' || intent === 'preQual' || intent === 'startApplication';
  };

  const handleSignup = () => {
    navigate('/signup', { state: { fromEllen: true, userData } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8F9FA] to-white flex flex-col">
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

            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                onClick={() => navigate('/login')}
                className="text-[#0F4C81]"
              >
                Log In
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Ellen Introduction */}
        <div className="text-center mb-8 animate-fadeIn">
          <img
            src={ELLEN_AVATAR}
            alt="Ellen"
            className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-[#A9CCE3] shadow-lg"
          />
          <h1 className="text-3xl font-bold text-[#0A1929] mb-2" style={{ fontFamily: 'Space Grotesk' }}>
            Chat with Ellen
          </h1>
          <p className="text-[#667085]">Your friendly mortgage guide</p>
        </div>

        {/* Messages */}
        <div className="bg-white rounded-3xl shadow-lg border border-[#E5E7EB] p-6 mb-6 min-h-[500px] max-h-[600px] overflow-y-auto">
          <div className="space-y-6">
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
                    {msg.showSignupButton && (
                      <div className="mt-3 flex space-x-3">
                        <Button onClick={handleSignup} className="bg-[#0F4C81] hover:bg-[#0A3A61] text-white rounded-full" data-testid="ellen-signup-prompt">
                          Create Account
                        </Button>
                        <Button variant="outline" onClick={() => setMessages(prev => prev.filter((_, i) => i !== idx))} className="rounded-full">
                          Continue as Guest
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start animate-fadeIn">
                <div className="flex items-start space-x-3 max-w-[80%]">
                  <img
                    src={ELLEN_AVATAR}
                    alt="Ellen"
                    className="w-10 h-10 rounded-full flex-shrink-0 border-2 border-[#A9CCE3]"
                  />
                  <div className="p-4 rounded-2xl bg-[#F8F9FA]">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-[#0F4C81] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-[#0F4C81] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-[#0F4C81] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-white rounded-3xl shadow-lg border border-[#E5E7EB] p-6">
          {stage === 'name_collection' && (
            <div className="mb-4 p-4 bg-[#E8F4F8] rounded-lg">
              <p className="text-sm text-[#0F4C81] mb-2">Let's start with your name:</p>
              <p className="text-xs text-[#667085]">Example: John Smith</p>
            </div>
          )}
          <div className="flex space-x-4">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder={stage === 'name_collection' ? 'Enter your first and last name...' : 'Type your message...'}
              className="flex-1 h-14 border-[#E5E7EB] focus:border-[#0F4C81] text-base"
              disabled={loading}
              data-testid="ellen-chat-input"
            />
            <Button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="h-14 px-8 bg-[#0F4C81] hover:bg-[#0A3A61] text-white rounded-full"
              data-testid="ellen-send-message"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
