
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User, 
  Loader2,
  Phone,
  Mail
} from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: "bot",
      content: "Hello! I'm here to help you learn about Cereus Technologies. Ask me about our products, services, team, or anything else you'd like to know!"
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage("");
    
    setMessages(prev => [...prev, { type: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const systemPrompt = `You are a helpful customer service assistant for Cereus Technologies. Here is key information about the company:

ABOUT CEREUS TECHNOLOGIES:
- Founded in 2016 in Lagos, Nigeria
- Builds reliable technology solutions for health, education, and environment
- Serves 50+ institutional clients across 12 countries
- Team of technologists, researchers, and domain experts

LEADERSHIP TEAM:
- Afeez A. Olagunju: Founder/CEO, Computer Science expert
- Abe Enoch A.: Chief Technology Officer, AI/ML expert
- Akanfe Abidemi M.: Research and Development Director

SERVICES:
- Custom Software Development
- Technology Consulting & Strategy
- Research & Development Partnerships
- System Integration & Deployment
- Cereus Academy: Educational technology programs

CONTACT INFORMATION:
- Phone: +234 701 462 3270
- Email: info@cereustechnologies.com
- Location: Lagos, Nigeria
- Business Hours: Mon-Fri 9AM-5PM WAT, Sat 10AM-2PM WAT

INSTRUCTIONS:
1. Answer questions using only the information provided above
2. Be helpful, professional, and concise
3. If asked about details not covered above, politely say you don't have that information and provide contact details
4. Do NOT make up any information
5. Always offer to connect them with the team for detailed discussions

User question: ${userMessage}`;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt: systemPrompt
      });

      setMessages(prev => [...prev, { type: "bot", content: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        type: "bot", 
        content: "I'm sorry, I'm having trouble connecting right now. Please contact us directly at info@cereustechnologies.com or +234 701 462 3270 for immediate assistance." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-purple-900 to-purple-800 hover:from-purple-800 hover:to-purple-700 text-white rounded-full p-4 shadow-lg"
          size="lg"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      ) : (
        <Card className="w-80 h-96 flex flex-col shadow-xl">
          <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-t-lg">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center">
                <Bot className="w-5 h-5 mr-2" />
                Cereus Assistant
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-purple-700 p-1"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col p-0">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex items-start space-x-2 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${message.type === 'user' ? 'bg-green-600' : 'bg-purple-900'}`}>
                      {message.type === 'user' ? (
                        <User className="w-3 h-3 text-white" />
                      ) : (
                        <Bot className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <div className={`rounded-lg p-3 ${message.type === 'user' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-800'}`}>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-2">
                    <div className="w-6 h-6 rounded-full bg-purple-900 flex items-center justify-center">
                      <Bot className="w-3 h-3 text-white" />
                    </div>
                    <div className="bg-gray-100 rounded-lg p-3">
                      <Loader2 className="w-4 h-4 animate-spin text-purple-900" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Contact Info Footer */}
            <div className="border-t bg-gray-50 p-3">
              <div className="text-xs text-gray-600 space-y-1">
                <div className="flex items-center space-x-1">
                  <Phone className="w-3 h-3" />
                  <span>+234 701 462 3270</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Mail className="w-3 h-3" />
                  <span>info@cereustechnologies.com</span>
                </div>
              </div>
            </div>

            {/* Input */}
            <div className="border-t p-3">
              <div className="flex space-x-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything..."
                  className="flex-1 text-sm"
                  disabled={isLoading}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
