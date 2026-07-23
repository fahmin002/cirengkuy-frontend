import { BrowserRouter, Routes, Route } from "react-router-dom";

import AdminLayout from "../layouts/AdminLayout";
import CustomerLayout from "../layouts/CustomerLayout";

import Dashboard from "../pages/admin/Dashboard";
import Orders from "../pages/admin/Orders";

import Home from "../pages/customer/Home";
import Checkout from "../pages/customer/Checkout";
import Profile from "../pages/customer/Profile";
import PaymentSuccess from "../pages/customer/PaymentSuccess";
import * as CustomerOrders from "../pages/customer/Orders";
import OrderDetail from "../pages/customer/OrderDetail";
import Login from "../pages/admin/Login";
import Products from "../pages/admin/Products";
import AdminOrderDetail from "../pages/admin/OrderDetail";
import ProtectedRoute from "./ProtectedRoutes";
import GuestRoute from "./GuestRoute";
import NotFound from "../pages/NotFound";
import Reports from "../pages/admin/Reports";
import OrderSuccess from "../pages/customer/PaymentSuccess";
import DailyRevenueReport from "../pages/admin/reports/DailyRevenueReport";
import WeeklyRevenueReport from "../pages/admin/reports/WeeklyRevenueReport";
import MonthlyRevenueReport from "../pages/admin/reports/MonthlyRevenueReport";
import ProductDailyReport from "../pages/admin/reports/ProductDailyReport";
import ProductMonthlyReport from "../pages/admin/reports/ProductMonthlyReport";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* CUSTOMER ZONE */}
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
          <Route
            index
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="orders"
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            }
          />
          <Route
            path="order/:id"
            element={
              <ProtectedRoute>
                <AdminOrderDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="login"
            element={
              <GuestRoute>
                <Login />
              </GuestRoute>
            }
          />
          <Route
            path="products"
            element={
              <ProtectedRoute>
                <Products />
              </ProtectedRoute>
            }
          />
          <Route
            path="reports"
            element={
              <ProtectedRoute>
                <Reports />
              </ProtectedRoute>
            }
          />

          <Route
            path="reports/daily"
            element={
              <ProtectedRoute>
                <DailyRevenueReport />
              </ProtectedRoute>
            }
          />
          <Route
            path="reports/weekly"
            element={
              <ProtectedRoute>
                <WeeklyRevenueReport />
              </ProtectedRoute>
            }
          />
          <Route
            path="reports/monthly"
            element={
              <ProtectedRoute>
                <MonthlyRevenueReport />
              </ProtectedRoute>
            }
          />
          <Route
            path="reports/product-daily"
            element={
              <ProtectedRoute>
                <ProductDailyReport />
              </ProtectedRoute>
            }
          />
          <Route
            path="reports/product-monthly"
            element={
              <ProtectedRoute>
                <ProductMonthlyReport />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
