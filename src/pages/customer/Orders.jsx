// src/pages/customer/Orders.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import { useEffect } from "react";
import StatusTabs from "../../components/customer/StatusTabs";
import { formatDateTime } from "../../utils/date";
import { toast } from "sonner";

export default function Orders() {
  const statusMap = {
    pending: "Menunggu Pembayaran",
    paid: "Sudah Dibayar",
    cooking: "Sedang Disiapkan",
    ready: "Siap Diambil/Diantar",
    completed: "Selesai",
    cancelled: "Dibatalkan",
  };


  const statusStyle = {
    pending:
      "bg-yellow-50 ring-1 shadow-yellow-100 ring-yellow-200",

    paid:
      "bg-blue-50 ring-1 ring-blue-200 shadow-blue-100",

    cooking:
      "bg-orange-50 ring-1 ring-orange-200 shadow-orange-100",

    ready:
      "bg-green-50 shadow-green-100 ring-1 ring-green-200",

    completed:
      "bg-gray-100 ring-1 ring-gray-200 shadow-gray-100 opacity-80",

    cancelled:
      "bg-red-50 ring-1 ring-red-200 shadow-red-100",
  };

  const customer = localStorage.getItem("customer");
  const phone = customer ? JSON.parse(customer).phone : null;
  const name = customer ? JSON.parse(customer).name : null;

  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  const [page, setPage] =
    useState(1);

  const [hasMore, setHasMore] =
    useState(true);

  const navigate = useNavigate();

  useEffect(() => {

    const handleSearch = async () => {
      setLoading(true);

      if (!phone || phone === null) {
        setOrders([]);
        toast.error("Pesanan tidak ditemukan")
        return;
      }

      try {
        const params =
          new URLSearchParams({
            page,
            limit: 5,
          });

        if (status) {
          params.append(
            "status",
            status
          );
        }

        const res = await api.get(
          `/orders/customer/phone/${phone}?${params.toString()}`
        );


        setOrders((prev) => {
          const merged =
            page === 1
              ? res.data
              : [...prev, ...res.data];

          const unique = merged.filter(
            (order, index, self) =>
              index ===
              self.findIndex(
                (o) => o.id === order.id
              )
          );

          return unique;
        });
        setHasMore(
          page <
          res.pagination.totalPages
        )
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    handleSearch();
  }, [phone, status, page]);

  return (
    <div className="bg-gray-50 pb-24 rounded-xl">
      {/* Header */}
      <div className="sticky p-4 rounded-xl top-0 z-10 bg-gray-50 ">
        <h1 className="text-2xl google-sans-flex-bold text-left font-bold">
          Pesanan {name}
        </h1>
        <StatusTabs setOrders={setOrders} setPage={setPage} value={status} onChange={setStatus} />
      </div>

      {loading || phone === null && <p className="text-center text-gray-400">Loading...</p>}

      {!loading || orders.length === 0 && (
        <p className="text-center mt-4 text-gray-400">Belum ada pesanan</p>
      )}

      {/* Order List */}
      <div className="mt-5 px-4 space-y-3">
        {orders.map((order) => (
          <button
            key={order.id}
            onClick={() => navigate(`/order/${order.code}`)}
            className={`w-full ${statusStyle[order.status]} rounded-2xl p-4 shadow-sm text-left active:scale-[0.99] transition`}
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
        {hasMore && (
          <button
            onClick={() =>
              setPage((prev) => prev + 1)
            }
            className="
      w-full
      bg-orange-500
      text-white
      rounded-2xl
      py-3
    "
          >
            Selanjutnya
          </button>
        )}
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
