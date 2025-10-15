// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import AddInventory from "./pages/AddInventory";
import ShowProducts from "./pages/ShowProducts";
import Billing from "./pages/Billing";
import BillHistory from "./pages/BillHistory";
import Navbar from "./components/Navbar";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/add-inventory" element={<AddInventory />} />
            <Route path="/show-products" element={<ShowProducts />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="/bills" element={<BillHistory />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
