

import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

// Product information about the ROI Calculator
const PRODUCT_INFO = `
ROI Calculator Input Categories and Default Values:

BUSINESS INPUTS:
- annualRevenue: $100,000,000 (Annual company revenue)
- grossMargin: 80% (Company's gross profit margin)
- containerAppFraction: 90% (Percentage of applications that are containerized)
- annualCloudSpend: $10,000,000 (Total annual cloud infrastructure spending)
- computeSpendFraction: 60% (Percentage of cloud spend on compute resources)
- costSensitiveFraction: 50% (Percentage of compute spend that is cost-sensitive)

PRODUCTIVITY INPUTS:
- numEngineers: 100 (Number of engineers in the team)
- engineerCostPerYear: $150,000 (Annual cost per engineer including salary and benefits)
- opsTimeFraction: 15% (Percentage of engineering time spent on operations)
- opsToilFraction: 50% (Percentage of ops time spent on repetitive tasks/toil)
- toilReductionFraction: 45% (Expected reduction in toil through automation - fixed)

PERFORMANCE INPUTS:
- avgResponseTimeSec: 2 seconds (Current average application response time)
- execTimeInfluenceFraction: 33% (Percentage of revenue influenced by execution time - fixed)
- latRedContainer: 28% (Latency reduction for containerized apps - fixed)
- latRedServerless: 50% (Latency reduction for serverless apps - fixed)
- revenueLiftPer100ms: 1% (Revenue increase per 100ms response time improvement)

AVAILABILITY INPUTS:
- currentFCIFraction: 2% (Current Failure Cost Index as percentage of revenue)
- fciReductionFraction: 75% (Expected reduction in failure costs - fixed)
- costPer1PctFCI: 1% (Cost per 1% of FCI)

CALCULATION FORMULAS:

1. Cloud Savings:
   computeSpend = annualCloudSpend * (computeSpendFraction / 100)
   costSensitiveSpend = computeSpend * (costSensitiveFraction / 100)
   cloudSavings = costSensitiveSpend * ((containerAppFraction / 100) * 0.5 + (1 - containerAppFraction / 100) * 0.2)

2. Productivity Gain:
   productivityGain = numEngineers * engineerCostPerYear * (opsTimeFraction / 100) * (opsToilFraction / 100) * (toilReductionFraction / 100)

3. Performance Gain:
   weightedLatRed = (containerAppFraction / 100) * (latRedContainer / 100) + (1 - containerAppFraction / 100) * (latRedServerless / 100)
   timeSavedSec = avgResponseTimeSec * weightedLatRed
   revGainPct = (timeSavedSec / 0.1) * (revenueLiftPer100ms / 100)
   performanceGain = annualRevenue * revGainPct * (grossMargin / 100) * (execTimeInfluenceFraction / 100)

4. Availability Gain:
   fciCostFraction = (costPer1PctFCI / 100) * (currentFCIFraction / 100 / 0.01)
   fciCost = annualRevenue * fciCostFraction * (grossMargin / 100)
   availabilityGain = fciCost * (fciReductionFraction / 100)

5. Total Calculations:
   totalAnnualGain = cloudSavings + productivityGain + performanceGain + availabilityGain
   estimatedCost = Math.max(annualCloudSpend * 0.1, numEngineers * engineerCostPerYear * 0.05, annualRevenue * 0.005)
   roiPercent = (totalAnnualGain / estimatedCost) * 100
   paybackMonths = (12 * estimatedCost) / totalAnnualGain

The calculator estimates the ROI by calculating potential savings and gains across four key areas: cloud infrastructure optimization, engineering productivity improvements, application performance enhancements, and system availability improvements.
`;

interface Message {
  text: string;
  isUser: boolean;
}

