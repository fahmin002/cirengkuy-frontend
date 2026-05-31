import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { formatDateTime } from "../../utils/date";
import { BiArrowBack } from "react-icons/bi";
import { socket } from "../../services/socket";
import { toast } from "sonner";

export default function AdminOrderDetail() {
    const { id } = useParams();
    const code = id;
    const [order, setOrder] = useState(null);
    const [loadingCode, setLoadingCode] = useState(null);
    const [loading, setLoading] = useState(true);
    const [action, setAction] = useState({});
    const navigate = useNavigate();

    const handleAction = async (code, nextStatus) => {
        try {
            setLoadingCode(code);
            await api.patch(`/orders/admin/code/${code}/status`, { status: nextStatus });
            await fetchOrder();
        } catch (err) {
            alert(err.message);
        } finally {
            setLoadingCode(null);
        }
    };

    const fetchOrder = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/orders/customer/code/${code}`);
            setOrder(res.data);
            setAction(() => getNextAction(res.data.status));
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const notifSound = new Audio("/sound/ding.mp3");

    useEffect(() => {
        fetchOrder();
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

        socket.emit("join-order-room", code);

        socket.on("order-status-updated", (data) => {
            let toastMessage;
            if (data.status === "ready") {
                toastMessage = `Pesanan Siap Diambil/Diantar`;
            } else {
                toastMessage = `Pesanan ${statusMap[data.status]}`
            }
            toast.success(toastMessage);
            notifSound.currentTime = 0;
            notifSound.play();
            setOrder((prev) => ({
                ...prev,
                status: data.status,
            }));
        });

        return () => {
            clearInterval(interval);
            socket.off("order-status-updated");
        }
    }, [code]);

    const statusMap = {
        pending: "Menunggu Pembayaran",
        paid: "Menunggu Konfirmasi Admin",
        cooking: "Sedang Disiapkan",
        ready: `Siap ${order?.deliveryMethod === "pickup" ? 'Diambil' : 'Diantar'}`,
        completed: "Selesai",
        cancelled: "Dibatalkan",
    };

    const statusBadgeColor = {
        pending: "bg-yellow-100 text-yellow-700",
        paid: "bg-blue-100 text-blue-700",
        cooking: "bg-orange-100 text-orange-700",
        ready: "bg-green-100 text-green-700",
        completed: "bg-gray-100 text-gray-700",
        cancelled: "bg-red-100 text-red-700",
    };

    // Generate timeline steps based on order status
    const getTimelineSteps = () => {
        const steps = [
            { label: "Pesanan Dibuat", time: order.createdAt ? formatDateTime(order.createdAt) : "", completed: true },
        ];

        if (order.paidAt) {
            steps.push({ label: "Menunggu Konfirmasi Admin", time: formatDateTime(order.paidAt), completed: true });
        }

        if (order.status === "cooking" || order.status === "ready" || order.status === "completed") {
            steps.push({ label: "Pesanan Diproses", time: "Sedang disiapkan 🔥", completed: true, active: order.status === "cooking" });
        }

        if (order.status === "ready" || order.status === "completed") {
            steps.push({ label: "Pesanan Siap", time: `Siap ${order?.deliveryMethod === "pickup" ? 'Diambil' : 'Diantar'}${order?.paymentMethod === 'qris' ? "" : ", Pembayaran Di Tempat"}`, completed: true, active: order.status === "ready" });
        }

        if (order.status === "completed") {
            steps.push({ label: "Pesanan Selesai", time: "Pesanan telah selesai", completed: true });
        }

        if (order.status === "cancelled") {
            steps.push({ label: "Pesanan Dibatalkan", time: "Pesanan dibatalkan", completed: true, cancelled: true });
        }

        return steps;
    };
    const formatOrderCode = (uuid) => {
        // Ambil 8 karakter pertama (atau sesuaikan)
        return uuid.substring(0, 8).toUpperCase();
    };

    const timelineSteps = order ? getTimelineSteps() : [];

    if (!order) return (
        <div className="min-h-screen bg-gradient-to-b from-orange-500 via-yellow-300 to-yellow-100 flex items-center justify-center">
            <p className="text-white text-xl font-bold">Loading...</p>
        </div>
    );

    return (
        <div className="pb-24 lg:w-lg overflow-hidden rounded-xl shadow-2xl bg-gray-100 flex justify-center font-sans">
            <div className="w-full border border-white/40 mx-4">
                {/* Header */}
                <div className="px-6 pt-8 pb-5">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate("/admin/orders")}
                            className="w-10 h-10 rounded-full bg-white shadow text-xl flex items-center justify-center hover:bg-gray-50 active:scale-95 transition"
                        >
                            <BiArrowBack size={20} />
                        </button>

                        <div>
                            <p className="text-sm text-gray-500">Detail Pesanan (Admin)</p>
                            <div className="text-2xl font-black text-black">
                                CKUY-{formatOrderCode(order.code)}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Status Card */}
                <div className="px-4">
                    <div className="bg-white rounded-xl p-5 border border-orange-100 shadow-sm">
                        <div className="flex justify-between items-center">
                            <div className="text-left">
                                <p className="text-sm text-gray-500">Status Pesanan</p>
                                <h2 className="text-2xl font-black mt-1">
                                    {statusMap[order.status]}
                                </h2>
                            </div>

                            <div className={`px-4 py-2 rounded-2xl text-sm font-bold ${statusBadgeColor[order.status]}`}>
                                {order.status === "cooking" ? "Menyiapkan" :
                                    order.status === "ready" ? "Siap" :
                                        order.status === "completed" ? "Selesai" :
                                            order.status === "cancelled" ? "Dibatalkan" :
                                                order.status === "paid" ? (order.paymentMethod === 'qris' ? 'Paid' : 'COD') : "Pending"}
                            </div>
                        </div>

                        {/* Timeline */}
                        <div className="mt-6 text-left space-y-4">
                            {timelineSteps.map((step, index) => (
                                <div key={index} className={`flex gap-3 ${step.active === false && index !== 0 ? 'opacity-40' : ''}`}>
                                    <div
                                        className={`w-4 h-4 rounded-full mt-1 flex-shrink-0 ${step.cancelled
                                            ? 'bg-red-500'
                                            : step.completed
                                                ? step.active
                                                    ? 'bg-orange-500'
                                                    : 'bg-green-500'
                                                : 'bg-gray-300'
                                            }`}
                                    ></div>

                                    <div>
                                        <h3 className="font-bold">{step.label}</h3>
                                        <p className="text-sm text-gray-500">{step.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Customer Info */}
                <div className="px-4 mt-4">
                    <div className="bg-white rounded-xl p-5 border border-orange-100 shadow-sm">
                        <h2 className="text-xl text-left font-black mb-4">Informasi Pemesan</h2>

                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Nama</span>
                                <span className="font-semibold">{order.customerName}</span>
                            </div>

                            {order.phone && (
                                <div className="flex justify-between">
                                    <span className="text-gray-500">WhatsApp</span>
                                    <span className="font-semibold">{order.phone}</span>
                                </div>
                            )}

                            <div className="flex justify-between">
                                <span className="text-gray-500 text-left">Metode Pembayaran</span>
                                <span className="font-semibold text-right">
                                    {order.paymentMethod === "qris" ? "QRIS" : "Bayar Di Tempat"}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-gray-500">Pengiriman</span>
                                <span className="font-semibold">
                                    {order.deliveryMethod === "pickup" ? "Ambil Di Warung" : "Diantar"}
                                </span>
                            </div>

                            {order.address && (
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Alamat</span>
                                    <span className="font-semibold text-right max-w-[200px]">{order.address}</span>
                                </div>
                            )}

                            {order.scheduledAt && (
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Waktu Pengambilan</span>
                                    <span className="font-semibold">{formatDateTime(order.scheduledAt)}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Product List */}
                <div className="px-4 mb-5 mt-4">
                    <div className="bg-white rounded-xl p-5 border border-orange-100 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-black">Produk</h2>
                            <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-xl text-xs font-bold">
                                {order.OrderItem?.length || 0} Item
                            </span>
                        </div>

                        {/* Items */}
                        {order.OrderItem?.map((item, index) => (
                            <div
                                key={item.id}
                                className={`flex justify-between items-center py-3 ${index < order.OrderItem.length - 1 ? 'border-b border-dashed' : ''
                                    }`}
                            >
                                <div className="">
                                    <h3 className="text-left font-bold">{item.Product.name}</h3>
                                    <p className="text-sm text-left text-gray-500">
                                        x{item.qty} • {item.type === "matang" ? "Matang" : "Frozen/Mentah"} • Rp {item.price.toLocaleString()}
                                    </p>
                                </div>
                                <p className="font-black">Rp {(item.qty * item.price).toLocaleString()}</p>
                            </div>
                        ))}

                        {/* Note */}
                        {order.note && (
                            <div className="py-3 border-t border-dashed mt-2">
                                <h3 className="font-bold mb-1">Catatan:</h3>
                                <div
                                    dangerouslySetInnerHTML={{ __html: order.note }}
                                    className="text-sm text-gray-500"
                                />
                            </div>
                        )}

                        {/* Total */}
                        <div className="mt-5 pt-4 border-t flex justify-between items-center">
                            <div>
                                <p className="text-sm text-gray-500">Total Pembayaran</p>
                                <h2 className="text-3xl font-black">Rp {order.total.toLocaleString()}</h2>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Admin Action Button */}
                {action && (
                    <div className="px-4 mt-5 pb-6">
                        <button
                            disabled={loading || loadingCode === order.code}
                            onClick={() => handleAction(order.code, action.next)}
                            className={`w-full text-white py-5 rounded-2xl font-black text-lg shadow-lg active:scale-[0.98] transition ${action.color} ${loading || loadingCode === order.code ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
                                }`}
                        >
                            {loadingCode === order.code ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Memproses...
                                </span>
                            ) : (
                                action.label
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

// 🔥 logic aksi dipisah biar bersih
function getNextAction(status) {
    switch (status) {
        case 'pending':
            return { label: 'Tandai Dibayar', next: 'paid', color: 'bg-blue-500 shadow-blue-200' };
        case 'paid':
            return { label: 'Konfirmasi dan Siapkan', next: 'cooking', color: 'bg-orange-500 shadow-orange-200' };
        case 'cooking':
            return { label: 'Tandai Siap', next: 'ready', color: 'bg-green-500 shadow-green-200' };
        case 'ready':
            return { label: 'Selesaikan Pesanan', next: 'completed', color: 'bg-gray-700 shadow-gray-200' };
        default:
            return null;
    }
}