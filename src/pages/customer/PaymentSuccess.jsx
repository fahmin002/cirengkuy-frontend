import { useSearchParams, useNavigate } from "react-router-dom";

export default function PaymentSuccess() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const orderCode = params.get("orderCode");
  const status = params.get("transaction_status");

  const isPaid = status === "settlement";

  return (
    <div className="h-screen flex flex-col items-center justify-center text-center p-6">
      {/* Logo */}
      <img
        src="web-app-manifest-192x192.png"
        alt="Cirengkuy Logo"
        className="mb-6"
      />
      <h1 className="google-sans-flex-bold text-2xl font-bold text-green-600 mb-2">
        Pembayaran Berhasil
      </h1>

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
