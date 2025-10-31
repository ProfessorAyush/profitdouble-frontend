import { useEffect, useState } from "react";
import { Receipt, Calendar, Package, DollarSign, FileText, Clock, TrendingUp, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

type BillItem = {
  name: string;
  quantity: number;
  price: number;
  size?: { height?: number; width?: number; depth?: number } | null;
};

type Bill = {
  _id: string;
  items: BillItem[];
  totalAmount: number;
  createdAt: string;
};

const token = JSON.parse(localStorage.getItem("userInfo") || "{}")?.token;

export default function BillHistory() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (!userInfo) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      const res = await fetch(" https://doubleprofit-backend.onrender.com/api/bills",{
      headers: { "auth-token" : token || "" },
    });
      const data = await res.json();
      setBills(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const totalRevenue = Array.isArray(bills) 
  ? bills.reduce((sum, bill) => sum + bill.totalAmount, 0) 
  : 0;
  const totalBills = bills.length;
  const avgBillAmount = totalBills > 0 ? totalRevenue / totalBills : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-400 text-lg">Loading bills...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl mb-4 shadow-lg">
            <FileText className="text-white" size={32} />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Bill History</h1>
          <p className="text-gray-400">View all generated invoices and transactions</p>
        </div>

        {bills.length === 0 ? (
          <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700 p-12">
            <div className="text-center">
              <Receipt className="mx-auto text-gray-600 mb-4" size={64} />
              <p className="text-gray-400 text-xl mb-2">No bills available</p>
              <p className="text-gray-500">Start creating bills to see them here</p>
            </div>
          </div>
        ) : (
          <>
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm mb-1">Total Bills</p>
                    <p className="text-white text-3xl font-bold">{totalBills}</p>
                  </div>
                  <Receipt className="text-white opacity-80" size={40} />
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm mb-1">Total Revenue</p>
                    <p className="text-white text-3xl font-bold">₹{totalRevenue.toFixed(2)}</p>
                  </div>
                  <DollarSign className="text-white opacity-80" size={40} />
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm mb-1">Average Bill</p>
                    <p className="text-white text-3xl font-bold">₹{avgBillAmount.toFixed(2)}</p>
                  </div>
                  <TrendingUp className="text-white opacity-80" size={40} />
                </div>
              </div>
            </div>

            {/* Bills List */}
            <div className="space-y-6">
              {bills.map((bill) => (
                <div
                  key={bill._id}
                  className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700 overflow-hidden hover:border-blue-500 transition-all"
                >
                  {/* Bill Header */}
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                      <div className="flex items-center space-x-3">
                        <Receipt className="text-white" size={24} />
                        <div>
                          <p className="text-white font-bold text-lg">Bill #{bill._id.slice(-8).toUpperCase()}</p>
                          <p className="text-blue-100 text-sm">{bill.items.length} item{bill.items.length > 1 ? 's' : ''}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 text-blue-100">
                        <Calendar size={16} />
                        <span className="text-sm">{new Date(bill.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Bill Items */}
                  <div className="p-6">
                    <div className="space-y-3">
                      {bill.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="bg-gray-700 bg-opacity-50 rounded-lg p-4 border border-gray-600"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                            <div className="flex-1">
                              <div className="flex items-start space-x-2">
                                <Package className="text-gray-400 mt-1 flex-shrink-0" size={16} />
                                <div>
                                  <p className="text-white font-medium">{item.name}</p>
                                  {item.size && (item.size.height || item.size.width || item.size.depth) && (
                                    <p className="text-gray-400 text-xs mt-1">
                                      Size: {item.size.height || "-"} × {item.size.width || "-"} × {item.size.depth || "-"} cm
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-4 text-sm">
                              <div className="text-gray-300">
                                <span className="text-gray-400">Qty:</span> {item.quantity}
                              </div>
                              <div className="text-gray-300">
                                <span className="text-gray-400">×</span> ₹{item.price.toFixed(2)}
                              </div>
                              <div className="text-white font-bold">
                                = ₹{(item.quantity * item.price).toFixed(2)}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Bill Total */}
                    <div className="mt-6 pt-4 border-t border-gray-600">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <DollarSign className="text-green-400" size={20} />
                          <span className="text-gray-400 font-medium">Grand Total</span>
                        </div>
                        <div className="text-right">
                          <p className="text-green-400 text-3xl font-bold">₹{bill.totalAmount.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}