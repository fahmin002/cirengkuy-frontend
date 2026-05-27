import { useEffect, useState, useRef } from "react";
import { api } from "../../services/api";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { toast } from "sonner";
import { FaCartPlus } from "react-icons/fa";

function Home() {
  const [products, setProducts] = useState([]);
  const { addToCart, cart, updateQty, removeFromCart } = useCart();
  const [storeOpen, setStoreOpen] = useState(null);
  const navigate = useNavigate();
  // helper: cek qty item di cart
  const getQty = (productId) => {
    const item = cart.find((i) => i.id === productId);
    return item ? item.qty : 0;
  };

  async function fetchSetting() {

    try {

      const res =
        await api.get(
          "/settings/admin/store"
        );

      const open =
        res.data.storeOpen;
      setStoreOpen(open);
      return open;

    } catch (error) {

      console.error(error);

      return false;

    }

  }

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
  useEffect(() => {

    async function loadData() {

      const isOpen =
        await fetchSetting();

      await fetchProducts();

    }

    loadData();

  }, []);

  const handleUpdateQty = (id, qty) => {
    // jika qty melebihi 0, kembalikan jumlah ke maksimal stok
    const product = products.find((p) => p.id === id);
    if (product && qty > product.stock) {
      updateQty(id, product.stock);
      toast.error("Jumlah produk melebihi stok!")
    } else {
      updateQty(id, qty);
    }
  };

  return (
    <div className="min-h-screen p-4 rounded-2xl bg-gray-50 pb-24">
      {!storeOpen && (
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
              Produk sementara tidak tersedia
            </p>

          </div>

        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex flex-col justify-center items-start">
          {/* Get Customer  first name */}

          <h1 className="text-2xl google-sans-flex-bold">
            Hai,{" "}
            {localStorage.getItem("customer")
              ? JSON.parse(localStorage.getItem("customer")).name.split(" ")[0]
              : "Kawan"}
          </h1>
          <p className="text-sm text-gray-500">Mau pesen apa?</p>
        </div>
        <div>
          {/* logo */}
          <img
            src="web-app-manifest-192x192.png"
            alt=""
            srcSet=""
            width={100}
          />
        </div>
      </div>

      <div className="text-left mb-4 text-lg google-sans-flex-bold">List produk hari ini!</div>
      {/* Product Grid */}
      <div className="grid grid-cols-2 gap-4">
        {products.map((p) => (
          <div
            key={p.id}
            className="bg-white flex flex-col justify-around px-4 py-2 ring-1 ring-orange-200 shadow-orange-100 rounded-2xl shadow-md hover:scale-105 transition"
          >
            {/* <div className=" bg-gray-200 rounded-full relative bottom-10"  /> */}
            <img
              src={`${window.location.origin}${p.imageUrl}`}
              className="rounded-xl w-fit"
              alt=""
              srcSet=""
            />
            {/* <img src="https://palpos.disway.id/upload/689037f489181bc693bdb9bc80168e19.jpg" className='rounded-4xl relative bottom-10 h-24 shadow-md' alt="" srcset="" /> */}

            <h3 className="font-semibold google-sans-flex-bold text-left">
              {p.name}
            </h3>
            {/* Stok */}
            <p className="text-sm text-gray-500 text-left">Stok: {p.stock}</p>
            <p className="text-left font-bold google-sans-flex-bold">
              Rp {p.price}
            </p>
            {/* always at the bottom of container */}
            {/* cek apakah product sudah ditambahkan ke keranjang */}
            {/* cek inputref sedang diedit lewat keyboard atau tidak */}
            {getQty(p.id) === 0 ? (
              <div className="mt-4">
                <button
                  disabled={!storeOpen}
                  onClick={() => addToCart(p)}
                  className="bg-orange-500 flex flex-col items-center disabled:bg-orange-300 text-white py-2 px-4 rounded-xl font-semibold shadow-lg"
                >
                  <span>Tambahkan</span>
                  <FaCartPlus />
                </button>
              </div>
            ) : (
              <div className="mt-4">
                <button
                  disabled={!storeOpen}
                  onClick={() => removeFromCart(p.id)}
                  className="bg-white ring-orange-500 ring-1 text-orange-500 disabled:bg-orange-300 py-2 px-4 rounded-xl font-semibold shadow-lg"
                >
                  Hapus
                </button>
              </div>
            )}
            {/* {getQty(p.id) === 0 ? (
              <div className="mt-4">
                <button
                  disabled={!storeOpen}
                  onClick={() => addToCart(p)}
                  className="bg-orange-500 disabled:bg-orange-300 text-white py-2 px-4 rounded-xl font-semibold shadow-lg"
                >
                  Masuk Keranjang
                </button>
              </div>
            ) : (
              <div className="flex mt-4 flex-row justify-between items-center">
                <button
                  onClick={() => handleUpdateQty(p.id, getQty(p.id) - (getQty(p.id) % 5 === 0 ? 5 : 4))}
                  className="w-8 h-8 bg-gray-200 rounded-full"
                >
                  -
                </button>

                <input
                  type="number"
                  value={getQty(p.id)}
                  onChange={(e) =>
                    handleUpdateQty(p.id, parseInt(e.target.value) || 0)
                  }
                  className="font-bold text-center border border-gray-300 rounded-md w-10"
                />

                <button
                  onClick={() => handleUpdateQty(p.id, getQty(p.id) + (getQty(p.id) % 5 === 0 ? 5 : 4))}
                  className="w-8 h-8 bg-orange-500 text-white rounded-full"
                >
                  +
                </button>
              </div>
            )} */}
          </div>
        ))}
      </div>
      <div className="w-full mt-4 bg-linear-to-tl from-orange-300 to-orange-50 p-4 rounded-xl ring-1 ring-orange-100 shadow-lg shadow-orange-100">
        <div className="google-sans-flex-bold text-lg text-left">Lokasi</div>
        <div className="flex flex-col text-left">
          <span className="text-sm text-slate-500">-7.600585, 109.508192</span>
          <span className="text-sm">
            RT002/RW001, <br />Des/Kel. Semanding, Kec. Gombong,<br /> Kabupaten Kebumen, Jawa Tengah
          </span>
        </div>
        <iframe className="w-[100%] mt-4 rounded-xl ring-1 ring-orange-200 shadow-lg shadow-orange-100" src="https://www.google.com/maps/embed?pb=!4v1778829489057!6m8!1m7!1sIR4dut8LB3Z14vdwjouIZw!2m2!1d-7.600506425111304!2d109.5083138270458!3f242.5077800674391!4f-10.977941666183739!5f0.7820865974627469" allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
      </div>
    </div >
  );
}

export default Home;
