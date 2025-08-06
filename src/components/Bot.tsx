// import React, { useState, useEffect, useRef } from 'react';

// // Product information about the ROI Calculator
// const PRODUCT_INFO = `
// What are the main differences between the QuickCalculator and the ROICalculator? How is the Total Annual ROI calculated in both calculators? What kind of inputs are used in each calculator, and which ones are shared between them? Can you explain the four main areas of gain (Cloud Savings, Productivity, Performance, and Availability) that are calculated in the ROI model? How is "cloud savings" calculated, and what variables are used in the formula? Can you break down the formula for "productivity gain"? What is "performance gain," and what factors influence its calculation? Explain the calculation for "availability gain" and the variables involved. How is the "payback period" determined? Can you explain the final formula used for roiPercent? What are the default values for the inputs that are not shown in the QuickCalculator? How does the grossMargin input affect the calculations for performanceGain and availabilityGain? The QuickCalculator only takes three inputs (annualRevenue, annualCloudSpend, numEngineers). How does it account for the other 12 inputs used in the ROICalculator?

// Main Differences between QuickCalculator and ROICalculator: The QuickCalculator is a simplified version of the ROICalculator. It focuses on providing a quick estimate with only three key user inputs: Annual Revenue, Annual Cloud Spend, and Number of Engineers. The ROICalculator, on the other hand, is a comprehensive tool that allows for a detailed analysis with a much larger set of user-configurable inputs, grouped into four categories: Business & Technology Drivers, Productivity Inputs, Performance Inputs, and Availability Inputs. The QuickCalculator uses hardcoded, default values for the inputs not shown in its UI.

// Calculation of Total Annual ROI: The "Total Annual ROI" is represented by the totalAnnualGain value, which is the sum of the four main areas of gain: cloudSavings, productivityGain, performanceGain, and availabilityGain.

// Inputs Used and Shared: The ROICalculator uses a wide range of inputs, including annualRevenue, grossMargin, containerAppFraction, annualCloudSpend, computeSpendFraction, costSensitiveFraction, numEngineers, engineerCostPerYear, opsTimeFraction, opsToilFraction, avgResponseTimeSec, revenueLiftPer100ms, currentFCIFraction, and costPer1PctFCI. The QuickCalculator uses only three of these as user inputs: annualRevenue, annualCloudSpend, and numEngineers. It retrieves these three inputs from a context provider, ROICalculatorContext.

// Four Main Areas of Gain: The four main areas of gain are:
// Cloud Savings: This gain is calculated based on factors like annual cloud spend and the fraction of containerized applications, assuming that a new solution will make some of this spend more efficient.
// Productivity: This gain is derived from the cost and number of engineers and the time they spend on operations and "toil". The model assumes a reduction in this toil.
// Performance: This gain is calculated by estimating the revenue lift from a reduction in application response time.
// Availability: This gain is based on the cost associated with system failures (FCI - Failure Cost Index) and assumes a reduction in that cost.

// "Cloud Savings" Calculation: The cloudSavings is calculated using the following formula: cloudSavings = costSensitiveSpend * ((containerAppFraction / 100) * 0.5 + (1 - containerAppFraction / 100) * 0.2). First, computeSpend is calculated as annualCloudSpend * (computeSpendFraction / 100). Then, costSensitiveSpend is determined by multiplying computeSpend by (costSensitiveFraction / 100). The final calculation uses costSensitiveSpend and the containerAppFraction.

// "Productivity Gain" Formula: The formula for productivityGain is: productivityGain = numEngineers * engineerCostPerYear * (opsTimeFraction / 100) * (opsToilFraction / 100) * (toilReductionFraction / 100).

// "Performance Gain" Calculation: The performanceGain is calculated based on an estimated increase in revenue due to faster application response times. The calculation involves several steps:
// weightedLatRed: This value is a weighted average of latency reduction for container and serverless apps based on the containerAppFraction.
// timeSavedSec: The weighted latency reduction is applied to the avgResponseTimeSec.
// revGainPct: This is the percentage increase in revenue, calculated from the time saved and the revenueLiftPer100ms input.
// performanceGain: The final gain is the product of annualRevenue, revGainPct, grossMargin, and execTimeInfluenceFraction.

// "Availability Gain" Calculation: The availabilityGain is calculated as a fraction of the total cost of system failures.
// fciCostFraction: This is a fraction derived from the costPer1PctFCI and currentFCIFraction.
// fciCost: The total failure cost is calculated as annualRevenue * fciCostFraction * (grossMargin / 100).
// availabilityGain: The final gain is a fraction of the fciCost, determined by the fciReductionFraction.

// Payback Period Determination: The paybackMonths is determined by the formula: (12 * estimatedCost) / totalAnnualGain. The estimatedCost is defined as totalAnnualGain / 10 in the ROICalculator and annualCloudSpend / 10 in the QuickCalculator.

// Formula for roiPercent: The final formula for roiPercent used in both calculators is: roiPercent = (totalAnnualGain / (estimatedCost + ( numEngineers*engineerCostPerYear))) * 100. This formula calculates the return on investment as the total annual gain divided by the total investment, which includes both the estimated cost of the solution and the total annual cost of the engineering team.

