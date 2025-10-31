import { useEffect, useState } from "react";
import { Receipt, ShoppingCart, Plus, Trash2, Package, DollarSign, Hash, CheckCircle, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

type Product = {
  _id: string;
  name: string;
  sellingPrice: number;
  quantity: number;
  size?: { height?: number; width?: number; depth?: number };
};

type BillItem = {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  maxQty: number;
  size?: { height?: number; width?: number; depth?: number } | null;
};

export default function Billing() {
  const [products, setProducts] = useState<Product[]>([]);
  const [billItems, setBillItems] = useState<BillItem[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [generatedTotal, setGeneratedTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (!userInfo) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const userInfoString = localStorage.getItem("userInfo");
      const userInfo = userInfoString ? JSON.parse(userInfoString) : null;
      const token = userInfo?.token || "";

      const res = await fetch(" https://doubleprofit-backend.onrender.com/products", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await res.json();
      
      // Check if data is an array
      if (Array.isArray(data)) {
        setProducts(data.filter((p: Product) => p.quantity > 0));
      } else if (data.products && Array.isArray(data.products)) {
        // In case API returns { products: [...] }
        setProducts(data.products.filter((p: Product) => p.quantity > 0));
      } else {
        console.error("Invalid data format:", data);
        setProducts([]);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      alert("Failed to load products. Please try again.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRow = () => {
    setBillItems([...billItems, { productId: "", name: "", quantity: 1, price: 0, maxQty: 0, size: null }]);
  };

  const handleProductChange = (index: number, productId: string) => {
    const product = products.find(p => p._id === productId);
    if (!product) return;

    const duplicate = billItems.some((b, i) => 
      i !== index &&
      b.productId === product._id &&
      JSON.stringify(b.size || null) === JSON.stringify(product.size || null)
    );
    
    if (duplicate) {
      alert("This product with the same size is already in the bill!");
      return;
    }

    const updated = [...billItems];
    updated[index] = {
      productId: product._id,
      name: product.name,
      quantity: 1,
      price: product.sellingPrice,
      maxQty: product.quantity,
      size: product.size || null,
    };
    setBillItems(updated);
  };

  const handleQtyChange = (index: number, qty: number) => {
    const updated = [...billItems];
    updated[index].quantity = Math.min(qty, updated[index].maxQty);
    setBillItems(updated);
  };

  const handlePriceChange = (index: number, price: number) => {
    const updated = [...billItems];
    updated[index].price = price;
    setBillItems(updated);
  };

  const handleDeleteRow = (index: number) => {
    const updated = [...billItems];
    updated.splice(index, 1);
    setBillItems(updated);
  };

  const handleSubmit = async () => {
    if (billItems.length === 0) return alert("Add at least one product");
    
    const items = billItems.map(b => ({
      productId: b.productId,
      name: b.name,
      quantity: b.quantity,
      price: b.price,
      size: b.size || undefined
    }));

    try {
      setLoading(true);
      const userInfoString = localStorage.getItem("userInfo");
      const userInfo = userInfoString ? JSON.parse(userInfoString) : null;
      const token = userInfo?.token || "";

      const res = await fetch(" https://doubleprofit-backend.onrender.com/bills", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
        body: JSON.stringify({ items }),
      });

      if (!res.ok) {
        throw new Error("Failed to generate bill");
      }

      const data = await res.json();
      setGeneratedTotal(data.totalAmount);
      setShowSuccess(true);
      setBillItems([]);
      fetchProducts();

      setTimeout(() => setShowSuccess(false), 5000);
    } catch (error) {
      console.error("Error generating bill:", error);
      alert("Failed to generate bill. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const total = billItems.reduce((acc, item) => acc + item.quantity * item.price, 0);
  const itemCount = billItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mb-4 shadow-lg">
            <Receipt className="text-white" size={32} />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Create New Bill</h1>
          <p className="text-gray-400">Add products and generate invoice</p>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="mb-6 bg-green-500 bg-opacity-20 border border-green-500 rounded-xl p-4 flex items-center justify-between animate-pulse">
            <div className="flex items-center space-x-3">
              <CheckCircle className="text-green-400" size={24} />
              <div>
                <span className="text-green-400 font-medium block">Bill generated successfully!</span>
                <span className="text-green-300 text-sm">Total Amount: ₹{generatedTotal}</span>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bill Items Section */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <ShoppingCart className="mr-2" size={24} />
                  Bill Items
                </h2>
              </div>

              <div className="p-6">
                {loading && products.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading products...</p>
                  </div>
                ) : billItems.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="mx-auto text-gray-600 mb-4" size={64} />
                    <p className="text-gray-400 text-lg">No items in bill</p>
                    <p className="text-gray-500 text-sm mt-2">Click "Add Product" to start</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {billItems.map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-gray-700 bg-opacity-50 rounded-xl p-4 border border-gray-600 hover:border-blue-500 transition-all"
                      >
                        <div className="flex flex-col space-y-3">
                          {/* Product Selection */}
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Product</label>
                            <select
                              value={item.productId}
                              onChange={e => handleProductChange(idx, e.target.value)}
                              className="w-full bg-gray-600 border border-gray-500 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            >
                              <option value="">Select Product</option>
                              {products.map(p => {
                                // Check if this product is already in bill (excluding current row)
                                const isUsed = billItems.some((b, i) => 
                                  i !== idx && 
                                  b.productId === p._id && 
                                  JSON.stringify(b.size || null) === JSON.stringify(p.size || null)
                                );
                                
                                // Check if this is the currently selected product
                                const isSelected = item.productId === p._id;
                                
                                // Show if it's selected OR not used by other rows
                                if (isSelected || !isUsed) {
                                  return (
                                    <option key={p._id} value={p._id}>
                                      {p.name} {p.size ? `(${p.size.height || "-"}×${p.size.width || "-"}×${p.size.depth || "-"})` : ""} - Stock: {p.quantity}
                                    </option>
                                  );
                                }
                                return null;
                              })}
                            </select>
                          </div>

                          {item.productId && (
                            <>
                              <div className="grid grid-cols-2 gap-3">
                                {/* Quantity */}
                                <div>
                                  <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                                    <Hash className="mr-1" size={14} />
                                    Quantity
                                  </label>
                                  <input
                                    type="number"
                                    min={1}
                                    max={item.maxQty}
                                    value={item.quantity}
                                    onChange={e => handleQtyChange(idx, parseInt(e.target.value) || 1)}
                                    className="w-full bg-gray-600 border border-gray-500 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                  />
                                  <p className="text-xs text-gray-400 mt-1">Max: {item.maxQty}</p>
                                </div>

                                {/* Price */}
                                <div>
                                  <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                                    <DollarSign className="mr-1" size={14} />
                                    Price per unit
                                  </label>
                                  <div className="relative">
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">₹</span>
                                    <input
                                      type="number"
                                      step="0.01"
                                      min={0}
                                      value={item.price}
                                      onChange={e => handlePriceChange(idx, parseFloat(e.target.value) || 0)}
                                      className="w-full bg-gray-600 border border-gray-500 text-white rounded-lg pl-8 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                    />
                                  </div>
                                </div>
                              </div>

                              {/* Item Total and Size */}
                              <div className="flex items-center justify-between pt-2 border-t border-gray-600">
                                <div>
                                  {item.size && (item.size.height || item.size.width || item.size.depth) && (
                                    <p className="text-xs text-gray-400">
                                      Size: {item.size.height || "-"} × {item.size.width || "-"} × {item.size.depth || "-"} cm
                                    </p>
                                  )}
                                </div>
                                <div className="text-right">
                                  <p className="text-xs text-gray-400">Subtotal</p>
                                  <p className="text-white font-bold text-lg">₹{(item.quantity * item.price).toFixed(2)}</p>
                                </div>
                              </div>

                              {/* Delete Button */}
                              <button
                                onClick={() => handleDeleteRow(idx)}
                                className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-all flex items-center justify-center space-x-2 font-medium"
                              >
                                <Trash2 size={16} />
                                <span>Remove Item</span>
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Product Button */}
                <button
                  onClick={handleAddRow}
                  disabled={loading || products.length === 0}
                  className="w-full mt-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all flex items-center justify-center space-x-2 font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus size={20} />
                  <span>Add Product</span>
                </button>
              </div>
            </div>
          </div>

          {/* Summary Section */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700 overflow-hidden sticky top-6">
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-4">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <Receipt className="mr-2" size={24} />
                  Bill Summary
                </h2>
              </div>

              <div className="p-6 space-y-6">
                {/* Stats */}
                <div className="space-y-4">
                  <div className="bg-gray-700 bg-opacity-50 rounded-lg p-4">
                    <p className="text-gray-400 text-sm mb-1">Total Items</p>
                    <p className="text-white text-2xl font-bold">{billItems.length}</p>
                  </div>

                  <div className="bg-gray-700 bg-opacity-50 rounded-lg p-4">
                    <p className="text-gray-400 text-sm mb-1">Total Quantity</p>
                    <p className="text-white text-2xl font-bold">{itemCount}</p>
                  </div>

                  <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-4 shadow-lg">
                    <p className="text-green-100 text-sm mb-2">Grand Total</p>
                    <p className="text-white text-4xl font-bold">₹{total.toFixed(2)}</p>
                  </div>
                </div>

                {/* Generate Bill Button */}
                <button
                  onClick={handleSubmit}
                  disabled={billItems.length === 0 || loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <Receipt size={20} />
                      <span>Generate Bill</span>
                    </>
                  )}
                </button>

                {/* Info Box */}
                {billItems.length === 0 && (
                  <div className="bg-blue-500 bg-opacity-20 border border-blue-500 rounded-lg p-3 flex items-start space-x-2">
                    <AlertCircle className="text-blue-400 mt-0.5 flex-shrink-0" size={16} />
                    <p className="text-blue-300 text-xs">
                      Add at least one product to generate a bill
                    </p>
                  </div>
                )}

                {billItems.length > 0 && (
                  <div className="bg-green-500 bg-opacity-20 border border-green-500 rounded-lg p-3 flex items-start space-x-2">
                    <CheckCircle className="text-green-400 mt-0.5 flex-shrink-0" size={16} />
                    <p className="text-green-300 text-xs">
                      Ready to generate bill with {billItems.length} product{billItems.length > 1 ? 's' : ''}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}