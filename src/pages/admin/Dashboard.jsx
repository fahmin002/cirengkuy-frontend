// src/pages/admin/Dashboard.jsx

import { useEffect, useState } from "react";
import {
  BiDollarCircle,
  BiCart,
  BiTime,
  BiTrendingUp,
} from "react-icons/bi";
import { api } from "../../services/api";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [stats, setStats] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  // Dummy data sementara
  // const stats = [
  //   {
  //     title: "Revenue Hari Ini",
  //     value: "Rp 420.000",
  //     icon: <BiDollarCircle size={26} />,
  //     bg: "bg-green-100",
  //     text: "text-green-600",
  //   },
  //   {
  //     title: "Total Pesanan",
  //     value: "18",
  //     icon: <BiCart size={26} />,
  //     bg: "bg-blue-100",
  //     text: "text-blue-600",
  //   },
  //   {
  //     title: "Pending",
  //     value: "4",
  //     icon: <BiTime size={26} />,
  //     bg: "bg-orange-100",
  //     text: "text-orange-600",
  //   },
  //   {
  //     title: "Produk Terjual",
  //     value: "52",
  //     icon: <BiTrendingUp size={26} />,
  //     bg: "bg-purple-100",
  //     text: "text-purple-600",
  //   },
  // ];

  // const recentOrders = [
  //   {
  //     id: 1,
  //     customer: "Budi",
  //     total: "Rp 48.000",
  //     status: "pending",
  //   },
  //   {
  //     id: 2,
  //     customer: "Rina",
  //     total: "Rp 72.000",
  //     status: "cooking",
  //   },
  //   {
  //     id: 3,
  //     customer: "Fahmi",
  //     total: "Rp 24.000",
  //     status: "completed",
  //   },
  // ];

  const getStatusStyle = (status) => {
    switch (status) {
      case "pending":
        return "bg-orange-100 text-orange-600";

      case "cooking":
        return "bg-blue-100 text-blue-600";

      case "completed":
        return "bg-green-100 text-green-600";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };



  // Fetch stats dan recent orders dari API
  async function fetchData() {
    try {
      const statsResponse = await api.get("/orders/stats");
      const ordersResponse = await api.get("/orders/recent-orders");

      const statsMapping = {
        revenue: {
          title: "Revenue Hari Ini",
          icon: <BiDollarCircle size={26} />,
          bg: "bg-green-100",
          text: "text-green-600",
          value: statsResponse?.data?.revenueToday || 0
        },
        totalOrders: {
          title: "Total Pesanan",
          icon: <BiCart size={26} />,
          bg: "bg-blue-100",
          text: "text-blue-600",
          value: statsResponse?.data?.totalOrders || 0
        },
        pendingOrders: {
          title: "Pending",
          icon: <BiTime size={26} />,
          bg: "bg-orange-100",
          text: "text-orange-600",
          value: statsResponse?.data?.pendingOrders || 0
        },
        productsSold: {
          title: "Produk Terjual",
          icon: <BiTrendingUp size={26} />,
          bg: "bg-purple-100",
          text: "text-purple-600",
          value: statsResponse?.data?.productsSold || 0
        },
      };
      setStats(Object.values(statsMapping));
      setRecentOrders(ordersResponse.data.map((order) => ({
        id: order.id,
        customerName: order.customerName,
        total: `Rp ${order.total}`,
        status: order.status,
      })));
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div className="min-h-screen rounded-2xl bg-gray-50 pb-24">
      {/* Header */}
      <div className="px-5 pt-6">
        <div>
          <h1 className="text-3xl text-left google-sans-flex-bold font-bold text-gray-900">
            Dashboard
          </h1>

          <p className="text-gray-500 mt-1 text-left">
            Pantau operasional CirengKuy hari ini
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 px-5 mt-6">
        {stats.map((item, index) => (
          <div
            key={index}
            className="
              bg-white
              rounded-3xl
              p-4
              shadow-sm
              flex items-center flex-col gap-3
              border border-gray-100
            "
          >
            <div
              className={`
                w-12 h-12
                rounded-2xl
                flex items-center justify-center
                ${item.bg || "bg-gray-100"}
                ${item.text || "text-gray-600"}
              `}
            >
              {item.icon || <BiDollarCircle size={26} />}
            </div>

            <p className="text-sm text-left text-gray-500 mt-4">
              {item.title}
            </p>

            <h2 className="text-2xl text-left font-bold text-gray-900 mt-1">
              {item.value}
            </h2>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="px-5 mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            Pesanan Terbaru
          </h2>

          <Link to="/admin/orders" className="text-orange-500 text-sm font-medium">
            Lihat Semua
          </Link>
        </div>

        <div className="space-y-4 mt-5">
          {recentOrders.map((order) => (
            <div
              key={order.id}
              className="
                bg-white
                rounded-3xl
                p-4
                shadow-sm
                border border-gray-100
              "
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {order.customerName}
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    {order.total}
                  </p>
                </div>

                <span
                  className={`
                    px-3 py-1
                    rounded-full
                    text-xs font-medium capitalize
                    ${getStatusStyle(order.status)}
                  `}
                >
                  {order.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}