// src/components/admin/ProductForm.jsx

import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { BiX } from "react-icons/bi";
import { toast } from "sonner";

export default function ProductForm({ product = null, onClose, onSuccess }) {
  const isEdit = !!product;

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    image: null,
    imageUrl: "",
    isActive: false,
  });
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || "",
        price: product.price || "",
        stock: product.stock || "",
        image: product.image || null,
        imageUrl: product.imageUrl || null,
        isActive: product.isActive || false,
      });
    }
    // Cek isEdit, lalu tampilkan preview image
    if (isEdit) {
      const preview = product.imageUrl ? product.imageUrl : null;
      setPreviewImage(preview);
    } else {
      setPreviewImage(null);
    }
  }, [product]);

  /* ---------------- HANDLE CHANGE ---------------- */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* ---------------- SUBMIT ---------------- */

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("name", form.name);
      formData.append("price", form.price);
      formData.append("stock", form.stock);
      formData.append("isActive", String(form.isActive));

      if (form.image) {
        formData.append("image", form.image);
      }

      if (isEdit) {
        if (!form.imageUrl) {
          formData.append("imageUrl", product.imageUrl);
        } else {
          formData.append("imageUrl", form.imageUrl);
        }
      } else {
        if (!form.imageUrl) {
          formData.append("imageUrl", null);
        } else {
          formData.append("imageUrl", form.imageUrl);
        }
      }
      
      if (isEdit) {
        await api.put(`/products/admin/${product.id}`, formData);
        toast.success("Detail produk telah diubah")
      } else {
        await api.post(`/products/admin`, formData);
        toast.success("Produk berhasil ditambahkan")
      }

      onSuccess?.();
      onClose?.();
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan produk");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className="
          fixed inset-0
          bg-black/40
          z-40
        "
      />

      {/* Bottom Sheet */}
      <div
        className="
          fixed bottom-0 left-0 right-0
          bg-white
          rounded-t-[32px]
          z-50
          p-5
          animate-slideUp
          max-h-[90vh]
          overflow-y-auto
        "
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl text-left font-bold text-gray-900">
              {isEdit ? "Edit Produk" : "Tambah Produk"}
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Kelola data produk CirengKuy
            </p>
          </div>

          <button
            onClick={onClose}
            className="
              w-10 h-10
              rounded-full
              bg-gray-100
              flex items-center justify-center
            "
          >
            <BiX size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nama */}
          <div className="text-left">
            <label className="text-sm font-medium text-gray-700">
              Nama Produk
            </label>

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Cireng Original"
              required
              className="
                w-full mt-2
                border border-gray-200
                rounded-2xl
                px-4 py-3
                outline-none
              "
            />
          </div>

          {/* Harga */}
          <div className="text-left">
            <label className="text-sm font-medium text-gray-700">Harga</label>

            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="12000"
              required
              className="
                w-full mt-2
                border border-gray-200
                rounded-2xl
                px-4 py-3
                outline-none
              "
            />
          </div>

          {/* Stock */}
          <div className="text-left">
            <label className="text-sm font-medium text-gray-700">Stock</label>

            <input
              type="number"
              name="stock"
              value={form.stock}
              onChange={handleChange}
              placeholder="100"
              required
              className="
                w-full mt-2
                border border-gray-200
                rounded-2xl
                px-4 py-3
                outline-none
              "
            />
          </div>

          {/* Image File */}
          <div className="text-left">
            <label className="text-sm font-medium text-gray-700">
              Image File
            </label>

            <input
              type="file"
              accept="image/*"
              name="image"
              onChange={(e) => {
                setForm((prev) => ({ ...prev, image: e.target.files[0] }));
                setPreviewImage(null);
              }}
              className="
                w-full mt-2
                border border-gray-200
                rounded-2xl
                px-4 py-3
                outline-none
              "
            />
          </div>

          {/* Preview */}

          {isEdit === true && previewImage !== null ? (
            <div className="mt-2">
              <img
                src={`${window.location.origin}${previewImage}`}
                alt="Preview"
                className="
                w-full h-48
                object-cover
                rounded-2xl
                border border-gray-100
              "
              />
            </div>
          ) : (
            form.image && (
              <div className="mt-2">
                <img
                  src={URL.createObjectURL(form.image)}
                  alt="Preview"
                  className="
                  w-full h-48
                  object-cover
                  rounded-2xl
                  border border-gray-100
                "
                />
              </div>
            )
          )}

          {/* Active Toggle */}
          <label className="flex justify-start cursor-pointer">
            <input
              type="checkbox"
              value=""
              className="sr-only peer"
              checked={form.isActive}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, isActive: e.target.checked }))
              }
            />
            <div
              className={`${form.isActive ? "bg-orange-500" : "bg-gray-200"} relative w-9 h-5 peer-focus:outline-none peer-focus:ring-brand-soft dark:peer-focus:ring-brand-soft rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-buffer after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand`}
            ></div>
            <span className="select-none ms-3 text-sm font-medium text-heading">
              <span>
                {form.isActive ? "Aktifkan produk" : "Nonaktifkan produk "} di
                halaman depan
              </span>
            </span>
          </label>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="
              w-full mt-3
              bg-orange-500
              active:bg-orange-600
              disabled:opacity-60
              text-white
              py-4
              rounded-2xl
              font-semibold
              transition
            "
          >
            {loading
              ? "Menyimpan..."
              : isEdit
                ? "Simpan Perubahan"
                : "Tambah Produk"}
          </button>
        </form>
      </div>
    </>
  );
}
