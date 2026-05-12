import { BrowserRouter, Routes, Route } from "react-router-dom";

import AdminLayout from "../layouts/AdminLayout";
import CustomerLayout from "../layouts/CustomerLayout";

import Dashboard from "../pages/admin/Dashboard";
import Orders from "../pages/admin/Orders";

import Home from "../pages/customer/Home";
import Checkout from "../pages/customer/Checkout";
import Profile from "../pages/customer/Profile";
import LandingPage from "../pages/customer/LandingPage";
import PaymentSuccess from "../pages/customer/PaymentSuccess";
import * as CustomerOrders from "../pages/customer/Orders";
import OrderDetail from "../pages/customer/OrderDetail";
import Login from "../pages/admin/Login";
import Products from "../pages/admin/Products";

function AdminRoute({ children }) {
  const isAdmin = true; // nanti dari token

  if (!isAdmin) return <div>Unauthorized</div>;

  return children;
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* CUSTOMER ZONE */}
        <Route path="/landing" element={<LandingPage />} />
        <Route element={<CustomerLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/order/:id" element={<OrderDetail />} />
          <Route path="/orders" element={<CustomerOrders.default />} />
        </Route>
        <Route path="/payment-success" element={<PaymentSuccess />} />

        {/* ADMIN ZONE */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="orders" element={<Orders />} />
          <Route path="login" element={<Login />} />
          <Route path="products" element={<Products />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
