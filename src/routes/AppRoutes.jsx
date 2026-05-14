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
import AdminOrderDetail from "../pages/admin/OrderDetail";
import ProtectedRoute from "./ProtectedRoutes";
import GuestRoute from "./GuestRoute";

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
            <Route index element={
              <ProtectedRoute>
              <Dashboard />
              </ProtectedRoute>
              } />
            <Route path="orders" element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            } />
            <Route path="order/:id" element={
              <ProtectedRoute>
                <AdminOrderDetail />
              </ProtectedRoute>
            } />
            <Route path="login" element={
              <GuestRoute>
                <Login />
              </GuestRoute>
            }/>
            <Route path="products" element={
              <ProtectedRoute>
                <Products />
              </ProtectedRoute>
            } />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
