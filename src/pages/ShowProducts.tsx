import { useEffect, useState } from "react";
import { Package, Edit2, Trash2, Save, X, TrendingUp, Box, DollarSign, Ruler, FileText, Search, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
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
  description?: string;
  token?: string;
};

export default function ShowProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLowStock, setFilterLowStock] = useState(false);
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
      const res = await fetch(" https://doubleprofit-backend.onrender.com/products", {
        method: "GET",
        headers: { "Content-Type": "application/json",
          "auth-token" : token || "",
         },
      });
      const data = await res.json();
      // Ensure data is an array before setting state
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setProducts([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await fetch(` https://doubleprofit-backend.onrender.com/products/${id}`, { method: "DELETE",headers: { "Content-Type": "application/json",
          "auth-token" : token || "",
         }, });
      setProducts(products.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditClick = (product: Product) => {
    setEditingId(product._id);
    setEditForm({
      name: product.name,
      brand: product.brand,
      sellingPrice: product.sellingPrice,
      costPrice: product.costPrice,
      quantity: product.quantity,
      height: product.size?.height || "",
      width: product.size?.width || "",
      depth: product.size?.depth || "",
      description: product.description || "",
    });
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (id: string) => {
    try {
      const updatedProduct = {
        name: editForm.name,
        brand: editForm.brand,
        sellingPrice: parseFloat(editForm.sellingPrice),
        costPrice: parseFloat(editForm.costPrice),
        quantity: parseInt(editForm.quantity),
        size:
          editForm.height || editForm.width || editForm.depth
            ? {
                height: editForm.height ? parseFloat(editForm.height) : undefined,
                width: editForm.width ? parseFloat(editForm.width) : undefined,
                depth: editForm.depth ? parseFloat(editForm.depth) : undefined,
              }
            : undefined,
        description: editForm.description || undefined,
      };
      const res = await fetch(` https://doubleprofit-backend.onrender.com/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json",
          "auth-token" : token || "",
         },
        body: JSON.stringify(updatedProduct),
      });
      const data = await res.json();
      setProducts(products.map((p) => (p._id === id ? data : p)));
      setEditingId(null);
    } catch (err) {
      console.error(err);
    }
  };

  const calculateProfit = (selling: number, cost: number) => {
    return ((selling - cost) / cost * 100).toFixed(1);
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         p.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterLowStock ? p.quantity < 10 : true;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 text-lg">Loading products...</p>
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
            <Package className="text-white" size={32} />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Product Inventory</h1>
          <p className="text-gray-400">Manage your product catalog</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Products</p>
                <p className="text-white text-3xl font-bold mt-1">{products.length}</p>
              </div>
              <Box className="text-blue-100" size={40} />
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Total Stock</p>
                <p className="text-white text-3xl font-bold mt-1">
                  {products.reduce((sum, p) => sum + p.quantity, 0)}
                </p>
              </div>
              <TrendingUp className="text-green-100" size={40} />
            </div>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">Low Stock Items</p>
                <p className="text-white text-3xl font-bold mt-1">
                  {products.filter(p => p.quantity < 10).length}
                </p>
              </div>
              <Package className="text-orange-100" size={40} />
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-xl shadow-lg border border-gray-700 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search products or brands..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-700 bg-opacity-50 border border-gray-600 text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-500"
              />
            </div>
            <button
              onClick={() => setFilterLowStock(!filterLowStock)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
                filterLowStock
                  ? "bg-orange-600 text-white shadow-lg"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              <Filter size={20} />
              <span>Low Stock</span>
            </button>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <Package className="mx-auto text-gray-600 mb-4" size={64} />
            <p className="text-gray-400 text-xl">No products found</p>
            <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredProducts.map((p) => (
              <div
                key={p._id}
                className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-xl shadow-lg border border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-200"
              >
                {editingId === p._id ? (
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                      <Edit2 className="mr-2 text-blue-400" size={20} />
                      Edit Product
                    </h3>
                    <div className="space-y-3">
                      <input
                        name="name"
                        value={editForm.name}
                        placeholder="Product Name"
                        onChange={handleEditChange}
                        className="w-full bg-gray-700 bg-opacity-50 border border-gray-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        name="brand"
                        value={editForm.brand}
                        placeholder="Brand"
                        onChange={handleEditChange}
                        className="w-full bg-gray-700 bg-opacity-50 border border-gray-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          name="costPrice"
                          type="number"
                          step="0.01"
                          value={editForm.costPrice}
                          placeholder="Cost Price"
                          onChange={handleEditChange}
                          className="w-full bg-gray-700 bg-opacity-50 border border-gray-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        <input
                          name="sellingPrice"
                          type="number"
                          step="0.01"
                          placeholder="Selling Price"
                          value={editForm.sellingPrice}
                          onChange={handleEditChange}
                          className="w-full bg-gray-700 bg-opacity-50 border border-gray-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                      <input
                        name="quantity"
                        type="number"
                        placeholder="Quantity"
                        value={editForm.quantity}
                        onChange={handleEditChange}
                        className="w-full bg-gray-700 bg-opacity-50 border border-gray-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      <div className="grid grid-cols-3 gap-3">
                        <input
                          name="height"
                          type="number"
                          step="0.01"
                          placeholder="Height"
                          value={editForm.height}
                          onChange={handleEditChange}
                          className="w-full bg-gray-700 bg-opacity-50 border border-gray-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                        <input
                          name="width"
                          type="number"
                          step="0.01"
                          placeholder="Width"
                          value={editForm.width}
                          onChange={handleEditChange}
                          className="w-full bg-gray-700 bg-opacity-50 border border-gray-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                        <input
                          name="depth"
                          type="number"
                          step="0.01"
                          placeholder="Depth"
                          value={editForm.depth}
                          onChange={handleEditChange}
                          className="w-full bg-gray-700 bg-opacity-50 border border-gray-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      </div>
                      <textarea
                        name="description"
                        value={editForm.description}
                        placeholder="Description"
                        onChange={handleEditChange}
                        rows={3}
                        className="w-full bg-gray-700 bg-opacity-50 border border-gray-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
                      />
                      <div className="flex space-x-3 pt-2">
                        <button
                          className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-2 rounded-lg hover:from-green-700 hover:to-green-800 transition-all flex items-center justify-center space-x-2 font-medium"
                          onClick={() => handleEditSubmit(p._id)}
                        >
                          <Save size={18} />
                          <span>Save</span>
                        </button>
                        <button
                          className="flex-1 bg-gray-700 text-gray-300 py-2 rounded-lg hover:bg-gray-600 transition-all flex items-center justify-center space-x-2 font-medium"
                          onClick={() => setEditingId(null)}
                        >
                          <X size={18} />
                          <span>Cancel</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-bold text-white">{p.name}</h3>
                          <p className="text-blue-100 text-sm mt-1">{p.brand}</p>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          p.quantity < 10 
                            ? "bg-red-500 text-white" 
                            : p.quantity < 30 
                            ? "bg-orange-500 text-white"
                            : "bg-green-500 text-white"
                        }`}>
                          {p.quantity < 10 ? "Low Stock" : p.quantity < 30 ? "Medium" : "In Stock"}
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-gray-700 bg-opacity-50 rounded-lg p-3">
                          <div className="flex items-center space-x-2 mb-1">
                            <DollarSign className="text-green-400" size={16} />
                            <p className="text-gray-400 text-xs">Cost Price</p>
                          </div>
                          <p className="text-white font-semibold text-lg">₹{p.costPrice.toFixed(2)}</p>
                        </div>
                        <div className="bg-gray-700 bg-opacity-50 rounded-lg p-3">
                          <div className="flex items-center space-x-2 mb-1">
                            <DollarSign className="text-blue-400" size={16} />
                            <p className="text-gray-400 text-xs">Selling Price</p>
                          </div>
                          <p className="text-white font-semibold text-lg">₹{p.sellingPrice.toFixed(2)}</p>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-green-500 to-green-600 bg-opacity-20 border border-green-500 rounded-lg p-3 mb-4">
                        <div className="flex items-center justify-between">
                          <span className="text-green-400 text-sm font-medium">Profit Margin</span>
                          <span className="text-green-300 font-bold">{calculateProfit(p.sellingPrice, p.costPrice)}%</span>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400 flex items-center">
                            <Box className="mr-2" size={14} />
                            Quantity
                          </span>
                          <span className="text-white font-medium">{p.quantity} units</span>
                        </div>
                        {p.size && (p.size.height || p.size.width || p.size.depth) && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-400 flex items-center">
                              <Ruler className="mr-2" size={14} />
                              Dimensions
                            </span>
                            <span className="text-white font-medium">
                              {p.size.height || "-"} × {p.size.width || "-"} × {p.size.depth || "-"} cm
                            </span>
                          </div>
                        )}
                        {p.description && (
                          <div className="pt-2 border-t border-gray-700">
                            <div className="flex items-start text-sm">
                              <FileText className="mr-2 text-cyan-400 mt-0.5" size={14} />
                              <p className="text-gray-300 text-xs leading-relaxed">{p.description}</p>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex space-x-3 pt-4 border-t border-gray-700">
                        <button
                          className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all flex items-center justify-center space-x-2 font-medium"
                          onClick={() => handleEditClick(p)}
                        >
                          <Edit2 size={16} />
                          <span>Edit</span>
                        </button>
                        <button
                          className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-all flex items-center justify-center space-x-2 font-medium"
                          onClick={() => handleDelete(p._id)}
                        >
                          <Trash2 size={16} />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}