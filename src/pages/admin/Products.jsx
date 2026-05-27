// src/pages/admin/Products.jsx

import { useEffect, useMemo, useState } from "react";
import { api } from "../../services/api";
import ProductCard from "../../components/admin/ProductCard";
import { BiPlus, BiSearch } from "react-icons/bi";
import ProductForm from "../../components/admin/ProductForm";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const res = await api.get("/products/admin");

      setProducts(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  /* ---------------- FILTER ---------------- */

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchSearch = product.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchFilter =
        filter === "all"
          ? true
          : filter === "active"
            ? product.isActive
            : !product.isActive;

      return matchSearch && matchFilter;
    });
  }, [products, search, filter]);

  return (
    <div className="bg-gray-50 rounded-xl pb-24">
      {/* Header */}
      <div className="sticky p-4 rounded-xl top-0 z-10 bg-gray-50 ">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl text-left font-bold text-gray-900">
              Produk
            </h1>

            <p className="text-sm text-left text-gray-500 mt-1">
              Kelola menu dan stok produk
            </p>
          </div>

          <button
            onClick={() => {
              setShowForm(true);
            }}
            className="
              flex items-center gap-2
              bg-orange-500
              active:bg-orange-600
              text-white
              px-4 py-3
              rounded-2xl
              font-medium
              shadow-sm
              transition
            "
          >
            <BiPlus size={18} />
            Tambah
          </button>
        </div>

        {/* Search */}
        <div className="relative mt-4">
          <BiSearch
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Cari produk..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              w-full
              bg-white
              border border-gray-200
              rounded-2xl
              pl-11 pr-4 py-3
              outline-none
              text-sm
              shadow-sm
            "
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mt-4 overflow-x-auto scrollbar-hide">
          {[
            { key: "all", label: "Semua" },
            { key: "active", label: "Aktif" },
            { key: "inactive", label: "Nonaktif" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`
                whitespace-nowrap
                px-4 py-2 rounded-full
                text-sm font-medium
                transition

                ${
                  filter === tab.key
                    ? "bg-orange-500 text-white"
                    : "bg-white text-gray-600 border border-gray-200"
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="mt-4">
        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-10">
            <p className="text-gray-400 text-sm">Memuat produk...</p>
          </div>
        )}

        {/* Empty */}
        {!loading && filteredProducts.length === 0 && (
          <div
            className="
              bg-white
              rounded-3xl
              p-8
              text-center
              shadow-sm
            "
          >
            <p className="text-gray-500 font-medium">Produk tidak ditemukan</p>

            <p className="text-sm text-gray-400 mt-2">
              Coba ubah pencarian atau filter
            </p>
          </div>
        )}

        {/* Product List */}
        <div className="space-y-3 px-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onUpdated={fetchProducts}
              onEdit={(product) => {
                setSelectedProduct(product);
                setShowForm(true);
              }}
            />
          ))}
        </div>
      </div>
      {/* Product Form */}
      {showForm && (
        <ProductForm
          product={selectedProduct}
          onClose={() => {
            setShowForm(false);
            setSelectedProduct(null);
          }}
          onSuccess={fetchProducts}
        />
      )}
    </div>
  );
}
