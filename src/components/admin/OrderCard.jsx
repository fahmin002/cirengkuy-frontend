// src/components/orders/OrderCard.jsx
const statusMap = {
  pending: 'Pending',
  paid: 'Dibayar',
  cooking: 'Dimasak',
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

export default function OrderCard({ order, onAction, loading }) {
  const action = getNextAction(order.status);

  return (
    <div className="bg-white p-4 rounded-2xl shadow-xl border border-gray-200">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <p className="font-semibold">
            #{order.id} • {order.customerName}
          </p>
          {order.customerPhone && (
            <p className="text-xs text-gray-500">{order.customerPhone}</p>
          )}
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
      </div>

      {/* Footer */}
      <div className="mt-4 flex justify-between items-center">
        <p className="font-bold">Rp {order.total.toLocaleString()}</p>

        {action && (
          <button
            disabled={loading}
            onClick={() => onAction(order.code, action.next)}
            className={`px-3 py-2 rounded-xl text-sm text-white ${action.color} ${
              loading ? 'opacity-50' : ''
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