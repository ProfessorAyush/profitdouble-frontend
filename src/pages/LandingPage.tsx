import { useState } from "react";
import { 
  TrendingUp, 
  Package, 
  BarChart3, 
  Sparkles, 
  CheckCircle, 
  Menu, 
  X, 
  ArrowRight,
  Zap,
  Users,
  DollarSign,
  ShoppingBag,
  Target,
  Brain
} from "lucide-react";

export default function LandingPage() {
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const features = [
    {
      icon: <Brain className="text-blue-400" size={32} />,
      title: "AI-Powered Insights",
      description: "Smart analytics that predict trends and optimize your inventory automatically"
    },
    {
      icon: <BarChart3 className="text-purple-400" size={32} />,
      title: "Real-Time Analytics",
      description: "Track your business performance with live dashboards and actionable insights"
    },
    {
      icon: <Package className="text-green-400" size={32} />,
      title: "Smart Inventory",
      description: "Never run out of stock or overstock again with intelligent forecasting"
    },
    {
      icon: <DollarSign className="text-yellow-400" size={32} />,
      title: "Profit Optimization",
      description: "Maximize margins with pricing recommendations and cost analysis"
    },
    {
      icon: <Users className="text-pink-400" size={32} />,
      title: "Customer Insights",
      description: "Understand buying patterns and boost customer satisfaction"
    },
    {
      icon: <Zap className="text-orange-400" size={32} />,
      title: "Lightning Fast",
      description: "Cloud-based system that works seamlessly across all devices"
    }
  ];

  const stats = [
    { number: "2x", label: "Average Profit Increase" },
    { number: "500+", label: "Local Businesses" },
    { number: "100%", label: "Free Forever" },
    { number: "24/7", label: "AI Support" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Navbar */}
      <nav className="bg-gray-800 bg-opacity-50 backdrop-blur-md border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="text-white" size={24} />
              </div>
              <span className="text-2xl font-bold text-white">DoubleProfit.ai</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
              <a href="#how-it-works" className="text-gray-300 hover:text-white transition-colors">How It Works</a>
              <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</a>
              <a href="/login" className="text-gray-300 hover:text-white transition-colors">Sign In</a>
              <a 
                href="/register" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105"
              >
                Get Started Free
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 space-y-4">
              <a href="#features" className="block text-gray-300 hover:text-white transition-colors">Features</a>
              <a href="#how-it-works" className="block text-gray-300 hover:text-white transition-colors">How It Works</a>
              <a href="#pricing" className="block text-gray-300 hover:text-white transition-colors">Pricing</a>
              <a href="/login" className="block text-gray-300 hover:text-white transition-colors">Sign In</a>
              <a 
                href="/register" 
                className="block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg text-center"
              >
                Get Started Free
              </a>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="inline-flex items-center space-x-2 bg-blue-500 bg-opacity-20 border border-blue-500 rounded-full px-4 py-2 mb-8">
          <Sparkles className="text-blue-400" size={16} />
          <span className="text-blue-400 text-sm font-medium">AI-Powered Business Intelligence</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Double Your Profits with
          <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent"> AI-Powered </span>
          Inventory Management
        </h1>

        <p className="text-xl text-gray-400 mb-12 max-w-3xl mx-auto">
          Transform your local business with intelligent inventory management and real-time analytics. 
          Get actionable insights that help you make smarter decisions and maximize profits.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <a 
            href="/register"
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg flex items-center space-x-2"
          >
            <span>Start Free Today</span>
            <ArrowRight size={20} />
          </a>
          <a 
            href="#how-it-works"
            className="bg-gray-800 bg-opacity-50 border border-gray-700 text-white px-8 py-4 rounded-xl font-semibold hover:bg-opacity-70 transition-all"
          >
            Learn More
          </a>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <div key={index} className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent mb-2">
                {stat.number}
              </div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Powerful Features for Local Businesses</h2>
          <p className="text-xl text-gray-400">Everything you need to optimize your inventory and boost profits</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 hover:border-blue-500 transition-all transform hover:scale-105"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="bg-gray-800 bg-opacity-30 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">How Double Profit Works</h2>
            <p className="text-xl text-gray-400">Get started in minutes, see results in days</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Sign Up Free</h3>
              <p className="text-gray-400">Create your account in 30 seconds. No credit card required.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Add Your Inventory</h3>
              <p className="text-gray-400">Import your products or add them manually with our easy-to-use interface.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Watch Profits Grow</h3>
              <p className="text-gray-400">Get AI-powered insights and recommendations to optimize your business.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-center">
          <Target className="text-white mx-auto mb-6" size={48} />
          <h2 className="text-4xl font-bold text-white mb-6">Built for Local Businesses</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            We understand the challenges of running a local business. That's why Double Profit is designed 
            specifically to help small and medium businesses compete with larger retailers through smart 
            technology and data-driven insights.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-center space-x-2">
              <CheckCircle className="text-white" size={20} />
              <span className="text-white font-medium">No Hidden Fees</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <CheckCircle className="text-white" size={20} />
              <span className="text-white font-medium">Easy to Use</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <CheckCircle className="text-white" size={20} />
              <span className="text-white font-medium">Free Forever</span>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Simple, Transparent Pricing</h2>
          <p className="text-xl text-gray-400">One plan. Everything included. Forever free.</p>
        </div>

        <div className="max-w-lg mx-auto">
          <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-3xl p-8 border-2 border-blue-500">
            <div className="text-center mb-8">
              <div className="inline-flex items-center space-x-2 bg-blue-500 bg-opacity-20 border border-blue-500 rounded-full px-4 py-2 mb-4">
                <Sparkles className="text-blue-400" size={16} />
                <span className="text-blue-400 text-sm font-medium">Forever Free</span>
              </div>
              <div className="text-6xl font-bold text-white mb-2">$0</div>
              <p className="text-gray-400">Per month, forever</p>
            </div>

            <div className="space-y-4 mb-8">
              {[
                "Unlimited Products",
                "AI-Powered Analytics",
                "Real-Time Inventory Tracking",
                "Profit Optimization Tools",
                "Customer Insights",
                "24/7 Support",
                "Mobile & Desktop Access",
                "Data Export & Backup"
              ].map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="text-green-400 flex-shrink-0" size={20} />
                  <span className="text-gray-300">{feature}</span>
                </div>
              ))}
            </div>

            <a 
              href="/register"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
            >
              <span>Start Your Free Account</span>
              <ArrowRight size={20} />
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-3xl p-12 text-center border border-gray-700">
          <ShoppingBag className="text-blue-400 mx-auto mb-6" size={48} />
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Double Your Profits?
          </h2>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Join hundreds of local businesses using AI to optimize their inventory and maximize profits.
          </p>
          <a 
            href="/register"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
          >
            <span>Get Started Free - No Credit Card Required</span>
            <ArrowRight size={20} />
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="text-white" size={24} />
                </div>
                <span className="text-xl font-bold text-white">Double Profit</span>
              </div>
              <p className="text-gray-400 text-sm">
                AI-powered inventory management for local businesses.
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <div className="space-y-2">
                <a href="#features" className="block text-gray-400 hover:text-white text-sm transition-colors">Features</a>
                <a href="#pricing" className="block text-gray-400 hover:text-white text-sm transition-colors">Pricing</a>
                <a href="#how-it-works" className="block text-gray-400 hover:text-white text-sm transition-colors">How It Works</a>
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <div className="space-y-2">
                <a href="#" className="block text-gray-400 hover:text-white text-sm transition-colors">About</a>
                <a href="#" className="block text-gray-400 hover:text-white text-sm transition-colors">Blog</a>
                <a href="#" className="block text-gray-400 hover:text-white text-sm transition-colors">Contact</a>
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <div className="space-y-2">
                <a href="#" className="block text-gray-400 hover:text-white text-sm transition-colors">Privacy</a>
                <a href="#" className="block text-gray-400 hover:text-white text-sm transition-colors">Terms</a>
                <a href="#" className="block text-gray-400 hover:text-white text-sm transition-colors">Security</a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2025 Double Profit. All rights reserved. Made with ❤️ for local businesses.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}