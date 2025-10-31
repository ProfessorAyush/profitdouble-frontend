import { useEffect, useState } from "react";
import { Package, DollarSign, Hash, Ruler, FileText, Sparkles, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AddInventory() {
  const [form, setForm] = useState({
    name: "",
    brand: "",
    sellingPrice: "",
    costPrice: "",
    quantity: "",
    height: "",
    width: "",
    depth: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (!userInfo) {
      navigate("/login");
    }
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const productData = { 
      name: form.name,
      brand: form.brand,
      sellingPrice: parseFloat(form.sellingPrice),
      costPrice: parseFloat(form.costPrice),
      quantity: parseInt(form.quantity),
      size: form.height || form.width || form.depth ? {
        height: form.height ? parseFloat(form.height) : undefined,
        width: form.width ? parseFloat(form.width) : undefined,
        depth: form.depth ? parseFloat(form.depth) : undefined,
      } : undefined,
      description: form.description || undefined
    };

    try {
      setLoading(true);
      const userInfoString = localStorage.getItem('userInfo');
      const userInfo = userInfoString ? JSON.parse(userInfoString) : null;
      const token = userInfo?.token || "";
      const res = await fetch(" https://doubleprofit-backend.onrender.com/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json",
          "auth-token" : token || "",
         },
        body: JSON.stringify(productData)
      }); 

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to add product");
      }

      const data = await res.json();
      setSuccess(true);
      console.log(data);

      // Reset form
      setForm({
        name: "",
        brand: "",
        sellingPrice: "",
        costPrice: "",
        quantity: "",
        height: "",
        width: "",
        depth: "",
        description: ""
      });

      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const profit = form.sellingPrice && form.costPrice 
    ? ((parseFloat(form.sellingPrice) - parseFloat(form.costPrice)) / parseFloat(form.costPrice) * 100).toFixed(1)
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
            <Package className="text-white" size={32} />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Add New Product</h1>
          <p className="text-gray-400">Fill in the details to add inventory to your store</p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 bg-green-500 bg-opacity-20 border border-green-500 rounded-xl p-4 flex items-center space-x-3 animate-pulse">
            <CheckCircle className="text-green-400" size={24} />
            <span className="text-green-400 font-medium">Product added successfully!</span>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 sm:p-8">
            {/* Basic Information */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Sparkles className="mr-2 text-blue-400" size={20} />
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="group">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Product Name</label>
                  <input
                    name="name"
                    placeholder="Enter product name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full bg-gray-700 bg-opacity-50 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-500"
                    required
                  />
                </div>
                <div className="group">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Brand</label>
                  <input
                    name="brand"
                    placeholder="Enter brand name"
                    value={form.brand}
                    onChange={handleChange}
                    className="w-full bg-gray-700 bg-opacity-50 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <DollarSign className="mr-2 text-green-400" size={20} />
                Pricing
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Cost Price</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">₹</span>
                    <input
                      type="number"
                      step="0.01"
                      name="costPrice"
                      placeholder="0.00"
                      value={form.costPrice}
                      onChange={handleChange}
                      className="w-full bg-gray-700 bg-opacity-50 border border-gray-600 text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all placeholder-gray-500"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Selling Price</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">₹</span>
                    <input
                      type="number"
                      step="0.01"
                      name="sellingPrice"
                      placeholder="0.00"
                      value={form.sellingPrice}
                      onChange={handleChange}
                      className="w-full bg-gray-700 bg-opacity-50 border border-gray-600 text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all placeholder-gray-500"
                      required
                    />
                  </div>
                </div>
              </div>
              {profit && (
                <div className={`mt-3 p-3 rounded-lg ${parseFloat(profit) > 0 ? 'bg-green-500 bg-opacity-20 border border-green-500' : 'bg-red-500 bg-opacity-20 border border-red-500'}`}>
                  <span className={`text-sm font-medium ${parseFloat(profit) > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {parseFloat(profit) > 0 ? '📈' : '📉'} Profit Margin: {profit}%
                  </span>
                </div>
              )}
            </div>

            {/* Inventory */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Hash className="mr-2 text-purple-400" size={20} />
                Inventory
              </h3>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  placeholder="Enter quantity"
                  value={form.quantity}
                  onChange={handleChange}
                  className="w-full bg-gray-700 bg-opacity-50 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all placeholder-gray-500"
                  required
                />
              </div>
            </div>

            {/* Dimensions */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Ruler className="mr-2 text-orange-400" size={20} />
                Dimensions (Optional)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Height</label>
                  <input
                    type="number"
                    step="0.01"
                    name="height"
                    placeholder="cm"
                    value={form.height}
                    onChange={handleChange}
                    className="w-full bg-gray-700 bg-opacity-50 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all placeholder-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Width</label>
                  <input
                    type="number"
                    step="0.01"
                    name="width"
                    placeholder="cm"
                    value={form.width}
                    onChange={handleChange}
                    className="w-full bg-gray-700 bg-opacity-50 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all placeholder-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Depth</label>
                  <input
                    type="number"
                    step="0.01"
                    name="depth"
                    placeholder="cm"
                    value={form.depth}
                    onChange={handleChange}
                    className="w-full bg-gray-700 bg-opacity-50 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all placeholder-gray-500"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <FileText className="mr-2 text-cyan-400" size={20} />
                Description (Optional)
              </h3>
              <textarea
                name="description"
                placeholder="Enter product description..."
                value={form.description}
                onChange={handleChange}
                rows={4}
                className="w-full bg-gray-700 bg-opacity-50 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all placeholder-gray-500 resize-none"
              />
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
                  <span>Adding Product...</span>
                </>
              ) : (
                <>
                  <Package size={20} />
                  <span>Add Product to Inventory</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Helper Text */}
        <p className="text-center text-gray-500 mt-6 text-sm">
          All fields marked as required must be filled to add the product
        </p>
      </div>
    </div>
  );
}