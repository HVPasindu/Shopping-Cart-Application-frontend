// src/App.jsx
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/public/Home";
import About from "./pages/public/About";
import Contact from "./pages/public/Contact";
import Categories from "./pages/public/Categories";
import Products from "./pages/public/Products";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import VerifyOtp from "./pages/auth/VerifyOtp";

import CustomerLayout from "./pages/customer/CustomerLayout";
import Profile from "./pages/customer/Profile";
import Cart from "./pages/customer/Cart";
import Orders from "./pages/customer/Orders";
import Notifications from "./pages/customer/Notifications";

import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  const location = useLocation();

  const authPages = ["/login", "/register", "/verify-otp"];
  const isAuthPage = authPages.includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col bg-[#f7fbff]">
      <Toaster position="top-right" />

      {!isAuthPage && <Navbar />}

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          {/* Shop flow */}
          <Route path="/shop" element={<Categories />} />
          <Route path="/products/category/:categoryId" element={<Products />} />

          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />

          {/* Customer protected routes */}
          <Route element={<ProtectedRoute allowedRoles={["customer"]} />}>
            <Route path="/customer" element={<CustomerLayout />}>
              <Route
                index
                element={<Navigate to="/customer/profile" replace />}
              />
              <Route path="profile" element={<Profile />} />
              <Route path="cart" element={<Cart />} />
              <Route path="orders" element={<Orders />} />
              <Route path="notifications" element={<Notifications />} />
            </Route>
          </Route>
        </Routes>
      </main>

      {!isAuthPage && <Footer />}
    </div>
  );
}

export default App;