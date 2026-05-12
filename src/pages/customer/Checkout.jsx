import { useEffect, useState } from "react";
import { useCart } from "../../context/CartContext";
import { api } from "../../services/api";

export default function Checkout() {
  const { cart, total, updateQty, emptyCart } = useCart();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    paymentMethod: "qris",
    notes: "",
    schedule: "",
    scheduleDateTime: "",
    deliveryMethod: "pickup",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // load dari localStorage, kalo ada
    const saved = JSON.parse(localStorage.getItem("customer") || "{}");
    setForm({
      name: saved.name || "",
      phone: saved.phone || "",
      address: saved.address || "",
      paymentMethod: saved.paymentMethod || "qris",
      notes: saved.notes || "",
      schedule: saved.schedule || "sekarang",
      scheduleDateTime: saved.scheduleDateTime || "",
      deliveryMethod: saved.deliveryMethod || "pickup",
    });
  }, []);

  const handleCheckout = async () => {
    if (!form.name || !form.phone) {
      alert("Nama dan No HP wajib diisi!");
      return;
    }

    // Cek Alamatnya jika pengiriman bukan pickup
    if (form.deliveryMethod !== "pickup" && !form.address) {
      alert("Alamat wajib diisi!");
      return;
    }

    if (cart.length === 0) {
      alert("Keranjang kosong!");
      return;
    }

    try {
      setLoading(true);

      // simpan ke localStorage
      localStorage.setItem("customer", JSON.stringify(form));

      const payload = {
        customerName: form.name,
        customerPhone: form.phone,
        paymentMethod: form.paymentMethod,
        address: form.address,
        deliveryMethod: form.deliveryMethod,
        note: form.notes,
        scheduledAt: form.schedule === "besok" ? form.scheduleDateTime : null,

        items: cart.map((item) => ({
          productId: item.id,
          qty: item.qty,
          type: "matang",
        })),
      };

      const res = await api.post("/orders", payload);
      const { paymentUrl } = res.data;
      // reset form & cart
      setForm({
        name: "",
        phone: "",
        address: "",
        notes: "",
        paymentMethod: "qris",
        deliveryMethod: "pickup",
        schedule: "sekarang",
        scheduleDateTime: "",
      });
      emptyCart();
      window.location.href = paymentUrl;
    } catch (error) {
      console.error("Error during checkout:", error);
      alert("Terjadi kesalahan saat melakukan checkout.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 pb-24">
      <div className="pb-26">
        <h1 className="text-xl font-bold google-sans-flex-bold text-left">
          Checkout
        </h1>

        {cart.length === 0 && (
          <p className="text-gray-500 google-sans-flex-regular text-left">
            Keranjang kosong 😢
          </p>
        )}
        <div className="text-left my-4 flex flex-col gap-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nama
          </label>

          <input
            className="shadow-sm ease-in-out transition-all outline-none focus:ring-2 focus:ring-orange-500 focus:border-white p-2 border-gray-300 rounded-lg"
            placeholder="Masukkan nama..."
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <label className="block text-sm font-medium text-gray-700 mt-1">
            No. WhatsApp/Handphone
          </label>

          <input
            className="shadow-sm ease-in-out transition-all outline-none focus:ring-2 focus:ring-orange-500 focus:border-white p-2 border-gray-300 rounded-lg"
            placeholder="Masukkan Nomor..."
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <label className="block text-sm font-medium text-gray-700 mt-1">
            Metode Pengiriman
          </label>

          <select
            value={form.deliveryMethod}
            onChange={(e) =>
              setForm({ ...form, deliveryMethod: e.target.value })
            }
            className="w-full p-3 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-white"
          >
            <option value="pickup">Ambil Sendiri</option>
            <option value="delivery">Diantar</option>
          </select>

          {form.deliveryMethod === "delivery" && (
            <input
              className="shadow-sm ease-in-out transition-all outline-none focus:ring-2 focus:ring-orange-500 focus:border-white p-2 border-gray-300 rounded-lg"
              placeholder="Alamat (opsional)"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
          )}
          <label className="block text-sm font-medium text-gray-700 mt-1">
            Metode Pembayaran
          </label>

          <select
            value={form.paymentMethod}
            onChange={(e) =>
              setForm({ ...form, paymentMethod: e.target.value })
            }
            className="w-full p-3 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-white"
          >
            <option value="qris">QRIS / E-Wallet</option>
            <option value="cash">Bayar Ditempat</option>
          </select>
          {/* Schedule */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Jadwal Pengambilan
            </label>
            <select
              className="shadow-sm ease-in-out transition-all outline-none focus:ring-2 focus:ring-orange-500 focus:border-white p-2 border-gray-300 rounded-lg"
              value={form.schedule}
              onChange={(e) => setForm({ ...form, schedule: e.target.value })}
            >
              <option value="sekarang">Sekarang</option>
              <option value="besok">Besok</option>
            </select>
          </div>
          {/* Kalau schedule adalah "besok", tampilkan input untuk tanggal dan waktu */}
          {form.schedule === "besok" && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal dan Waktu Pengambilan
              </label>
              <input
                type="datetime-local"
                className="shadow-sm ease-in-out transition-all outline-none focus:ring-2 focus:ring-orange-500 focus:border-white p-2 border-gray-300 rounded-lg"
                value={form.scheduleDateTime}
                onChange={(e) =>
                  setForm({ ...form, scheduleDateTime: e.target.value })
                }
              />
            </div>
          )}

          <textarea
            className="shadow-sm ease-in-out transition-all outline-none focus:ring-2 focus:ring-orange-500 focus:border-white p-2 h-24 border-gray-300 rounded-lg"
            placeholder="Catatan (opsional)"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />
        </div>
        <div className="mb-8">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm mb-3"
            >
              <div>
                <img
                  src="https://i.ytimg.com/vi/CaqSlzAgkN4/maxresdefault.jpg"
                  className="rounded-4xl object-cover h-16 shadow-md"
                  alt=""
                  srcset=""
                />
              </div>
              <div>
                <h4 className="font-semibold">{item.name}</h4>
                <p className="text-gray-500 text-sm">Rp {item.price}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQty(item.id, item.qty - 1)}
                  className="w-8 h-8 bg-gray-200 rounded-full"
                >
                  -
                </button>

                <input
                  type="number"
                  value={item.qty}
                  onChange={(e) =>
                    updateQty(item.id, parseInt(e.target.value) || 0)
                  }
                  className="font-bold text-center border border-gray-300 rounded-md w-10"
                />

                <button
                  onClick={() => updateQty(item.id, item.qty + 1)}
                  className="w-8 h-8 bg-orange-500 text-white rounded-full"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* tombol harus di bottom */}
      <div className="fixed bottom-20 left-0 right-0 px-4 pb-6 bg-white border-t border-gray-200">
        {/* Total */}
        <div className="mt-6 text-lg font-bold">Total: Rp {total}</div>

        {/* Button */}
        <button
          onClick={handleCheckout}
          disabled={loading}
          className="mt-4 w-full bg-orange-500 text-white py-4 rounded-xl font-semibold shadow-lg"
        >
          {loading ? "Memproses..." : "Checkout"}
        </button>
      </div>
    </div>
  );
}
