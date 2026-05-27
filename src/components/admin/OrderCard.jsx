import { FaRegEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { formatDateTime } from "../../utils/date";

// src/components/orders/OrderCard.jsx
const statusMap = {
  pending: 'Pending',
  paid: 'Dibayar',
  cooking: 'Disiapkan',
  ready: 'Siap',
  completed: 'Selesai',
  cancelled: 'Batal',
};

const statusColor = {
  pending: 'bg-yellow-500',
  paid: 'bg-blue-500',
  cooking: 'bg-orange-500',
  ready: 'bg-green-500',
  completed: 'bg-gray-500',
  cancelled: 'bg-red-500',
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

export default function OrderCard({ order, onAction, loading }) {
  const navigate = useNavigate();
  const action = getNextAction(order.status);

  return (
    <div className={`p-4 rounded-2xl shadow-lg ${statusStyle[order.status]}`}>
      {/* Header */}
      <div onClick={() => navigate(`/admin/order/${order.code}`)} className="flex justify-between items-start">
        <div>
          <p className="font-semibold">
            #{order.id} • {order.customerName}
          </p>
          {order.customerPhone && (
            <p className="text-xs text-gray-500">{order.customerPhone}</p>
          )}
          <p className="text-xs text-gray-500">
            {order.scheduledAt
              ? `Diambil ${formatDateTime(order.pickupTime)}`
              : `Diambil Sekarang`}
          </p>
        </div>


        <span
          className={`px-3 py-1 rounded-full text-white text-xs ${statusColor[order.status]}`}
        >
          {statusMap[order.status]}
        </span>

      </div>

      {/* Items preview */}
      <div className="mt-3 text-sm text-left text-gray-600">
        {order.OrderItem?.slice(0, 2).map((it) => (
          <p key={it.id}>
            {it.qty}x {it.Product?.name || 'Produk'}
          </p>
        ))}
        {order.OrderItem?.length > 2 && (
          <p className="text-xs text-gray-400">+ lainnya</p>
        )}
        <p className="font-semibold">Catatan:</p>
        <div dangerouslySetInnerHTML={{ __html: order.note }} className="text-sm text-left text-gray-500" />
      </div>

      {/* Footer */}
      <div className="mt-4 flex justify-between items-center">
        <p className="font-bold">Rp {order.total.toLocaleString()}</p>

        {action && (
          <button
            disabled={loading}
            onClick={() => onAction(order.code, action.next)}
            className={`px-3 py-2 rounded-xl text-sm text-white ${action.color} ${loading ? 'opacity-50' : ''
              }`}
          >
            {action.label}
          </button>
        )}
      </div>
    </div>
  );
}

// 🔥 logic aksi dipisah biar bersih
function getNextAction(status) {
  switch (status) {
    case 'pending':
      return { label: 'Tandai Dibayar', next: 'paid', color: 'bg-blue-500' };
    case 'paid':
      return { label: 'Mulai Masak', next: 'cooking', color: 'bg-orange-500' };
    case 'cooking':
      return { label: 'Siap', next: 'ready', color: 'bg-green-500' };
    case 'ready':
      return { label: 'Selesai', next: 'completed', color: 'bg-gray-700' };
    default:
      return null;
  }
}