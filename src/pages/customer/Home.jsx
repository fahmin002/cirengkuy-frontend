import { useEffect, useState, useRef } from "react";
import { api } from "../../services/api";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";

function Home() {
  const [products, setProducts] = useState([]);
  const { addToCart, cart, updateQty } = useCart();
  const navigate = useNavigate();
  // helper: cek qty item di cart
  const getQty = (productId) => {
    const item = cart.find((i) => i.id === productId);
    return item ? item.qty : 0;
  };

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await api.get("/products");
        // filter produk yang isActive = true
        const activeProducts = res.data.filter((p) => p.isActive);
        setProducts(activeProducts);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
    }
    // Check guest udh pernah buka app, kalo belum arahkan ke landing page
    const isFirstVisit = !localStorage.getItem("visited");
    if (isFirstVisit) {
      localStorage.setItem("visited", "true");
      navigate("/landing");
    }
    fetchProducts();
  }, []);

  const handleUpdateQty = (id, qty) => {
    // jika qty melebihi 0, kembalikan jumlah ke maksimal stok
    const product = products.find((p) => p.id === id);
    if (product && qty > product.stock) {
      updateQty(id, product.stock);
    } else {
      updateQty(id, qty);
    }
  };

  return (
    <div className="min-h-screen p-4 rounded-2xl bg-gray-50 pb-24">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex flex-col justify-center items-start">
          {/* Get Customer  first name */}

          <h1 className="text-2xl google-sans-flex-bold">
            Hai,{" "}
            {localStorage.getItem("customer")
              ? JSON.parse(localStorage.getItem("customer")).name.split(" ")[0]
              : "Kawan"}
          </h1>
          <p className="text-sm text-gray-500">Mau pesen apa hari ini?</p>
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

      {/* Promo Banner */}
      <div className="bg-orange-500 shadow-lg text-white p-4 rounded-2xl mb-4">
        <h2 className="text-lg font-semibold">Beli 20 gratis 5 🔥</h2>
        <p className="text-sm">Gas jajan cireng sekarang!</p>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 gap-4">
        {products.map((p) => (
          <div
            key={p.id}
            className="bg-white px-4 py-2 mt-8 rounded-2xl shadow-md hover:scale-105 transition"
          >
            {/* <div className=" bg-gray-200 rounded-full relative bottom-10"  /> */}
            <img
              src={`${import.meta.env.VITE_BACKEND_URL}${p.imageUrl}`}
              className="rounded-4xl object-cover relative bottom-10 h-24 shadow-md"
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
                  onClick={() => addToCart(p)}
                  className="bg-orange-500 text-white py-2 px-4 rounded-xl font-semibold shadow-lg"
                >
                  Masuk Keranjang
                </button>
              </div>
            ) : (
              <div className="flex mt-4 flex-row justify-between items-center">
                <button
                  onClick={() => handleUpdateQty(p.id, getQty(p.id) - 1)}
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
                  onClick={() => handleUpdateQty(p.id, getQty(p.id) + 1)}
                  className="w-8 h-8 bg-orange-500 text-white rounded-full"
                >
                  +
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
