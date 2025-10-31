import { useState } from "react";
import { UserPlus, Mail, Lock, User, AlertCircle, Sparkles, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(" https://doubleprofit-backend.onrender.com/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");

      localStorage.setItem("userInfo", JSON.stringify(data));
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Password strength indicator
  const getPasswordStrength = () => {
    const pwd = form.password;
    if (!pwd) return { strength: 0, text: "", color: "" };
    
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (pwd.length >= 12) strength++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++;
    if (/\d/.test(pwd)) strength++;
    if (/[^A-Za-z0-9]/.test(pwd)) strength++;

    if (strength <= 2) return { strength, text: "Weak", color: "bg-red-500" };
    if (strength <= 3) return { strength, text: "Fair", color: "bg-yellow-500" };
    if (strength <= 4) return { strength, text: "Good", color: "bg-blue-500" };
    return { strength, text: "Strong", color: "bg-green-500" };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
            <UserPlus className="text-white" size={32} />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-gray-400">Join us to start managing your inventory</p>
        </div>

        {/* Register Card */}
        <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700 overflow-hidden">
          <div className="p-8">
            {/* Error Message */}
            {error && (
              <div className="mb-6 bg-red-500 bg-opacity-20 border border-red-500 rounded-xl p-4 flex items-center space-x-3">
                <AlertCircle className="text-red-400 flex-shrink-0" size={20} />
                <span className="text-red-400 text-sm">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Input */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-700 bg-opacity-50 border border-gray-600 text-white rounded-lg pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-500"
                  />
                </div>
              </div>

              {/* Email Input */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-700 bg-opacity-50 border border-gray-600 text-white rounded-lg pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-500"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="password"
                    name="password"
                    placeholder="Create a strong password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                    className="w-full bg-gray-700 bg-opacity-50 border border-gray-600 text-white rounded-lg pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-500"
                  />
                </div>
                
                {/* Password Strength Indicator */}
                {form.password && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-400">Password strength:</span>
                      <span className={`text-xs font-medium ${
                        passwordStrength.strength <= 2 ? 'text-red-400' :
                        passwordStrength.strength <= 3 ? 'text-yellow-400' :
                        passwordStrength.strength <= 4 ? 'text-blue-400' :
                        'text-green-400'
                      }`}>
                        {passwordStrength.text}
                      </span>
                    </div>
                    <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${passwordStrength.color} transition-all duration-300`}
                        style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  id="terms"
                  required
                  className="mt-1 w-4 h-4 bg-gray-700 border-gray-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <label htmlFor="terms" className="text-sm text-gray-400">
                  I agree to the{" "}
                  <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">
                    Terms and Conditions
                  </a>
                  {" "}and{" "}
                  <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">
                    Privacy Policy
                  </a>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <UserPlus size={20} />
                    <span>Create Account</span>
                  </>
                )}
              </button>
            </form>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-gray-400 text-sm">
                Already have an account?{" "}
                <a href="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                  Sign in instead
                </a>
              </p>
            </div>
          </div>

          {/* Decorative Footer */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-2"></div>
        </div>

        {/* Additional Info */}
        <p className="text-center text-gray-500 mt-6 text-sm flex items-center justify-center gap-2">
          <Sparkles size={16} />
          Secure registration with encrypted data
        </p>
      </div>
    </div>
  );
}