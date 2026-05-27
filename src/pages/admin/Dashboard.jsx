// src/pages/admin/Dashboard.jsx

import { useEffect, useState } from "react";
import { BiDollarCircle, BiCart, BiTime, BiTrendingUp } from "react-icons/bi";
import { api } from "../../services/api";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [stats, setStats] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [storeOpen, setStoreOpen] = useState(false);
  const statusStyle = {
    pending: "bg-yellow-50 ring-1 shadow-yellow-100 ring-yellow-200",

    paid: "bg-blue-50 ring-1 ring-blue-200 shadow-blue-100",

    cooking: "bg-orange-50 ring-1 ring-orange-200 shadow-orange-100",

    ready: "bg-green-50 shadow-green-100 ring-1 ring-green-200",

    completed: "bg-gray-100 ring-1 ring-gray-200 shadow-gray-100 opacity-80",

    cancelled: "bg-red-50 ring-1 ring-red-200 shadow-red-100",
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-600";

      case "paid":
        return "bg-blue-100 text-blue-600";

      case "cooking":
        return "bg-orange-100 text-orange-600";

      case "completed":
        return "bg-green-100 text-green-600";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  // Fetch stats dan recent orders dari API
  async function fetchData() {
    try {
      const statsResponse = await api.get("/orders/admin/stats");
      const ordersResponse = await api.get("/orders/admin/recent-orders");

      const statsMapping = {
        revenue: {
          title: "Revenue Hari Ini",
          icon: <BiDollarCircle size={26} />,
          bg: "bg-green-100 shadow-green-100 shadow-md ring-1 ring-green-200",
          outline: "ring-green-100 shadow-green-200",
          text: "text-green-600",
          value: statsResponse?.data?.revenueToday || 0,
        },
        totalOrders: {
          title: "Total Pesanan",
          icon: <BiCart size={26} />,
          bg: "bg-blue-100 shadow-blue-100 shadow-md ring-1 ring-blue-200",
          outline: "ring-blue-200 shadow-blue-100",
          text: "text-blue-600",
          value: statsResponse?.data?.totalOrdersToday || 0,
        },
        activeOrders: {
          title: "Pesanan Aktif",
          icon: <BiTime size={26} />,
          bg: "bg-orange-100 shadow-orange-100 shadow-md ring-1 ring-orange-200",
          outline: "ring-orange-200 shadow-orange-100",
          text: "text-orange-600",
          value: statsResponse?.data?.activeOrders || 0,
        },
        productsSold: {
          title: "Produk Terjual",
          icon: <BiTrendingUp size={26} />,
          bg: "bg-purple-100 shadow-purple-100 shadow-md ring-1 ring-purple-200",
          outline: "ring-purple-200 shadow-purple-100",
          text: "text-purple-600",
          value: statsResponse?.data?.itemSold || 0,
        },
      };
      setStats(Object.values(statsMapping));
      setRecentOrders(
        ordersResponse.data.map((order) => ({
          id: order.id,
          customerName: order.customerName,
          total: `Rp ${order.total}`,
          status: order.status,
        })),
      );
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  }

  async function fetchSetting() {
    try {
      const storeStatus = await api.get("/settings/admin/store");
      setStoreOpen(storeStatus.data.storeOpen);
    } catch (error) {
      console.error("Error fetching settings data:", error);
    }
  }
  async function toggleStore() {

    try {

      const res =
        await api.patch(
          "/settings/admin/store",
          {
            storeOpen:
              !storeOpen,
          }
        );


      setStoreOpen(
        res.data.storeOpen
      );

    } catch (err) {

      console.error(err);

    }

  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchSetting();
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
      <div
        className="bg-white p-4 mt-2 rounded-2xl flex shadow-sm flex items-center justify-between mb-4">
        <div className="">
          <h2
            className={`font-bold text-lg 
              ${storeOpen
                ? "text-green-600"
                : "text-red-500"
              }
            `}>
            {
              storeOpen
                ? "🟢 Warung Sedang Buka"
                : "🔴 Warung Sedang Tutup"
            }
          </h2>

        </div>
        <div className="px-4">
          <button
            onClick={toggleStore}
            className={`
              px-4 py-2
              rounded-xl
              text-white
              font-medium
              transition
              active:scale-95

            ${storeOpen
                ? "bg-red-500"
                : "bg-green-500"
              }
          `}>
            {
              storeOpen
                ? "Tutup Warung"
                : "Buka Warung"
            }

          </button>
        </div>

      </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 px-5 mt-6">
        {stats.map((item, index) => (
          <div
            key={index}
            className={`
              ${item.outline}
              bg-white
              rounded-3xl
              p-4
              shadow-lg
              flex items-center flex-col gap-3
              ring-1
              `}
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

            <p className="text-sm text-left text-gray-500 mt-4">{item.title}</p>

            <h2 className="text-2xl text-left font-bold text-gray-900 mt-1">
              {item.value}
            </h2>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="px-5 mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Pesanan Terbaru</h2>

          <Link
            to="/admin/orders"
            className="text-orange-500 text-sm font-medium"
          >
            Lihat Semua
          </Link>
        </div>

        <div className="space-y-4 mt-5">
          {recentOrders.map((order) => (
            <div
              key={order.id}
              className={`
                ${statusStyle[order.status]}
                rounded-3xl
                p-4
                shadow-sm
                border border-gray-100
              `}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {order.customerName}
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">{order.total}</p>
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
