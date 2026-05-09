// src/App.jsx
import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/public/Home";
import About from "./pages/public/About";
import Contact from "./pages/public/Contact";
import Categories from "./pages/public/Categories";
import Products from "./pages/public/Products";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

function App() {
  const location = useLocation();

  const authPages = ["/login", "/register"];
  const isAuthPage = authPages.includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col bg-[#f7fbff]">
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
        </Routes>
      </main>

      {!isAuthPage && <Footer />}
    </div>
  );
}

export default App;