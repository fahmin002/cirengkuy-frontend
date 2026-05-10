// src/pages/customer/Orders.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import { useEffect } from "react";
import StatusTabs from "../../components/customer/StatusTabs";
import { formatDateTime } from "../../utils/date";

export default function Orders() {
  const statusMap = {
    pending: "Menunggu Pembayaran",
    paid: "Sudah Dibayar",
    cooking: "Sedang Dimasak",
    ready: "Siap Diambil/Diantar",
    completed: "Selesai",
    cancelled: "Dibatalkan",
  };

  const customer = localStorage.getItem("customer");
  const phone = customer ? JSON.parse(customer).phone : null;

  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const handleSearch = async () => {
      setLoading(true);

      if (!phone) {
        setOrders([]);
        return;
      }

      try {
        const res = await api.get(
          `/orders/customer/${phone}${status ? `/${status}` : ""}`,
        );
        setOrders(res.data || []);
        setLoading(false);
      } catch (err) {
        alert(err.message);
      }
    };

    handleSearch();
  }, [phone, status]);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-2xl google-sans-flex-bold text-left font-bold">
          Pesanan Saya
        </h1>
      </div>

      <StatusTabs value={status} onChange={setStatus} />
      {loading && <p className="text-center text-gray-400">Loading...</p>}

      {!loading && orders.length === 0 && (
        <p className="text-center text-gray-400">Belum ada pesanan</p>
      )}

      {/* Order List */}
      <div className="mt-5 space-y-3 mb-24">
        {orders.map((order) => (
          <button
            key={order.id}
            onClick={() => navigate(`/order/${order.code}`)}
            className="w-full bg-white rounded-2xl p-4 shadow-sm text-left active:scale-[0.99] transition"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold">Order #{order.id}</p>

                <p className="text-xs text-gray-500 mt-1">
                  {/* Tampilkan hari dan waktu, misal Senin 12/10/2024 12:00 */}
                  {new Date(order.createdAt).toLocaleDateString("id-ID", {
                    weekday: "long",
                  }) +
                    " " +
                    formatDateTime(order.createdAt)}
                </p>
              </div>

              <StatusBadge status={order.status} statusMap={statusMap} />
            </div>

            <div className="mt-3">
              {order.OrderItem?.slice(0, 2).map((item) => (
                <p key={item.id} className="text-sm text-gray-600">
                  {item.qty}x {item.Product?.name}
                </p>
              ))}
            </div>

            <div className="mt-4 font-bold">
              Rp {order.total.toLocaleString("id-ID")}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Badge ---------------- */

function StatusBadge({ status, statusMap }) {
  const map = {
    pending: "bg-yellow-100 text-yellow-700",
    paid: "bg-blue-100 text-blue-700",
    cooking: "bg-orange-100 text-orange-700",
    ready: "bg-green-100 text-green-700",
    completed: "bg-gray-200 text-gray-700",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${map[status]}`}
    >
      {statusMap[status]}
    </span>
  );
}
