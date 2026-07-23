import { useEffect, useState } from "react";
import { api } from "../../../services/api";
import {
    BiCalendar,
    BiCheckCircle,
    BiPackage,
    BiReceipt,
} from "react-icons/bi";

import { useNavigate } from "react-router-dom";

import { formatDate } from "../../../utils/date";

export function ProductDailyReport() {
    const navigate = useNavigate();
    const today = new Date()
        .toISOString()
        .split("T")[0];

    const [date, setDate] = useState(today);

    const [products, setProducts] = useState([]);

    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(false);
    const fetchReport = async () => {
        try {
            setLoading(true);

            const res = await api.get(
                `/reports/admin/product-performance-daily?date=${date}`
            );

            setProducts(res.data);
        } catch (err) {
            console.error(err);

            alert("Gagal mengambil laporan");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReport();
    }, [date]);

    const totalSold = products.reduce(
        (sum, item) => sum + item.sold,
        0
    );

    const soldProducts = products.filter(
        (item) => item.sold > 0
    ).length;

    const unsoldProducts = products.filter(
        (item) => item.sold === 0
    ).length;

    const filteredProducts = products.filter(
        (item) =>
            item.name
                .toLowerCase()
                .includes(search.toLowerCase())
    );

    const cards = [
        {
            title: "Total Terjual",
            value: totalSold,
            icon: <BiPackage size={28} />,
            color: "text-orange-500",
            bg: "bg-orange-50",
        },

        {
            title: "Produk Laku",
            value: soldProducts,
            icon: <BiCheckCircle size={28} />,
            color: "text-green-500",
            bg: "bg-green-50",
        },

        {
            title: "Tidak Laku",
            value: unsoldProducts,
            icon: "❌",
            color: "text-red-500",
            bg: "bg-red-50",
        },

        {
            title: "Varian Produk",
            value: products.length,
            icon: <BiReceipt size={28} />,
            color: "text-blue-500",
            bg: "bg-blue-50",
        },
    ];


    return (
        <>
            <div className="min-h-screen bg-gray-50 lg:w-lg rounded-xl pb-24">
                <div className="p-5 border-b border-gray-100">
                    <h1 className="text-3xl font-black text-gray-900 text-left">
                        Performa Produk
                    </h1>

                    <p className="text-gray-500 mt-1 text-left">
                        Penjualan produk pada tanggal yang dipilih
                    </p>

                    {/* Filter Tanggal */}
                    <div className="mt-5">
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="
      w-full
      px-4
      py-4
      rounded-2xl
      border
      border-gray-200
      bg-white
    "
                        />
                    </div>

                    {/* Statistik */}
                    <div className="grid grid-cols-3 gap-3 mt-5">
                        <div className="bg-white rounded-2xl p-4 border border-gray-100">
                            <p className="text-sm text-gray-500">
                                Total Terjual
                            </p>

                            <h2 className="text-2xl font-black mt-1">
                                {totalSold}
                            </h2>
                        </div>

                        <div className="bg-white rounded-2xl p-4 border border-gray-100">
                            <p className="text-sm text-gray-500">
                                Produk Laku
                            </p>

                            <h2 className="text-2xl font-black mt-1 text-green-600">
                                {soldProducts}
                            </h2>
                        </div>

                        <div className="bg-white rounded-2xl p-4 border border-gray-100">
                            <p className="text-sm text-gray-500">
                                Tidak Laku
                            </p>

                            <h2 className="text-2xl font-black mt-1 text-red-500">
                                {unsoldProducts}
                            </h2>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="mt-5">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari produk..."
                            className="
      w-full
      px-4
      py-4
      rounded-2xl
      border
      border-gray-200
      bg-white
    "
                        />
                    </div>
                </div>

                {filteredProducts.length === 0 ? (
                    <div className="p-8 text-center text-gray-400">
                        Tidak ada produk ditemukan
                    </div>
                ) : (
                    filteredProducts.map(
                        (product, index) => (
                            <div
                                key={product.id}
                                className="
            p-4
            border-b
            border-gray-100
            last:border-b-0
          "
                            >
                                <div className="flex justify-between text-left items-center">
                                    <div className="flex gap-3 items-center">
                                        {product.imageUrl && (
                                            <img
                                                src={`${import.meta.env.VITE_BACKEND_URL}${product.imageUrl}`}
                                                className="
                    w-14
                    h-14
                    rounded-xl
                    object-cover
                  "
                                            />
                                        )}

                                        <div>
                                            <p className="font-bold">
                                                {product.name}
                                            </p>

                                            <p className="text-sm text-gray-500">
                                                Ranking #{index + 1}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <p className="font-bold text-orange-500 text-xl">
                                            {product.sold}
                                        </p>

                                        <span
                                            className={`
                  text-xs
                  px-2
                  py-1
                  rounded-full
                  ${product.sold > 0
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700"
                                                }
                `}
                                        >
                                            {product.sold > 0
                                                ? "Terjual"
                                                : "Tidak Laku"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )
                    )
                )}
            <div
                className="
    mx-4
    mt-6
    bg-white
    rounded-3xl
    p-5
    border
    border-gray-100
  "
            >
                <h2 className="font-bold text-lg">
                    Ringkasan
                </h2>

                <p className="text-gray-500 mt-2 text-sm leading-relaxed">
                    Pada tanggal{" "}
                    <span className="font-semibold">
                        {formatDate(date)}
                    </span>
                    , sistem mencatat penjualan sebanyak{" "}
                    <span className="font-semibold">
                        {totalSold}
                    </span>{" "}
                    item produk. Terdapat{" "}
                    <span className="font-semibold text-green-600">
                        {soldProducts}
                    </span>{" "}
                    produk yang berhasil terjual dan{" "}
                    <span className="font-semibold text-red-500">
                        {unsoldProducts}
                    </span>{" "}
                    produk yang tidak memiliki penjualan.
                </p>
            </div>
            <div className="mt-6 flex justify-center">
                <button
                    onClick={() =>
                        navigate("/admin/reports")
                    }
                    className="
      px-6
      py-3
      bg-orange-500
      text-white
      rounded-2xl
      hover:bg-orange-600
    "
                >
                    Kembali ke Daftar Laporan
                </button>
            </div>
            </div>
        </>
    );
};

export default ProductDailyReport;
