import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { formatDateTime } from '../../utils/date';
export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  const statusMap = {
    pending: 'Menunggu Pembayaran',
    paid: 'Sudah Dibayar',
    cooking: 'Sedang Dimasak',
    ready: 'Siap Diambil',
    completed: 'Selesai',
    cancelled: 'Dibatalkan'
  };
  const statusColor = {
    pending: 'bg-yellow-500',
    paid: 'bg-blue-500',
    cooking: 'bg-orange-500',
    ready: 'bg-green-500',
    completed: 'bg-gray-500',
    cancelled: 'bg-red-500'
  };
  const fetchOrder = async () => {
    try {
      const res = await api.get(`/orders/${id}`);
      setOrder(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOrder();

    // 🔁 polling tiap 5 detik
    const interval = setInterval(fetchOrder, 5000);

    return () => clearInterval(interval);
  }, [id]);

  if (!order) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-4 pb-24">
      <div className='flex mb-4 border-b-1 border-gray-200'>
        <h2 style={{ marginBottom: '2rem', fontSize: '2rem' }} className="text-5xl text-left google-sans-flex-bold">
          Pesanan {order.customerName}
        </h2>
      </div>

      {/* Order Code */}
      <div className="mb-4 text-left flex flex-row justify-between">
        <p className="font-semibold">Kode Pesanan</p>
        <span className="text-right">
          {order.code}
        </span>
      </div>

      {/* STATUS */}
      <div className="mb-4 text-left flex flex-row justify-between">
        <p className="font-semibold">Status</p>
        <span className={`px-3 py-1 rounded-full text-white text-sm
          ${order.status === 'paid' ? 'bg-green-500' : 'bg-yellow-500'}
        `}>
          {order.status === 'paid' ? 'Sudah Dibayar' : (order.status === 'pending' ? 'Menunggu Pembayaran' : 'Dibatalkan')}
        </span>
      </div>

      {/* Waktu pembayaran */}
      {order.paidAt && (
        <div className="mb-4 text-left flex flex-row justify-between">
          <p className="font-semibold">Waktu Pembayaran</p>
          <span className="text-left">
            {formatDateTime(order.paidAt)}
          </span>
        </div>
      )}

      {/* delivery Method */}
      <div className="mb-4 text-left flex flex-row justify-between">
        <p className="font-semibold">Metode Pengiriman</p>
        {/* Badge */}
        <span className={`px-3 py-1 rounded-full text-white text-sm
          ${order.deliveryMethod === 'pickup' ? 'bg-orange-500' : 'bg-sky-500'}
        `}>
          {order.deliveryMethod === 'pickup' ? 'Ambil di tempat' : 'Diantar ke alamat'}
        </span>
      </div>


      {/* payment Method */}
      <div className="mb-4 text-left flex flex-row justify-between">
        <p className="font-semibold">Metode Pembayaran</p>
        {/* Badge */}
        <span className={`px-3 py-1 rounded-full text-white text-sm
          ${order.paymentMethod === 'qris' ? 'bg-blue-500' : 'bg-gray-500'}
          `}>
          {order.paymentMethod === 'qris' ? 'QRIS' : 'Cash'}
        </span>
      </div>
      {/*Alamat */}
      <div className="mb-4 text-left">
        <p className="font-semibold">Alamat Pengiriman</p>
        <p className="text-sm text-gray-500">
          {order.address}
        </p>
      </div>

      {/* Waktu Pengambilan */}
      <div className="mb-4 text-left">
        <p className="font-semibold">Waktu Pengambilan</p>
        <p className="text-sm text-gray-500">
          {order.scheduledAt ? `Diambil ${formatDateTime(order.pickupTime)}` : `Ambil Sekarang`}
        </p>
      </div>
      {/* ITEMS */}
      <div className="space-y-3">
        {order.OrderItem?.map(item => (
          <div
            key={item.id}
            className="flex justify-between bg-white p-3 rounded-xl shadow-sm"
          >
            <div>
              <p className="font-semibold">
                {item.Product.name}
              </p>
              <p className="text-sm text-gray-500">
                {item.qty} x Rp {item.price}
              </p>
            </div>

            <div className="font-semibold">
              Rp {item.qty * item.price}
            </div>
          </div>
        ))}
      </div>

      {/* TOTAL */}
      <div className="mt-6 text-lg font-bold">
        Total: Rp {order.total}
      </div>

      {/* jika qris, dan belum menyelesaikan pembayaran */}
      {order.paymentMethod === 'qris' && order.status !== 'paid' && (
        <div className="mb-4 p-3 bg-blue-100 text-blue-800 rounded-lg">
          Silakan selesaikan pembayaran Anda melalui QRIS.
        </div>
      )}

      {/* link ke payment */}
      {order.paymentMethod === 'qris' && order.status !== 'paid' && (
        <a
          href={order?.paymentUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Bayar Sekarang
        </a>
      )}
    </div>
  );
}