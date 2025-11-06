import React, { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { chatAPI } from '@/lib/api';
import { toast } from 'sonner';
import { Send, MessageSquare, Sparkles, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function AdvisorPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await chatAPI.sendMessage(userMessage, sessionId, true);
      setSessionId(response.session_id);
      setMessages(prev => [...prev, { role: 'assistant', content: response.message, intent: response.intent, suggestions: response.suggestions }]);
    } catch (error) {
      console.error('Chat error:', error);
      toast.error('Failed to get response');
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestion = (suggestion) => {
    setInput(suggestion);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col">
      <Navbar />
      <div className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#0A1929] mb-4" style={{ fontFamily: 'Space Grotesk' }} data-testid="advisor-title">
            AI Mortgage Advisor
          </h1>
          <p className="text-lg text-[#667085]">
            Ask me anything about mortgages, rates, or your application
          </p>
        </div>

        <Card className="flex-1 flex flex-col border-[#E5E7EB] shadow-lg" data-testid="chat-container">
          <div className="flex-1 p-6 overflow-y-auto space-y-6" style={{ maxHeight: '60vh' }}>
            {messages.length === 0 ? (
              <div className="text-center py-12" data-testid="chat-welcome">
                <div className="w-20 h-20 bg-[#E8F4F8] rounded-full flex items-center justify-center mx-auto mb-6">
                  <MessageSquare className="h-10 w-10 text-[#0F4C81]" />
                </div>
                <h3 className="text-xl font-semibold mb-2" style={{ fontFamily: 'Space Grotesk' }}>
                  How can I help you today?
                </h3>
                <p className="text-[#667085] mb-6">
                  I'm here to answer your mortgage questions
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  {['What rates are available?', 'How much can I borrow?', 'Explain pre-qualification'].map((q) => (
                    <Button key={q} variant="outline" onClick={() => setInput(q)} className="border-[#0F4C81] text-[#0F4C81] hover:bg-[#0F4C81] hover:text-white" data-testid="starter-question">
                      {q}
                    </Button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`} data-testid={`message-${idx}`}>
                  <div className={`flex items-start space-x-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-[#0F4C81]' : 'bg-[#E8F4F8]'}`}>
                      {msg.role === 'user' ? <User className="h-4 w-4 text-white" /> : <Sparkles className="h-4 w-4 text-[#0F4C81]" />}
                    </div>
                    <div>
                      <div className={`p-4 rounded-2xl ${msg.role === 'user' ? 'bg-[#0F4C81] text-white' : 'bg-white border border-[#E5E7EB]'}`}>
                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      </div>
                      {msg.intent && (
                        <Badge className="mt-2 bg-[#E8F4F8] text-[#0F4C81]" data-testid="message-intent">{msg.intent}</Badge>
                      )}
                      {msg.suggestions && msg.suggestions.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {msg.suggestions.map((sug, i) => (
                            <Button key={i} size="sm" variant="outline" onClick={() => handleSuggestion(sug)} className="text-xs" data-testid="suggestion-btn">
                              {sug}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
            {loading && (
              <div className="flex justify-start animate-fadeIn" data-testid="typing-indicator">
                <div className="flex items-start space-x-3 max-w-[80%]">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-[#E8F4F8]">
                    <Sparkles className="h-4 w-4 text-[#0F4C81]" />
                  </div>
                  <div className="p-4 rounded-2xl bg-white border border-[#E5E7EB]">
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

          <div className="p-6 border-t border-[#E5E7EB]">
            <form onSubmit={handleSend} className="flex space-x-4" data-testid="chat-input-form">
              <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask me anything about mortgages..." className="flex-1 h-12 border-[#E5E7EB] focus:border-[#0F4C81]" disabled={loading} data-testid="chat-input" />
              <Button type="submit" disabled={loading || !input.trim()} className="h-12 px-6 bg-[#0F4C81] hover:bg-[#0A3A61] text-white rounded-full" data-testid="send-message">
                <Send className="h-5 w-5" />
              </Button>
            </form>
          </div>
        </Card>
      </div>
      <Footer />
    </div>
  );
}