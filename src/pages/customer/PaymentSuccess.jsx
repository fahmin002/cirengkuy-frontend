import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { api } from "../../services/api";

export default function OrderSuccess() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const orderCode = params.get("orderCode");
  const status = params.get("transaction_status");

  const isPaid = status === "settlement";

  const fetchOrder = async () => {
    try {
      const res = await api.get(`/orders/customer/code/${orderCode}`);
      setOrder(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, []);

  return (
    <div className="bg-gray-50 h-screen flex flex-col items-center justify-center text-center p-6">
      {/* Logo */}
      <img
        src="web-app-manifest-192x192.png"
        alt="Cirengkuy Logo"
        className="mb-6"
      />
      <h1 className="google-sans-flex-bold text-2xl font-bold text-green-600 mb-2">
        Pesanan Berhasil
      </h1>
      {order?.paymentMethod === "cash" && (
        <h2 className="google-sans-flex-bold text-2xl font-bold text-green-600 mb-2">
          Silahkan Bayar Ke Penjual
        </h2>
      )}

      <button
        onClick={() => navigate(`/order/${orderCode}`)}
        className="bg-orange-500 google-sans-flex-medium mt-4 text-white px-6 py-3 rounded-xl mb-3"
      >
        Lihat Pesanan Saya
      </button>
      <button
        onClick={() => navigate("/")}
        className="bg-orange-500 google-sans-flex-medium mt-4 text-white px-6 py-3 rounded-xl"
      >
        Kembali ke Home
      </button>
    </div>
  );
}
