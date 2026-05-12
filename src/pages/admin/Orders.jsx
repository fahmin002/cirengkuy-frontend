// src/pages/admin/Orders.jsx
import { useEffect, useState } from "react";
import StatusTabs from "../../components/admin/StatusTabs";
import OrderCard from "../../components/admin/OrderCard";
import { api } from "../../services/api";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState("");
  const [loadingCode, setLoadingCode] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/orders${status ? `?status=${status}` : ""}`);
      setOrders(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    const interval = setInterval(fetchOrders, 5000); // 🔄 polling
    return () => clearInterval(interval);
  }, [status]);

  const handleAction = async (code, nextStatus) => {
    try {
      setLoadingCode(code);
      await api.patch(`/orders/${code}/status`, { status: nextStatus });
      await fetchOrders();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoadingCode(null);
    }
  };

  return (
    <div className="p-4 bg-gray-50 rounded-xl pb-24">
      <h1 className="text-xl font-bold text-left mb-4">Pesanan</h1>

      <StatusTabs value={status} onChange={setStatus} />

      <div className="mt-4 space-y-3">
        {loading && <p className="text-center text-gray-400">Loading...</p>}

        {!loading && orders.length === 0 && (
          <p className="text-center text-gray-400">Belum ada pesanan</p>
        )}

        {orders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            loading={loadingCode === order.code}
            onAction={handleAction}
          />
        ))}
      </div>
    </div>
  );
}
