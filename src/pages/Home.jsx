import { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

function Home() {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const data = await api.get('/products');
            setProducts(data);
        } catch (err) {
            console.error('Failed to fetch products:', err);
        }
    }

    const addToCart = (product) => {
        setCart(prev => {
            const exist = prev.find(p => p.productId === product.id);
            if (exist) {
                return prev.map(p =>
                    p.productId === product.id
                        ? { ...p, qty: p.qty + 1 }
                        : p
                );
            }
            return [...prev, { productId: product.id, qty: 1 }];
        });
    };

    return (
    <div className="min-h-screen bg-gray-50 p-4">

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-orange-500">
          CirengKuy 🍢
        </h1>
        <div className="w-10 h-10 bg-orange-200 rounded-full" />
      </div>

      {/* Promo Banner */}
      <div className="bg-orange-500 text-white p-4 rounded-2xl mb-4">
        <h2 className="text-lg font-semibold">
          Diskon 20% Hari Ini 🔥
        </h2>
        <p className="text-sm">Gas jajan cireng sekarang!</p>
      </div>

      {/* Search */}
      <input
        placeholder="Cari cireng..."
        className="w-full p-3 rounded-xl border mb-4"
      />

      {/* Product Grid */}
      <div className="grid grid-cols-2 gap-4">
        {products.map(p => (
          <div
            key={p.id}
            className="bg-white p-4 rounded-2xl shadow hover:scale-105 transition"
          >
            <div className="h-24 bg-gray-200 rounded-xl mb-2" />

            <h3 className="font-semibold">{p.name}</h3>

            <p className="text-orange-500 font-bold">
              Rp {p.price}
            </p>

            <button className="mt-2 w-full bg-orange-500 text-white py-2 rounded-xl">
              Tambah
            </button>
          </div>
        ))}
      </div>
    </div>
    );
}

export default Home;