import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { useCart } from '../../context/CartContext';

export default function Home() {
  const [products, setProducts] = useState([]);
  const { addToCart } = useCart();

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
  return (
    <div className="p-4 pb-24">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold">CirengKuy</h1>
      </div>

      {/* Search */}
      <input
        placeholder="Cari cireng..."
        className="w-full p-3 rounded-xl border border-gray-300 mb-4"
      />

      {/* Grid */}
      <div className="grid grid-cols-2 gap-4">
        {products.map(p => (
          <div
            key={p.id}
            className="bg-white p-3 rounded-2xl shadow-sm"
          >
            <div className="h-24 bg-gray-200 rounded-xl mb-3" />

            <h3 className="font-semibold text-sm">{p.name}</h3>
            <p className="text-orange-500 font-bold text-sm">
              Rp {p.price}
            </p>

            <button
              onClick={() => addToCart(p)}
              className="mt-3 w-full bg-orange-500 text-white py-2 rounded-lg text-sm"
            >
              Tambah
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}x