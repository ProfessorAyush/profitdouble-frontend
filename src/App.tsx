// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import AddInventory from "./pages/AddInventory";
import ShowProducts from "./pages/ShowProducts";
import Billing from "./pages/Billing";
import BillHistory from "./pages/BillHistory";
import Login from "./pages/Login";
import Register from "./pages/Register";
import LandingPage from "./pages/LandingPage";
import Navbar from "./components/Navbar";
import AIDashboard from "./pages/AiDashboard";

// Protected Route Component - Redirects to landing if not authenticated
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const userInfo = localStorage.getItem("userInfo");
  
  if (!userInfo) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
}

// Public Route Component - Redirects to dashboard if already authenticated
function PublicRoute({ children }: { children: React.ReactNode }) {
  const userInfo = localStorage.getItem("userInfo");
  
  if (userInfo) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
}

// Home Route - Shows Landing Page or Dashboard based on auth
function HomeRoute() {
  const userInfo = localStorage.getItem("userInfo");
  
  if (userInfo) {
    return <Dashboard />;
  }
  
  return <LandingPage />;
}

function AppContent() {
  const location = useLocation();
  const userInfo = localStorage.getItem("userInfo");

  // Hide Navbar on landing page, login and register pages
  const hideNavbar = 
    !userInfo || 
    ["/login", "/register"].includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col">
      {!hideNavbar && <Navbar />}
      <div className="flex-1">
        <Routes>
          {/* Home Route - Landing or Dashboard based on auth */}
          <Route path="/" element={<HomeRoute />} />
          
          {/* Public Routes - Only accessible when NOT logged in */}
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } 
          />
          <Route 
            path="/register" 
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            } 
          />
          
          {/* Protected Routes - Only accessible when logged in */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/add-inventory" 
            element={
              <ProtectedRoute>
                <AddInventory />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/show-products" 
            element={
              <ProtectedRoute>
                <ShowProducts />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/billing" 
            element={
              <ProtectedRoute>
                <Billing />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/bills" 
            element={
              <ProtectedRoute>
                <BillHistory />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/aidashboard" 
            element={
              <ProtectedRoute>
                <AIDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Catch all invalid routes - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}