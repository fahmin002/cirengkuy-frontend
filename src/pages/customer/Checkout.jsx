import { useEffect, useState } from "react";
import { useCart } from "../../context/CartContext";
import { api } from "../../services/api";
import { toast } from "sonner";
import { FaRegTrashAlt, FaTrash } from "react-icons/fa";

export default function Checkout() {
  const { cart, total, updateQty, emptyCart, updateType } = useCart();
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
  const [storeOpen, setStoreOpen] = useState(null);
  const [loading, setLoading] = useState(false);
  const [checkingStore, setCheckingStore] = useState(false);
  const [products, setProducts] = useState([]);
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res =
          await api.get(
            "/products/customer"
          );
        setProducts(
          res.data || []
        );
      } catch (err) {
        toast.error("Terjadi kesalahan!");
      }
    }
    async function fetchSetting() {

      try {

        const res =
          await api.get(
            "/settings/admin/store"
          );

        setStoreOpen(
          res.data.storeOpen
        );

      } catch (err) {

        console.error(err);

      } finally {

        setCheckingStore(false);

      }

    }

    fetchSetting();
    fetchProducts();

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
      deliveryMethod: "pickup",
    });
  }, []);



  const handleUpdateQty = (id, qty) => {
    // jika qty melebihi 0, kembalikan jumlah ke maksimal stok
    const product = products.find((p) => p.id === id);
    if (product && qty > product.stock) {
      updateQty(id, product.stock);
      toast.error("Jumlah produk melebihi stok!")
    } else if (qty < 0 || !qty) {
      toast('Yakin menghapus item?', {
        cancel: {
          label: 'Batal',
          onClick: () => updateQty(id, 1),

        },
        action: {
          label: 'Hapus',
          onClick: () => updateQty(id, qty),
          actionButtonStyle: {
            backgroundColor: "orange"
          }
        }
      });
    } else {
      updateQty(id, qty);
    }
  };

  const getQty = (productId) => {
    const item = cart.find((i) => i.id === productId);
    return item ? item.qty : 0;
  };


  const handleCheckout = async () => {

    if (!form.name) {
      toast.error("Nama wajib diisi!");
      return;
    }
    if (!form.phone) {
      toast.error("No HP wajib diisi!");
      return;
    }

    // Cek Alamatnya jika pengiriman bukan pickup
    if (form.deliveryMethod !== "pickup" && !form.address) {
      toast.error("Alamat wajib diisi!");
      return;
    }

    if (cart.length === 0) {
      toast.error("Keranjang kosong!");
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
          type: item.type,
        })),
      };

      const res = await api.post("/orders/customer", payload);
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
      toast.error("Terjadi kesalahan saat melakukan checkout.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-gray-50 rounded-xl pb-24">
      <div className="">
        <h1 className="text-xl font-bold google-sans-flex-bold text-left">
          Checkout
        </h1>
        <div className="">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex flex-row gap-3 ring-1 ring-orange-200 shadow-orange-100 justify-between items-center bg-white p-2 rounded-xl shadow-sm mb-3"
            >
              <div className="flex-col flex justify-between h-full gap-4">
                <img
                  src={`${item.imageUrl}`}
                  className="rounded-md object-cover w-24 shadow-md"
                  alt=""
                  srcSet=""
                />
                <select
                  className="font-bold text-center border border-orange-200 rounded-md"
                  value={item.type}
                  onChange={(e) => updateType(item.id, e.target.value)}
                >
                  <option value="matang">Matang</option>
                  <option value="mentah">Mentah</option>
                </select>
              </div>
              <div>
                <div className="text-left">
                  <h4 className="font-semibold">{item.name}</h4>
                  <p className="text-gray-500 text-sm">{item.type === "matang" ? "Matang" : "Mentah/Frozen"}</p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="flex-row gap-2 justify-between items-center flex">
                    <div className="mt-4">
                      <p className="text-black font-bold">Rp {item.price}</p>
                    </div>
                    <div className="flex ring-1 ring-orange-200 bg-orange-100 gap-1 rounded-md mt-4 ">
                      <button
                        onClick={() => handleUpdateQty(item.id, getQty(item.id) - (getQty(item.id) % 5 === 0 ? 5 : 4))}
                        className="active:bg-orange-300 text-orange-500 p-2"
                      >
                        {getQty(item.id) <= 5 ? <FaRegTrashAlt className="w-full bg-orange-100" /> : <span className="">-</span>}
                      </button>
                      {/* <div
                    className="font-bold text-center border border-gray-300 rounded-md w-10"
                  >{item.qty}</div> */}
                      <input
                        type="number"
                        value={getQty(item.id)}
                        onChange={(e) =>
                          handleUpdateQty(item.id, parseInt(e.target.value) || 0)
                        }
                        className="font-bold text-center  w-10"
                      />
                      <button
                        onClick={() => handleUpdateQty(item.id, getQty(item.id) + (getQty(item.id) % 5 === 0 ? 5 : 4))}
                        className="p-2 text-orange-500 active:bg-orange-300"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-left my-4 flex flex-col gap-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nama Pemesan
          </label>

          <input
            className="shadow-md ring-1 ring-orange-200 shadow-orange-100 ease-in-out transition-all outline-none focus:ring-2 focus:ring-orange-500 focus:border-white p-2 border-gray-300 rounded-lg"
            placeholder="Masukkan nama..."
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <label className="block text-sm font-medium text-gray-700 mt-1">
            No. WhatsApp/Handphone
          </label>

          <input
            className="shadow-md ring-1 ring-orange-200 shadow-orange-100 ease-in-out transition-all outline-none focus:ring-2 focus:ring-orange-500 focus:border-white p-2 border-gray-300 rounded-lg"
            placeholder="Masukkan Nomor..."
            value={form.phone}
            type="number"
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <label className="block text-sm font-medium text-gray-700 mt-1">
            Metode Pengiriman
          </label>

          <div className="grid grid-cols-2 gap-2 mt-2">
            <button
              type="button"
              onClick={() =>
                setForm({
                  ...form,
                  deliveryMethod: "pickup",
                })
              }
              className={`
      p-3 rounded-xl font-medium transition-all
      ${form.deliveryMethod === "pickup"
                  ? "bg-orange-500 text-white shadow-md"
                  : "bg-white ring-1 ring-orange-200"
                }
    `}
            >
              Ambil Sendiri
            </button>

            {total >= 20000 && (
              <button
                type="button"
                onClick={() =>
                  setForm({
                    ...form,
                    deliveryMethod: "delivery",
                  })
                }
                className={`
        p-3 rounded-xl font-medium transition-all
        ${form.deliveryMethod === "delivery"
                    ? "bg-orange-500 text-white shadow-md"
                    : "bg-white ring-1 ring-orange-200"
                  }
      `}
              >
                Diantar
              </button>
            )}
          </div>

          {form.deliveryMethod === "delivery" && (
            <>
              <label className="block text-sm font-medium text-gray-700 mt-1">
                Alamat
              </label>
              <textarea
                className="h-24 shadow-md ring-1 ring-orange-200 shadow-orange-100 ease-in-out transition-all outline-none focus:ring-2 focus:ring-orange-500 focus:border-white p-2 border-gray-300 rounded-lg"
                placeholder="Alamat"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </>
          )}
          <label className="block text-sm font-medium text-gray-700 mt-1">
            Metode Pembayaran
          </label>

          <div className="grid grid-cols-2 gap-2 mt-2">
            <button
              type="button"
              onClick={() =>
                setForm({
                  ...form,
                  paymentMethod: "qris",
                })
              }
              className={`
      p-3 rounded-xl font-medium transition-all
      ${form.paymentMethod === "qris"
                  ? "bg-orange-500 text-white shadow-md"
                  : "bg-white ring-1 ring-orange-200"
                }
    `}
            >
              QRIS / E-Wallet
            </button>

            <button
              type="button"
              onClick={() =>
                setForm({
                  ...form,
                  paymentMethod: "cash",
                })
              }
              className={`
      p-3 rounded-xl font-medium transition-all
      ${form.paymentMethod === "cash"
                  ? "bg-orange-500 text-white shadow-md"
                  : "bg-white ring-1 ring-orange-200"
                }
    `}
            >
              Bayar Ditempat
            </button>
          </div>
          {/* Schedule */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Jadwal Pengambilan
            </label>
            <select
              className="shadow-md ring-1 ring-orange-200 shadow-orange-100 ease-in-out transition-all outline-none focus:ring-2 focus:ring-orange-500 focus:border-white p-2 border-gray-300 rounded-lg"
              value={form.schedule}
              onChange={(e) => setForm({ ...form, schedule: e.target.value })}
            >
              <option value="sekarang">Sekarang</option>
              <option value="nanti">Pilih Jadwal</option>
            </select>
          </div>
          {/* Kalau schedule adalah "besok", tampilkan input untuk tanggal dan waktu */}
          {form.schedule === "nanti" && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal dan Waktu Pengambilan
              </label>
              <input
                type="datetime-local"
                className="shadow-md ring-1 ring-orange-200 shadow-orange-100 ease-in-out transition-all outline-none focus:ring-2 focus:ring-orange-500 focus:border-white p-2 border-gray-300 rounded-lg"
                value={form.scheduleDateTime}
                onChange={(e) =>
                  setForm({ ...form, scheduleDateTime: e.target.value })
                }
              />
            </div>
          )}

          <textarea
            className="shadow-md mt-2 ring-1 ring-orange-200 shadow-orange-100 ease-in-out transition-all outline-none focus:ring-2 focus:ring-orange-500 focus:border-white p-2 h-24 border-gray-300 rounded-lg"
            placeholder="Catatan (opsional)"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />
        </div>

      </div>


      {/* tombol harus di bottom */}
      <div className="">
        {/* Total */}
        <div className="flex flex-row justify-between">
          <div>
            <div className="text-left ">Total Pembayaran</div>
            <div className="text-left font-bold text-xl">Rp {total}</div>
          </div>
          <div className="">
            <p className="bg-orange-200 font-bold p-2 rounded-xl text-orange-500">{cart.length} Item</p>
          </div>
        </div>
        {!storeOpen ? (
          <div className="p-4">

            <div
              className="
          bg-red-50
          border
          border-red-200
          rounded-2xl
          p-6
          text-center
        "
            >

              <h1
                className="
            text-xl
            font-bold
            text-red-600
            mb-2
          "
              >
                🔴 Warung Sedang Tutup
              </h1>

              <p className="text-gray-600">
                Checkout sementara tidak tersedia 😢
              </p>

            </div>

          </div>
        ) : (
          <button
            onClick={handleCheckout}
            disabled={storeOpen === true ? loading : storeOpen}
            className="mt-4 w-full bg-orange-500 text-white py-4 rounded-xl font-semibold shadow-lg"
          >
            {loading ? "Memproses..." : "Checkout"}
          </button>
        )}
      </div>
    </div>
  );
}
