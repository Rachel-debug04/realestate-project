import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { X, Send, Sparkles } from 'lucide-react';
import { chatAPI } from '@/lib/api';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function EllenChat({ isOpen, onClose, serviceType, onSignupPrompt }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState('greeting'); // greeting, name_collection, conversation, quote
  const [userData, setUserData] = useState({ firstName: '', lastName: '', email: '' });
  const [sessionId, setSessionId] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      initializeChat();
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    // Load guest session from localStorage
    const guestSession = localStorage.getItem('ellen_guest_session');
    if (guestSession) {
      const session = JSON.parse(guestSession);
      setSessionId(session.sessionId);
      setUserData(session.userData);
      setMessages(session.messages);
      setStage(session.stage);
    }
  }, []);

  useEffect(() => {
    // Save guest session to localStorage
    if (messages.length > 0) {
      localStorage.setItem('ellen_guest_session', JSON.stringify({
        sessionId,
        userData,
        messages,
        stage,
        serviceType
      }));
    }
  }, [messages, userData, stage, sessionId, serviceType]);

  const initializeChat = () => {
    const greeting = getGreeting(serviceType);
    setMessages([{ role: 'assistant', content: greeting, timestamp: new Date() }]);
    setStage('name_collection');
  };

  const getGreeting = (service) => {
    const greetings = {
      homeowners: "Hi, I'm Ellen — your friendly mortgage guide 😊 Ready to find your best fit for your new home?",
      'first-time': "Hi, I'm Ellen! 😊 So exciting that you're looking to buy your first home. Let me help make this easy!",
      refinance: "Hey there! I'm Ellen 😊 Looking to refinance? I'll help you find the best option.",
      investment: "Hi, I'm Ellen! 😊 Investing in property? Smart move. Let's find you the right mortgage.",
      compare: "Hi, I'm Ellen! 😊 Want to compare rates? I'll help you find the best deals.",
      default: "Hi, I'm Ellen — your friendly mortgage guide 😊 Ready to find your best fit?"
    };
    return greetings[service] || greetings.default;
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
    // Check if user provided both names
    const names = message.trim().split(/\s+/);
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

  const handleConversation = async (message) => {
    try {
      // Use existing chat API for AI response
      let currentSessionId = sessionId;
      if (!currentSessionId) {
        currentSessionId = `guest_${Date.now()}`;
        setSessionId(currentSessionId);
      }

      // Call AI without authentication for guest users
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

      // Check if we should prompt for signup
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
      // Fallback response
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" data-testid="ellen-chat-overlay">
      <Card className="w-full max-w-2xl h-[600px] flex flex-col shadow-2xl animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#E5E7EB]">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[#A9CCE3] to-[#0F4C81] rounded-full flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-lg" style={{ fontFamily: 'Space Grotesk' }}>Ellen</h3>
              <p className="text-sm text-[#667085]">Your Mortgage Guide</p>
            </div>
          </div>
          <Button variant="ghost" onClick={onClose} className="rounded-full" data-testid="close-ellen-chat">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}>
              <div className={`max-w-[80%] ${msg.role === 'user' ? '' : 'flex items-start space-x-3'}`}>
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 bg-gradient-to-br from-[#A9CCE3] to-[#0F4C81] rounded-full flex items-center justify-center flex-shrink-0">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                )}
                <div>
                  <div className={`p-4 rounded-2xl ${msg.role === 'user' ? 'bg-[#0F4C81] text-white' : 'bg-[#F8F9FA] text-[#0A1929]'}`}>
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  </div>
                  {msg.showSignupButton && (
                    <div className="mt-3 flex space-x-3">
                      <Button onClick={() => onSignupPrompt(userData)} className="bg-[#0F4C81] hover:bg-[#0A3A61] text-white rounded-full" data-testid="ellen-signup-prompt">
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
                <div className="w-8 h-8 bg-gradient-to-br from-[#A9CCE3] to-[#0F4C81] rounded-full flex items-center justify-center flex-shrink-0">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
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

        {/* Input */}
        <div className="p-6 border-t border-[#E5E7EB]">
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
              className="flex-1 h-12 border-[#E5E7EB] focus:border-[#0F4C81]" 
              disabled={loading}
              data-testid="ellen-chat-input"
            />
            <Button 
              onClick={handleSend} 
              disabled={loading || !input.trim()} 
              className="h-12 px-6 bg-[#0F4C81] hover:bg-[#0A3A61] text-white rounded-full"
              data-testid="ellen-send-message"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}