// src/components/Navbar.tsx
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X, LayoutDashboard, Package, ShoppingCart, Receipt, FileText, User, LogOut, Sparkles } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [userInfo, setUserInfo] = useState<{ name: string; email: string } | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const userInfoString = localStorage.getItem("userInfo");
    if (userInfoString) {
      try {
        const parsedUserInfo = JSON.parse(userInfoString);
        setUserInfo({
          name: parsedUserInfo.name,
          email: parsedUserInfo.email
        });
      } catch (error) {
        console.error("Failed to parse user info:", error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/add-inventory", label: "Inventory", icon: Package },
    { path: "/show-products", label: "Products", icon: ShoppingCart },
    { path: "/billing", label: "Billing", icon: Receipt },
    { path: "/bills", label: "History", icon: FileText },
    { path: "/aidashboard", label: "AI Insights", icon: Sparkles },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-gray-900 border-b border-gray-800 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          {/* Logo - More Compact */}
          <Link to="/dashboard" className="flex items-center space-x-2 group flex-shrink-0">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center transform group-hover:scale-105 transition-transform duration-200">
              <span className="text-base font-bold">P</span>
            </div>
            <span className="text-lg font-semibold hidden sm:block">
              Profit Double
            </span>
          </Link>

          {/* Desktop Navigation - Centered and Cleaner */}
          <div className="hidden md:flex items-center space-x-1 flex-1 justify-center max-w-2xl">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isAI = item.path === "/aidashboard";
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`group relative flex items-center space-x-1.5 px-3 py-1.5 rounded-md transition-all duration-200 ${
                    isActive(item.path)
                      ? isAI 
                        ? "bg-purple-600/20 text-purple-400"
                        : "bg-blue-600/20 text-blue-400"
                      : "text-gray-400 hover:text-white hover:bg-gray-800"
                  }`}
                >
                  <Icon size={16} className={isAI && isActive(item.path) ? "animate-pulse" : ""} />
                  <span className="text-sm font-medium">{item.label}</span>
                  {isActive(item.path) && (
                    <div className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-full ${
                      isAI ? "bg-purple-400" : "bg-blue-400"
                    }`} />
                  )}
                </Link>
              );
            })}
          </div>

          {/* User Menu - Desktop - More Compact */}
          <div className="hidden md:block relative flex-shrink-0">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-md hover:bg-gray-800 transition-all duration-200 group"
            >
              <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center group-hover:scale-105 transition-transform">
                <User size={16} />
              </div>
              <span className="text-sm font-medium max-w-[120px] truncate">
                {userInfo?.name || "User"}
              </span>
            </button>

            {/* Dropdown Menu - Cleaner */}
            {userMenuOpen && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setUserMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-52 bg-gray-800 rounded-lg shadow-xl border border-gray-700 py-1 z-20">
                  <div className="px-4 py-2.5 border-b border-gray-700">
                    <p className="text-sm font-medium text-white truncate">{userInfo?.name}</p>
                    <p className="text-xs text-gray-400 truncate">{userInfo?.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-150 flex items-center space-x-2"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-md hover:bg-gray-800 transition-colors duration-200"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation - Cleaner */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out border-t border-gray-800 ${
          isOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <div className="px-4 py-3 space-y-1 bg-gray-900">
          {/* User Info - Mobile - More Compact */}
          <div className="px-3 py-2.5 bg-gray-800 rounded-lg mb-2 border border-gray-700">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <User size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-white truncate">{userInfo?.name || "User"}</p>
                <p className="text-xs text-gray-400 truncate">{userInfo?.email || ""}</p>
              </div>
            </div>
          </div>

          {/* Navigation Links - More Compact */}
          {navItems.map((item) => {
            const Icon = item.icon;
            const isAI = item.path === "/aidashboard";
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center space-x-2.5 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                  isActive(item.path)
                    ? isAI
                      ? "bg-purple-600/20 text-purple-400 border border-purple-500/30"
                      : "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white border border-transparent"
                }`}
              >
                <Icon size={18} className={isAI && isActive(item.path) ? "animate-pulse" : ""} />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}

          {/* Logout Button - Mobile */}
          <button
            onClick={() => {
              setIsOpen(false);
              handleLogout();
            }}
            className="w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-all duration-200 border border-transparent hover:border-gray-700"
          >
            <LogOut size={18} />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
}