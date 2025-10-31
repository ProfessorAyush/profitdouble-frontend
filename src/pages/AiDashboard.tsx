import { useEffect, useState, useRef } from "react";
import { 
  Sparkles, Send, TrendingUp, AlertCircle, Target, Zap, 
  Brain, MessageSquare, Loader2, BarChart3, Package, DollarSign,
  ChevronRight, Lightbulb, ArrowRight
} from "lucide-react";
import dotenv from 'dotenv';
// TODO: Replace with your actual Gemini API key
const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY || "GEMINI_API_KEY";

type Message = {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

type Product = {
  _id: string;
  name: string;
  brand: string;
  sellingPrice: number;
  costPrice: number;
  quantity: number;
};

type Bill = {
  _id: string;
  items: Array<{ productId: string; name: string; quantity: number; price: number }>;
  totalAmount: number;
  createdAt: string;
};

export default function AIDashboard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [insights, setInsights] = useState<string[]>([]);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const userInfoString = localStorage.getItem('userInfo');
  const userInfo = userInfoString ? JSON.parse(userInfoString) : null;
  const token = userInfo?.token || "";

  useEffect(() => {
    if (userInfo) {
      fetchData();
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchData = async () => {
    try {
      const [productsRes, billsRes] = await Promise.all([
        fetch("http://localhost:5000/api/products", {
          method: "GET",
          headers: { 
            "Content-Type": "application/json",
            "auth-token": token 
          },
        }),
        fetch("http://localhost:5000/api/bills", {
          method: "GET",
          headers: { 
            "Content-Type": "application/json",
            "auth-token": token 
          },
        })
      ]);
      
      const productsData = await productsRes.json();
      const billsData = await billsRes.json();
      
      setProducts(Array.isArray(productsData) ? productsData : []);
      setBills(Array.isArray(billsData) ? billsData : []);
      
      // Auto-generate insights on load
      if (productsData.length > 0 || billsData.length > 0) {
        generateAutoInsights(productsData, billsData);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  const generateAutoInsights = async (prods: Product[], billsList: Bill[]) => {
    setLoadingInsights(true);
    try {
      const businessData = prepareBusinessData(prods, billsList);
      const prompt = `As a business analyst AI, analyze this inventory and sales data and provide 5 key actionable insights in bullet points. Be specific and data-driven:

${businessData}

Provide insights about:
1. Inventory optimization
2. Revenue opportunities
3. Stock alerts
4. Pricing suggestions
5. Sales trends

Format: Return ONLY 5 bullet points, each starting with an emoji and being concise (max 15 words each).`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: prompt }]
            }]
          })
        }
      );

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "Unable to generate insights.";
      
      // Better parsing - split by asterisks or numbers
      const insightsList = text
        .split(/\*\*|\n\n|\n/)
        .map((line: string) => line.replace(/^[•\-\d\.\*\s]+/, '').trim())
        .filter((line: string) => line.length > 10 && line.length < 200)
        .slice(0, 5);
      
      setInsights(insightsList.length > 0 ? insightsList : [text.substring(0, 500)]);
    } catch (error) {
      console.error("Error generating insights:", error);
      setInsights(["AI is currently unavailable. Please try again later."]);
    } finally {
      setLoadingInsights(false);
    }
  };

  const prepareBusinessData = (prods: Product[], billsList: Bill[]) => {
    const totalRevenue = billsList.reduce((sum, b) => sum + b.totalAmount, 0);
    const lowStock = prods.filter(p => p.quantity < 10);
    const topProducts = getTopSellingProducts(billsList).slice(0, 3);
    
    return `
INVENTORY: ${prods.length} products, Total Value: ₹${prods.reduce((s, p) => s + (p.costPrice * p.quantity), 0)}
LOW STOCK: ${lowStock.length} items (${lowStock.map(p => p.name).join(', ')})
REVENUE: ₹${totalRevenue} from ${billsList.length} bills
TOP SELLERS: ${topProducts.map(p => `${p.name} (${p.quantity} sold)`).join(', ')}
    `.trim();
  };

  const getTopSellingProducts = (billsList: Bill[]) => {
    const salesMap = new Map<string, { name: string; quantity: number }>();
    billsList.forEach(bill => {
      bill.items.forEach(item => {
        const existing = salesMap.get(item.productId) || { name: item.name, quantity: 0 };
        existing.quantity += item.quantity;
        salesMap.set(item.productId, existing);
      });
    });
    return Array.from(salesMap.values()).sort((a, b) => b.quantity - a.quantity);
  };

  const handleSendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      role: "user",
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const businessData = prepareBusinessData(products, bills);
      const conversationHistory = messages.map(m => 
        `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`
      ).join("\n");

      const prompt = `You are an AI business consultant for an inventory management system called "Double Profit". 

BUSINESS DATA:
${businessData}

CONVERSATION HISTORY:
${conversationHistory}

USER QUESTION: ${input}

Provide a helpful, concise answer (max 100 words). Use the business data to give specific insights. If asked about products, bills, or inventory, reference the actual data provided.`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: prompt }]
            }]
          })
        }
      );

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      
      // Better error logging
      console.log("API Response:", data);
      
      if (data.error) {
        throw new Error(data.error.message || "API Error");
      }
      
      const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't process that request.";

      const assistantMessage: Message = {
        role: "assistant",
        content: aiResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error("Error calling Gemini API:", error);
      const errorMessage: Message = {
        role: "assistant",
        content: `Error: ${error.message || "AI is currently unavailable. Please try again later."}`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    "What products should I restock?",
    "Show me my top selling products",
    "How can I increase my profit?",
    "What's my inventory worth?"
  ];

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt);
  };

  // Calculate key metrics
  const totalRevenue = bills.reduce((sum, b) => sum + b.totalAmount, 0);
  const lowStockCount = products.filter(p => p.quantity < 10).length;
  const inventoryValue = products.reduce((sum, p) => sum + (p.costPrice * p.quantity), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl mb-4 shadow-lg">
            <Sparkles className="text-white" size={32} />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">AI Business Assistant</h1>
          <p className="text-gray-400">Get intelligent insights and recommendations powered by AI</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm mb-1">Total Revenue</p>
                <p className="text-white text-2xl font-bold">₹{(totalRevenue / 1000).toFixed(1)}K</p>
              </div>
              <DollarSign className="text-blue-100" size={32} />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-5 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm mb-1">Products</p>
                <p className="text-white text-2xl font-bold">{products.length}</p>
              </div>
              <Package className="text-purple-100" size={32} />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-5 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm mb-1">Low Stock Alerts</p>
                <p className="text-white text-2xl font-bold">{lowStockCount}</p>
              </div>
              <AlertCircle className="text-orange-100" size={32} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* AI Insights Panel */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4">
                <h2 className="text-white font-bold text-lg flex items-center">
                  <Brain className="mr-2" size={20} />
                  AI Insights
                </h2>
              </div>
              
              <div className="p-4 space-y-3">
                {loadingInsights ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="text-purple-400 animate-spin" size={32} />
                  </div>
                ) : insights.length > 0 ? (
                  insights.map((insight, idx) => (
                    <div key={idx} className="bg-gray-700 bg-opacity-50 rounded-lg p-3 border border-gray-600">
                      <div className="flex items-start space-x-2">
                        <Lightbulb className="text-yellow-400 flex-shrink-0 mt-0.5" size={16} />
                        <p className="text-gray-300 text-sm">{insight}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Sparkles className="mx-auto text-gray-600 mb-3" size={32} />
                    <p className="text-gray-400 text-sm">AI insights will appear here</p>
                  </div>
                )}
                
                <button
                  onClick={() => generateAutoInsights(products, bills)}
                  disabled={loadingInsights}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all flex items-center justify-center space-x-2 text-sm font-medium disabled:opacity-50"
                >
                  <Zap size={16} />
                  <span>Refresh Insights</span>
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden mt-6">
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-4">
                <h2 className="text-white font-bold text-lg flex items-center">
                  <Target className="mr-2" size={20} />
                  Quick Questions
                </h2>
              </div>
              
              <div className="p-4 space-y-2">
                {quickPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuickPrompt(prompt)}
                    className="w-full bg-gray-700 bg-opacity-50 text-left text-gray-300 text-sm py-2 px-3 rounded-lg hover:bg-gray-600 transition-all flex items-center justify-between group"
                  >
                    <span>{prompt}</span>
                    <ArrowRight className="text-gray-500 group-hover:text-green-400 transition-colors" size={16} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden h-[600px] flex flex-col">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4">
                <h2 className="text-white font-bold text-lg flex items-center">
                  <MessageSquare className="mr-2" size={20} />
                  Chat with AI Assistant
                </h2>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center py-12">
                    <Brain className="mx-auto text-gray-600 mb-4" size={64} />
                    <p className="text-gray-400 text-lg mb-2">Start a conversation</p>
                    <p className="text-gray-500 text-sm">Ask me anything about your inventory, sales, or business strategy!</p>
                  </div>
                ) : (
                  messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl p-4 ${
                          msg.role === "user"
                            ? "bg-gradient-to-br from-blue-600 to-purple-600 text-white"
                            : "bg-gray-700 bg-opacity-50 text-gray-200 border border-gray-600"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                        <p className={`text-xs mt-2 ${msg.role === "user" ? "text-blue-100" : "text-gray-500"}`}>
                          {msg.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-700 bg-opacity-50 rounded-2xl p-4 border border-gray-600">
                      <div className="flex items-center space-x-2">
                        <Loader2 className="text-purple-400 animate-spin" size={20} />
                        <p className="text-gray-400 text-sm">AI is thinking...</p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 bg-gray-900 bg-opacity-50 border-t border-gray-700">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Ask anything about your business..."
                    className="flex-1 bg-gray-700 border border-gray-600 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={loading || !input.trim()}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    <Send size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}