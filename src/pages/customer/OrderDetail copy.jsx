import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { formatDateTime } from "../../utils/date";
import { HiArrowLeft } from "react-icons/hi";
import { BiArrowBack } from "react-icons/bi";
import { socket } from "../../services/socket";
import { toast } from "sonner";
export default function OrderDetail() {
  const { id } = useParams();
  const code = id; // alias untuk readability
  const [order, setOrder] = useState(null);
  const navigate = useNavigate();
  const statusMap = {
    pending: "Menunggu Pembayaran",
    paid: "Sudah Dibayar",
    cooking: "Sedang Disiapkan",
    ready: "Siap Diambil/Diantar",
    completed: "Selesai",
    cancelled: "Dibatalkan",
  };
  const statusColor = {
    pending: "bg-yellow-500",
    paid: "bg-blue-500",
    cooking: "bg-orange-500",
    ready: "bg-green-500",
    completed: "bg-gray-500",
    cancelled: "bg-red-500",
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
  const fetchOrder = async () => {
    try {
      const res = await api.get(`/orders/customer/code/${code}`);
      setOrder(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancelButton = async () => {
    toast('Yakin menghapus item?', {
      cancel: {
        label: 'Batal',
        onClick: () => {
          return
        }

      },
      action: {
        label: 'Hapus',
        onClick: async () => {
          try {
            if (order.status === "cancelled") return;

            await api.patch(`/orders/customer/id/${order.id}/cancel`);
          } catch (err) {
            console.log(err)
            toast.error("Pesanan tidak dapat dibatalkan");
          }
        },
        actionButtonStyle: {
          backgroundColor: "orange"
        }
      }
    });

  };

  const notifSound = new Audio(
    "/sound/ding.mp3"
  );

  useEffect(() => {
    fetchOrder();
    // 🔁 polling tiap 5 detik
    const interval = setInterval(fetchOrder, 5000);

    if (!code) return;
    const enableAudio = async () => {
      try {
        await notifSound.play();

        notifSound.pause();

        notifSound.currentTime = 0;
      } catch (err) {
        console.log("Audio belum diizinkan");
      }
    };

    window.addEventListener("click", enableAudio, {
      once: true,
    });

    socket.emit(
      "join-order-room",
      code
    );

    socket.on(
      "order-status-updated",
      (data) => {
        const toastMessage = `Pesanan ${statusMap[data.status]}`
        console.log(data)
        if (data.msg) {
          toast.error(toastMessage + data?.msg)
        } else {
          toast.success(toastMessage);
        }
        notifSound.currentTime = 0;

        notifSound.play();
        setOrder((prev) => ({
          ...prev,
          status: data.status,
        }));
      }
    );
    return () => {
      clearInterval(interval);
      socket.off(
        "order-status-updated"
      );
    }
  }, [code]);

  if (!order) return <p className="p-4">Loading...</p>;

  return (
    <div className={`rounded-3xl p-4 shadow-sm mb-24 ${statusStyle[order.status]}`}>
      <div className="flex mb-4 items-center border-gray-200 gap-6">
        {/* Tombol kembali */}
        {/* <button onClick={() => navigate("/orders")} className="mb-2">
          <HiArrowLeft className="text-2xl" />
        </button> */}
        <button
          onClick={() => navigate("/orders")}
          className="
          
          flex items-center gap-2
          bg-white
          border border-gray-100
          shadow-sm
          rounded-2xl
          px-4 py-3
          text-sm font-medium text-gray-700
          active:scale-95
          transition
        "
        >
          <BiArrowBack size={18} />
          Kembali
        </button>
        <h2 className="text-left google-sans-flex-bold">
          Pesanan {order.customerName}
        </h2>
      </div>

      {/* Order Code */}
      <div className="mb-4 text-left flex flex-row justify-between">
        <p className="font-semibold">Kode Pesanan</p>
        <span className="text-right">{order.code}</span>
      </div>

      {/* STATUS */}
      <div className="mb-4 text-left flex flex-row justify-between">
        <p className="text-sm text-gray-500">Status Pesanan</p>
        <span
          className={`px-3 py-1 rounded-full text-white text-sm
          ${statusColor[order.status]}
        `}
        >
          {statusMap[order.status]}
        </span>
      </div>

      {/* Waktu pembayaran */}
      {order.paidAt && (
        <div className="mb-4 text-left flex flex-row justify-between">
          <p className="text-sm text-gray-500">Waktu Pembayaran</p>
          <span className="text-left">{formatDateTime(order.paidAt)}</span>
        </div>
      )}

      {/* delivery Method */}
      <div className="mb-4 text-left flex flex-row justify-between">
        <p className="text-sm text-gray-500">Metode Pengiriman</p>
        {/* Badge */}
        <span
          className={`px-3 py-1 rounded-full text-white text-sm
          ${order.deliveryMethod === "pickup" ? "bg-orange-500" : "bg-sky-500"}
        `}
        >
          {order.deliveryMethod === "pickup"
            ? "Ambil di tempat"
            : "Diantar ke alamat"}
        </span>
      </div>

      {/* payment Method */}
      <div className="mb-4 text-left flex flex-row justify-between">
        <p className="text-sm text-gray-500">Metode Pembayaran</p>
        {/* Badge */}
        <span
          className={`px-3 py-1 rounded-full text-white text-sm
          ${order.paymentMethod === "qris" ? "bg-blue-500" : "bg-gray-500"}
          `}
        >
          {order.paymentMethod === "qris" ? "QRIS" : "Cash"}
        </span>
      </div>
      {/*Alamat */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-gray-500">Alamat Pengiriman</p>
        <p className="text-right">{order.address}</p>
      </div>

      {/* Waktu Pengambilan */}
      <div className="mb-4 flex  items-center justify-between">
        <p className="text-sm text-left text-gray-500">Waktu Pengambilan</p>
        <p className="text-right">
          {order.scheduledAt
            ? `Diambil ${formatDateTime(order.scheduledAt)}`
            : `Ambil Sekarang`}
        </p>
      </div>
      {/* ITEMS */}
      <div className="space-y-3 text-left">
        {order.OrderItem?.map((item) => (
          <div
            key={item.id}
            className="flex justify-between bg-white p-3 rounded-xl shadow-sm"
          >
            <div>
              <p className="font-semibold">{item.Product.name}</p>
              <p className="text-sm text-left text-gray-500">
                {item.qty} x Rp {item.price}
              </p>
            </div>

            <div className="font-semibold">Rp {item.qty * item.price}</div>
          </div>
        ))}
      </div>
      {/* Note Customer */}
      <div
        className="flex mt-4 text-left justify-between bg-white p-3 rounded-xl shadow-sm"
      >
        <div>
          <p className="font-semibold">Catatan:</p>
          <div dangerouslySetInnerHTML={{ __html: order.note }} className="text-sm text-left text-gray-500" />
        </div>

      </div>

      {/* TOTAL */}
      <div className="mt-6 text-lg font-bold">Total: Rp {order.total}</div>
      {statusMap[order.status] !== "Dibatalkan" && (
        <button
          onClick={handleCancelButton}
          className="mt-4 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
        >
          Batalkan Pesanan
        </button>
      )}

      {/* jika qris, dan belum menyelesaikan pembayaran */}
      {statusMap[order.status] === "Menunggu Pembayaran" &&
        order.paymentMethod === "qris" && (
          <>
            {/* expired datetime */}
            <p className="p-4 text-sm text-gray-500">
              Lakukan pembayaran sebelum: <br></br>
              {formatDateTime(order.paymentExpiredAt)}
            </p>
            <p className="mt-2 text-sm text-gray-500">
              <a
                href={`${order.paymentUrl}`}
                className="inline-block bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Bayar Sekarang
              </a>
            </p>
          </>
        )}
    </div>
  );
}
