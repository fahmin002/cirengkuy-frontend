// src/components/admin/ProductCard.jsx

import { BiPackage, BiPencil } from "react-icons/bi";

export default function ProductCard({ product, onEdit }) {
  return (
    <div
      className="
        rounded-3xl
        p-4
        ring-1
        ring-orange-200
        shadow-orange-100
        shadow-sm
        bg-white
        "
    >
      <div className="flex items-start gap-4">
        {/* Image */}
        <div
          className="
            w-20 h-20
            rounded-2xl
            bg-gray-100
            overflow-hidden
            shrink-0
          "
        >
          {product.imageUrl ? (
            <img
              src={`${product.imageUrl}`}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <BiPackage className="text-gray-400" size={28} />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Top */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <h2 className="font-bold text-gray-900 text-base text-left line-clamp-1">
                {product.name}
              </h2>

              <p className="text-left text-orange-500 font-semibold mt-1">
                Rp {product.price.toLocaleString("id-ID")}
              </p>
            </div>

            {/* Status */}
            <div
              className={`
                px-3 py-1 rounded-full text-xs font-medium shrink-0
                ${
                  product.isActive
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-200 text-gray-600"
                }
              `}
            >
              {product.isActive ? "Aktif" : "Nonaktif"}
            </div>
          </div>

          {/* Stock */}
          <div className="mt-3 flex items-center justify-between">
            <div>
              <p className="text-xs text-left text-gray-400">Stock</p>

              <p
                className={`
                  font-semibold text-sm
                  ${product.stock <= 5 ? "text-red-500" : "text-gray-800"}
                `}
              >
                {product.stock} pcs
              </p>
            </div>

            {/* Edit */}
            <button
              onClick={() => onEdit(product)}
              className="
                flex items-center gap-2
                px-4 py-2
                rounded-xl
                bg-orange-50
                text-orange-600
                text-sm
                font-medium
                active:scale-95
                transition
              "
            >
              <BiPencil size={16} />
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
