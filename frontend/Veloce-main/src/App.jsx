

import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Navbar from "./pages/Navbar";
import Home from "./NonAuth/Home";
import Login from "./Auth/login";
import Registration from "./Auth/registration";
import Product from "./NonAuth/Product";
import Cart from "./NonAuth/Cart";
import Productdetails from "./NonAuth/Productdetails";
import Wishlist from "./NonAuth/Wishlist";
import About from "./pages/About";

import Authprovider from "./Context/Authcontext";
import Cartprovider from "./Context/Cartcontext";
import Wishlistprovider from "./Context/Wishlistcontext";
import { 
  ProtectedRoute, 
  AdminProtectedRoute, 
  PublicUserRoute, 
  PublicNoAdmin 
} from "./NonAuth/ProtectRoute";

import OrederHistory from "./NonAuth/order/OrederHistory";


// --------------admin----------------------
import Dashboard from "./admin/pages/dashboard";
import Users from "./admin/pages/users";
import Orders from "./admin/pages/orders";
import Products from "./admin/pages/Products";
import Checkout from "./NonAuth/order/checkout";


function LayoutWrapper() {
  const location = useLocation();

  const hideNavbar =
  location.pathname=="/dashboard" ||
  location.pathname.startsWith("/users") ||
  location.pathname.startsWith("/orders") ||
  location.pathname.startsWith("/products") ||
  location.pathname === "/login" ||
  location.pathname === "/registration";


  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        {/* ----------------- Public pages (block admins only) ----------------- */}
        <Route path="/" element={<PublicNoAdmin><Home /></PublicNoAdmin>} />
        <Route path="/product" element={<PublicNoAdmin><Product /></PublicNoAdmin>} />
        <Route path="/product/:id" element={<PublicNoAdmin><Productdetails /></PublicNoAdmin>} />
        <Route path="/about" element={<PublicNoAdmin><About /></PublicNoAdmin>} />

        {/* ----------------- Login/Register (block logged-in users/admins) ----------------- */}
        <Route path="/login" element={<PublicUserRoute><Login /></PublicUserRoute>} />
        <Route path="/registration" element={<PublicUserRoute><Registration /></PublicUserRoute>} />
        


        {/* ----------------- User-only protected routes ----------------- */}
        <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
        <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
        <Route path="/OrederHistory" element={<ProtectedRoute><OrederHistory /></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />

        {/* ----------------- Admin-only route ----------------- */}
        <Route path="/dashboard/*" element={<AdminProtectedRoute><Dashboard /></AdminProtectedRoute>} />
        <Route path="/users/*" element={<AdminProtectedRoute><Users/></AdminProtectedRoute>} />
        <Route path="/orders/*" element={<AdminProtectedRoute><Orders/></AdminProtectedRoute>} />
        <Route path="/Products/*" element={<AdminProtectedRoute><Products/></AdminProtectedRoute>} />

      </Routes>
    </>
  );
}

function App() {
  return (
    <>
      <BrowserRouter>
        <Authprovider>
          <Cartprovider>
            <Wishlistprovider>
              <LayoutWrapper />
            </Wishlistprovider>
          </Cartprovider>
        </Authprovider>
      </BrowserRouter>
      <Toaster position="top-right" reverseOrder={false} />
    </>
  );
}

export default App;
