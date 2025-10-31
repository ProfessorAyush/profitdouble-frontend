import { useEffect, useState } from "react";

import { 
  TrendingUp, TrendingDown, DollarSign, Package, ShoppingCart, 
  AlertCircle, BarChart3, PieChart, Activity, Archive, 
  Zap, Target, Award, Clock
} from "lucide-react";
import { 
  BarChart, Bar, LineChart, Line, PieChart as RePieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart
} from "recharts";
import { useNavigate } from "react-router-dom";

const isLoggedIn = () => {
  const user = localStorage.getItem("userInfo");
  return user ? true : false;
};

const userInfoString = localStorage.getItem('userInfo');
const userInfo = userInfoString ? JSON.parse(userInfoString) : null;
const token = userInfo?.token || "";
type Product = {
  _id: string;
  name: string;
  brand: string;
  sellingPrice: number;
  costPrice: number;
  quantity: number;
  size?: { height?: number; width?: number; depth?: number };
};

type BillItem = {
  productId: string;
  name: string;
  quantity: number;
  price: number;
};

type Bill = {
  _id: string;
  items: BillItem[];
  totalAmount: number;
  createdAt: string;
};

export default function Dashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const userInfo = localStorage.getItem("userInfo");
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (!userInfo) {
      navigate("/login");
    }
    else{
      fetchData();
    }
  }, [navigate]);

  const fetchData = async () => {
    try {
      const [productsRes, billsRes] = await Promise.all([
        fetch(" https://doubleprofit-backend.onrender.com/api/products", {
        method: "GET",
        headers: { "Content-Type": "application/json",
          "auth-token" : token || "",
         },
      }),
        fetch(" https://doubleprofit-backend.onrender.com/api/bills", {
        method: "GET",
        headers: { "Content-Type": "application/json",
          "auth-token" : token || "",
         },
      })
      ]);
      const productsData = await productsRes.json();
      const billsData = await billsRes.json();
      setProducts(Array.isArray(productsData) ? productsData : []);
      setBills(Array.isArray(billsData) ? billsData : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  // if (!loggedIn) return <Navigate to="/login" replace />;


  // Calculate metrics
  const totalProducts = Array.isArray(products) ? products.length : 0;
const totalStock = Array.isArray(products) ? products.reduce((sum, p) => sum + p.quantity, 0) : 0;
const lowStockItems = Array.isArray(products) ? products.filter(p => p.quantity < 10).length : 0;

const totalRevenue = Array.isArray(bills) ? bills.reduce((sum, b) => sum + b.totalAmount, 0) : 0;
const totalBills = Array.isArray(bills) ? bills.length : 0;
const avgBillValue = totalBills > 0 ? totalRevenue / totalBills : 0;


  const totalInventoryValue = products.reduce((sum, p) => sum + (p.costPrice * p.quantity), 0);
  const potentialRevenue = products.reduce((sum, p) => sum + (p.sellingPrice * p.quantity), 0);
  const potentialProfit = potentialRevenue - totalInventoryValue;

  // Product sales analysis from bills
  const productSalesMap = new Map<string, { name: string; quantity: number; revenue: number }>();
  bills.forEach(bill => {
    bill.items.forEach(item => {
      const existing = productSalesMap.get(item.productId) || { name: item.name, quantity: 0, revenue: 0 };
      existing.quantity += item.quantity;
      existing.revenue += item.quantity * item.price;
      productSalesMap.set(item.productId, existing);
    });
  });

  const productSales = Array.from(productSalesMap.values());
  const topSellingProducts = productSales.sort((a, b) => b.quantity - a.quantity).slice(0, 5);
  const lowestSellingProducts = productSales.sort((a, b) => a.quantity - b.quantity).slice(0, 5);
  const topRevenueProducts = productSales.sort((a, b) => b.revenue - a.revenue).slice(0, 5);

  // Brand analysis
  const brandMap = new Map<string, number>();
  products.forEach(p => {
    brandMap.set(p.brand, (brandMap.get(p.brand) || 0) + p.quantity);
  });
  const brandData = Array.from(brandMap.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  // Revenue trend (last 30 days)
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return date.toISOString().split('T')[0];
  });

  const revenueTrend = last30Days.map(date => {
    const dayBills = bills.filter(b => b.createdAt.startsWith(date));
    const revenue = dayBills.reduce((sum, b) => sum + b.totalAmount, 0);
    const count = dayBills.length;
    return { date: date.slice(5), revenue, count };
  });

  // Stock status distribution
  const stockStatus = [
    { name: "Critical (< 5)", value: products.filter(p => p.quantity < 5).length, color: "#ef4444" },
    { name: "Low (5-10)", value: products.filter(p => p.quantity >= 5 && p.quantity < 10).length, color: "#f97316" },
    { name: "Medium (10-30)", value: products.filter(p => p.quantity >= 10 && p.quantity < 30).length, color: "#eab308" },
    { name: "Healthy (30+)", value: products.filter(p => p.quantity >= 30).length, color: "#22c55e" }
  ];

  // Profit margin distribution
  const profitMarginData = products.map(p => ({
    name: p.name.slice(0, 15) + (p.name.length > 15 ? "..." : ""),
    margin: parseFloat((((p.sellingPrice - p.costPrice) / p.costPrice) * 100).toFixed(1))
  })).sort((a, b) => b.margin - a.margin).slice(0, 10);

  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 text-lg">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
            <Activity className="text-white" size={32} />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Analytics Dashboard</h1>
          <p className="text-gray-400">Comprehensive business insights and metrics</p>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <Package className="text-blue-100" size={24} />
              <span className="text-blue-100 text-xs font-medium">INVENTORY</span>
            </div>
            <p className="text-white text-3xl font-bold">{totalProducts}</p>
            <p className="text-blue-100 text-sm mt-1">Total Products</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="text-green-100" size={24} />
              <span className="text-green-100 text-xs font-medium">REVENUE</span>
            </div>
            <p className="text-white text-3xl font-bold">₹{(totalRevenue / 1000).toFixed(1)}K</p>
            <p className="text-green-100 text-sm mt-1">Total Sales</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <ShoppingCart className="text-purple-100" size={24} />
              <span className="text-purple-100 text-xs font-medium">ORDERS</span>
            </div>
            <p className="text-white text-3xl font-bold">{totalBills}</p>
            <p className="text-purple-100 text-sm mt-1">Total Bills</p>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <AlertCircle className="text-orange-100" size={24} />
              <span className="text-orange-100 text-xs font-medium">ALERTS</span>
            </div>
            <p className="text-white text-3xl font-bold">{lowStockItems}</p>
            <p className="text-orange-100 text-sm mt-1">Low Stock Items</p>
          </div>
        </div>

        {/* Secondary Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-xl border border-gray-700 p-5">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-cyan-500 bg-opacity-20 rounded-lg flex items-center justify-center">
                <Target className="text-cyan-400" size={20} />
              </div>
              <div>
                <p className="text-gray-400 text-xs">Avg Bill Value</p>
                <p className="text-white text-xl font-bold">₹{avgBillValue.toFixed(0)}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-xl border border-gray-700 p-5">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-emerald-500 bg-opacity-20 rounded-lg flex items-center justify-center">
                <Archive className="text-emerald-400" size={20} />
              </div>
              <div>
                <p className="text-gray-400 text-xs">Inventory Value</p>
                <p className="text-white text-xl font-bold">₹{(totalInventoryValue / 1000).toFixed(1)}K</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-xl border border-gray-700 p-5">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-yellow-500 bg-opacity-20 rounded-lg flex items-center justify-center">
                <Zap className="text-yellow-400" size={20} />
              </div>
              <div>
                <p className="text-gray-400 text-xs">Potential Profit</p>
                <p className="text-white text-xl font-bold">₹{(potentialProfit / 1000).toFixed(1)}K</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Trend */}
          <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold text-lg flex items-center">
                <TrendingUp className="mr-2 text-green-400" size={20} />
                Revenue Trend (30 Days)
              </h3>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={revenueTrend}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9ca3af" style={{ fontSize: '12px' }} />
                <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                  labelStyle={{ color: '#f3f4f6' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#10b981" fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Stock Distribution */}
          <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold text-lg flex items-center">
                <PieChart className="mr-2 text-blue-400" size={20} />
                Stock Status Distribution
              </h3>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <RePieChart>
                <Pie
                  data={stockStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {stockStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  formatter={(value, entry: any) => (
                    <span style={{ color: '#9ca3af', fontSize: '12px' }}>
                      {value}: {entry.payload.value}
                    </span>
                  )}
                />
              </RePieChart>
            </ResponsiveContainer>
          </div>

          {/* Top Selling Products */}
          <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold text-lg flex items-center">
                <Award className="mr-2 text-yellow-400" size={20} />
                Top Selling Products
              </h3>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={topSellingProducts} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis type="number" stroke="#9ca3af" style={{ fontSize: '12px' }} />
                <YAxis dataKey="name" type="category" stroke="#9ca3af" width={100} style={{ fontSize: '11px' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                  labelStyle={{ color: '#f3f4f6' }}
                />
                <Bar dataKey="quantity" fill="#3b82f6" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Profit Margins */}
          <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold text-lg flex items-center">
                <BarChart3 className="mr-2 text-purple-400" size={20} />
                Top Profit Margins
              </h3>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={profitMarginData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9ca3af" angle={-45} textAnchor="end" height={80} style={{ fontSize: '10px' }} />
                <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                  labelStyle={{ color: '#f3f4f6' }}
                />
                <Bar dataKey="margin" fill="#8b5cf6" radius={[8, 8, 0, 0]}>
                  {profitMarginData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Product Performance Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Revenue Products */}
          <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-4">
              <h3 className="text-white font-bold text-lg flex items-center">
                <DollarSign className="mr-2" size={20} />
                Top Revenue Generators
              </h3>
            </div>
            <div className="p-4">
              {topRevenueProducts.map((product, idx) => (
                <div key={idx} className="flex items-center justify-between py-3 border-b border-gray-700 last:border-0">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500 bg-opacity-20 rounded-lg flex items-center justify-center">
                      <span className="text-green-400 font-bold text-sm">{idx + 1}</span>
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">{product.name}</p>
                      <p className="text-gray-400 text-xs">{product.quantity} units sold</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-green-400 font-bold">₹{product.revenue.toFixed(0)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Lowest Selling Products */}
          <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden">
            <div className="bg-gradient-to-r from-red-600 to-orange-600 p-4">
              <h3 className="text-white font-bold text-lg flex items-center">
                <TrendingDown className="mr-2" size={20} />
                Needs Attention
              </h3>
            </div>
            <div className="p-4">
              {lowestSellingProducts.length > 0 ? lowestSellingProducts.map((product, idx) => (
                <div key={idx} className="flex items-center justify-between py-3 border-b border-gray-700 last:border-0">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-orange-500 bg-opacity-20 rounded-lg flex items-center justify-center">
                      <AlertCircle className="text-orange-400" size={16} />
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">{product.name}</p>
                      <p className="text-gray-400 text-xs">{product.quantity} units sold</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-orange-400 font-bold">₹{product.revenue.toFixed(0)}</p>
                  </div>
                </div>
              )) : (
                <p className="text-gray-400 text-center py-4">No sales data available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}