const ChatMessage: React.FC<{ message: string; isUser: boolean }> = ({ message, isUser }) => {
  const formatBotMessage = (text: string) => {
    // Split by sections and format with proper spacing
    const sections = text.split('\n\n');
    return sections.map((section, index) => {
      const lines = section.split('\n');
      return (
        <div key={index} className={index > 0 ? 'mt-4' : ''}>
          {lines.map((line, lineIndex) => {
            // Check if line is a header (starts with capital letter and ends with :)
            if (line.match(/^[A-Z][^:]*:$/)) {
              return (
                <div key={lineIndex} className="font-semibold text-foreground mb-2 mt-3 first:mt-0">
                  {line}
                </div>
              );
            }
            // Check if line is a bullet point
            if (line.startsWith('- ') || line.startsWith('• ')) {
              return (
                <div key={lineIndex} className="ml-3 mb-1 text-muted-foreground">
                  {line}
                </div>
              );
            }
            // Check if line contains numbers/calculations
            if (line.match(/[\d,]+%?|\$[\d,]+/)) {
              return (
                <div key={lineIndex} className="font-medium text-foreground mb-1">
                  {line}
                </div>
              );
            }
            // Regular text
            return line.trim() ? (
              <div key={lineIndex} className="mb-1 text-muted-foreground">
                {line}
              </div>
            ) : null;
          })}
        </div>
      );
    });
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[85%] p-3 rounded-lg text-sm ${
          isUser
            ? 'bg-primary text-primary-foreground rounded-br-none'
            : 'bg-muted/50 border border-border rounded-bl-none'
        }`}
      >
        {isUser ? message : <div className="space-y-1">{formatBotMessage(message)}</div>}
      </div>
    </div>
  );
};

const Bot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (input.trim() === '') return;

    const userMessage: Message = { text: input, isUser: true };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput('');
    setLoading(true);

    const prompt = `You are a helpful assistant providing information about an ROI Calculator product. Use only the following provided product information to answer questions. If the answer is not in the provided information, state that you don't have enough information.

Product Information:
${PRODUCT_INFO}

User Question: ${input}`;

    let chatHistory = [{ role: 'user', parts: [{ text: prompt }] }];
    const payload = { contents: chatHistory };
    const apiKey = import.meta.env.VITE_API_URL;
    console.log('API Key:', apiKey); // Debugging line to check API key
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const maxRetries = 5;
    let retryCount = 0;
    let success = false;

    while (retryCount < maxRetries && !success) {
      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (
          result.candidates &&
          result.candidates.length > 0 &&
          result.candidates[0].content &&
          result.candidates[0].content.parts &&
          result.candidates[0].content.parts.length > 0
        ) {
          const botResponseText = result.candidates[0].content.parts[0].text;
          setMessages((prevMessages) => [
            ...prevMessages,
            { text: botResponseText, isUser: false },
          ]);
          success = true;
        } else {
          setMessages((prevMessages) => [
            ...prevMessages,
            { text: 'Sorry, I could not get a response from the model.', isUser: false },
          ]);
          success = true;
        }
      } catch (error) {
        console.error('Error fetching from Gemini API:', error);
        retryCount++;
        if (retryCount < maxRetries) {
          const delay = Math.pow(2, retryCount) * 1000;
          await new Promise((resolve) => setTimeout(resolve, delay));
        } else {
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              text: 'Sorry, I am having trouble connecting right now. Please try again later.',
              isUser: false,
            },
          ]);
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      sendMessage();
    }
  };

  return (
    <>
      {/* Fixed Bot Icon */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50"
        size="lg"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-24 right-6 w-72 h-80 shadow-2xl z-40 flex flex-col sm:w-80 sm:h-96">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-primary text-primary-foreground rounded-t-lg">
            <h3 className="font-semibold">ROI Calculator Assistant</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-6 w-6 p-0 hover:bg-primary-foreground/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            {messages.length === 0 && (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground text-sm text-center">
                  Hi! I'm here to help you with questions about the ROI Calculator. Ask me anything!
                </p>
              </div>
            )}
            {messages.map((msg, index) => (
              <ChatMessage key={index} message={msg.text} isUser={msg.isUser} />
            ))}
            {loading && (
              <div className="flex justify-start mb-3">
                <div className="bg-muted text-muted-foreground max-w-[80%] p-3 rounded-lg rounded-bl-none text-sm">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-current rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-current rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-current rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex items-center space-x-2">
              <Input
                type="text"
                placeholder="Ask about the ROI Calculator..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading}
                className="flex-1 text-sm"
              />
              <Button
                onClick={sendMessage}
                size="sm"
                disabled={loading || !input.trim()}
                className="shrink-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Mobile Responsive - Full Screen on Small Devices */}
      {isOpen && (
        <div className="sm:hidden fixed inset-0 bg-background z-40">
          <Card className="h-full w-full rounded-none flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-primary text-primary-foreground">
              <h3 className="font-semibold">ROI Calculator Assistant</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-6 w-6 p-0 hover:bg-primary-foreground/20"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              {messages.length === 0 && (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground text-sm text-center">
                    Hi! I'm here to help you with questions about the ROI Calculator. Ask me anything!
                  </p>
                </div>
              )}
              {messages.map((msg, index) => (
                <ChatMessage key={index} message={msg.text} isUser={msg.isUser} />
              ))}
              {loading && (
                <div className="flex justify-start mb-3">
                  <div className="bg-muted text-muted-foreground max-w-[80%] p-3 rounded-lg rounded-bl-none text-sm">
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-current rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-current rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-current rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t">
              <div className="flex items-center space-x-2">
                <Input
                  type="text"
                  placeholder="Ask about the ROI Calculator..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={loading}
                  className="flex-1 text-sm"
                />
                <Button
                  onClick={sendMessage}
                  size="sm"
                  disabled={loading || !input.trim()}
                  className="shrink-0"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  );
};

export default Bot;