// Default Values in QuickCalculator: The QuickCalculator uses the following hardcoded default values for inputs not included in its interface:
// grossMargin: 80
// containerAppFraction: 90
// computeSpendFraction: 60
// costSensitiveFraction: 50
// engineerCostPerYear: 150,000
// opsTimeFraction: 15
// opsToilFraction: 50
// toilReductionFraction: 45
// avgResponseTimeSec: 2
// execTimeInfluenceFraction: 33
// latRedContainer: 28
// latRedServerless: 50
// revenueLiftPer100ms: 1
// currentFCIFraction: 2
// fciReductionFraction: 75
// costPer1PctFCI: 1

// Effect of grossMargin: The grossMargin input directly affects the performanceGain and availabilityGain calculations. In both cases, the calculated gain is multiplied by (grossMargin / 100) to determine the final value. This suggests that the model considers these gains as increases to the company's gross profit, not just revenue.

// How QuickCalculator Accounts for Other Inputs: The QuickCalculator accounts for the other 12 inputs by using static, predefined values for them within the useMemo hook. This allows it to perform the full ROI calculation using the same logic as the ROICalculator but with a simplified user interface.
// `;

// const ChatMessage = ({ message, isUser }) => {
//   return (
//     <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
//       <div
//         className={`max-w-md p-3 rounded-lg shadow-md ${
//           isUser
//             ? 'bg-blue-500 text-white rounded-br-none'
//             : 'bg-gray-200 text-gray-800 rounded-bl-none'
//         }`}
//       >
//         {message}
//       </div>
//     </div>
//   );
// };

// const App = () => {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState('');
//   const [loading, setLoading] = useState(false);
//   const messagesEndRef = useRef(null);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const sendMessage = async () => {
//     if (input.trim() === '') return;

//     const userMessage = { text: input, isUser: true };
//     setMessages((prevMessages) => [...prevMessages, userMessage]);
//     setInput('');
//     setLoading(true);

//     const prompt = `You are a helpful assistant providing information about an ROI Calculator product. Use only the following provided product information to answer questions. If the answer is not in the provided information, state that you don't have enough information.

// Product Information:
// ${PRODUCT_INFO}

// User Question: ${input}`;

//     let chatHistory = [{ role: 'user', parts: [{ text: prompt }] }];
//     const payload = { contents: chatHistory };
//     const apiKey = 'AIzaSyB1OhfhAwwBu7kKpE36M_5QSDOOxKKkJco'; // Leave as-is, Canvas will provide it at runtime

//     const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

//     const maxRetries = 5;
//     let retryCount = 0;
//     let success = false;

//     while (retryCount < maxRetries && !success) {
//       try {
//         const response = await fetch(apiUrl, {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(payload),
//         });

//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         const result = await response.json();

//         if (
//           result.candidates &&
//           result.candidates.length > 0 &&
//           result.candidates[0].content &&
//           result.candidates[0].content.parts &&
//           result.candidates[0].content.parts.length > 0
//         ) {
//           const botResponseText = result.candidates[0].content.parts[0].text;
//           setMessages((prevMessages) => [
//             ...prevMessages,
//             { text: botResponseText, isUser: false },
//           ]);
//           success = true;
//         } else {
//           setMessages((prevMessages) => [
//             ...prevMessages,
//             { text: 'Sorry, I could not get a response from the model.', isUser: false },
//           ]);
//           success = true; // Treat as success to stop retrying for this specific error
//         }
//       } catch (error) {
//         console.error('Error fetching from Gemini API:', error);
//         retryCount++;
//         if (retryCount < maxRetries) {
//           const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff
//           await new Promise((resolve) => setTimeout(resolve, delay));
//         } else {
//           setMessages((prevMessages) => [
//             ...prevMessages,
//             {
//               text: 'Sorry, I am having trouble connecting right now. Please try again later.',
//               isUser: false,
//             },
//           ]);
//         }
//       } finally {
//         setLoading(false);
//       }
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter' && !loading) {
//       sendMessage();
//     }
//   };

//   return (
//     <div className="flex flex-col h-screen bg-gradient-to-br from-blue-100 to-purple-100 font-inter">
//       <style>
//         {`
//           @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
//         `}
//       </style>
//       <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
//         <div className="max-w-2xl mx-auto">
//           {messages.length === 0 && (
//             <div className="flex items-center justify-center h-full">
//               <p className="text-gray-500 text-lg">Type a question to start the conversation!</p>
//             </div>
//           )}
//           {messages.map((msg, index) => (
//             <ChatMessage key={index} message={msg.text} isUser={msg.isUser} />
//           ))}
//           {loading && (
//             <div className="flex justify-start mb-4">
//               <div className="max-w-md p-3 rounded-lg shadow-md bg-gray-200 text-gray-800 rounded-bl-none">
//                 <div className="flex items-center">
//                   <span className="dot-pulse"></span>
//                 </div>
//               </div>
//             </div>
//           )}
//           <div ref={messagesEndRef} />
//         </div>
//       </div>
//       <div className="p-4 sm:p-6 lg:p-8 bg-white shadow-lg">
//         <div className="max-w-2xl mx-auto flex items-center space-x-4">
//           <input
//             type="text"
//             className="flex-1 p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
//             placeholder="Ask about the ROI Calculator..."
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             onKeyPress={handleKeyPress}
//             disabled={loading}
//           />
//           <button
//             onClick={sendMessage}
//             className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition duration-300 ease-in-out transform hover:scale-105"
//             disabled={loading}
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-6 w-6"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M14 5l7 7m0 0l-7 7m7-7H3"
//               />
//             </svg>
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default App;

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
    const apiKey = 'AIzaSyB1OhfhAwwBu7kKpE36M_5QSDOOxKKkJco';

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

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