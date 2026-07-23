// src/pages/admin/reports/DailyRevenueReport.jsx

import { useEffect, useState } from "react";
import { api } from "../../../services/api";
import {
  BiCalendar,
  BiDollarCircle,
  BiReceipt,
  BiCheckCircle,
} from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../../../utils/date";

export default function DailyRevenueReport() {
  const statusMap = {
    pending: 'Pending',
    paid: 'Dibayar',
    cooking: 'Disiapkan',
    ready: 'Siap',
    completed: 'Selesai',
    cancelled: 'Dibatalkan',
  };

  const today = new Date().toISOString().split("T")[0];
  const navigate = useNavigate();
  const [date, setDate] = useState(today);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [report, setReport] = useState({
    revenue: 0,
    orders: 0,
    completed: 0,
    cancelled: 0,
  });

  const [transactions, setTransactions] = useState([]);
  const formatRupiah = (value) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value || 0);

  const fetchReport = async () => {
    try {
      setLoading(true);

      const res = await api.get(
        `/reports/admin/daily-report?date=${date}`
      );

      setReport(res.data);
      setTransactions(res.data.transactions || []);
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

  const cards = [
    {
      title: "Pendapatan",
      value: formatRupiah(report.revenue),
      icon: <BiDollarCircle size={28} />,
      color: "text-orange-500",
      bg: "bg-orange-50",
    },

    {
      title: "Pesanan",
      value: report.orders,
      icon: <BiReceipt size={28} />,
      color: "text-blue-500",
      bg: "bg-blue-50",
    },

    {
      title: "Selesai",
      value: report.completed,
      icon: <BiCheckCircle size={28} />,
      color: "text-green-500",
      bg: "bg-green-50",
    },

    {
      title: "Dibatalkan",
      value: report.cancelled,
      icon: "❌",
      color: "text-red-500",
      bg: "bg-red-50",
    },
  ];

  const filteredTransactions = transactions.filter((trx) =>
    trx.code
      .toLowerCase()
      .includes(search.toLowerCase()) ||
    trx.customerName
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 lg:w-lg rounded-xl pb-24">
      {/* Header */}
      <div className="px-4 pt-4">
        <h1 className="text-3xl font-black text-gray-900 text-left">
          Laporan Harian
        </h1>

        <p className="text-gray-500 mt-1 text-left">
          Pendapatan berdasarkan tanggal tertentu
        </p>
      </div>

      {/* Filter */}
      <div className="px-4 mt-5">
        <label className="text-sm font-semibold text-gray-700 block mb-2">
          Pilih Tanggal
        </label>

        <div className="relative">
          <BiCalendar
            size={20}
            className="
              absolute
              left-4
              top-1/2
              -translate-y-1/2
              text-gray-400
            "
          />

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="
              w-full
              pl-12
              pr-4
              py-4
              rounded-2xl
              border
              border-gray-200
              bg-white
              focus:outline-none
              focus:ring-2
              focus:ring-orange-300
            "
          />
        </div>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div
            className="
              w-10 h-10
              border-4
              border-orange-200
              border-t-orange-500
              rounded-full
              animate-spin
            "
          />
        </div>
      ) : (
        <>
          {/* Cards */}
          <div className="grid grid-cols-2 gap-4 px-4 mt-6">
            {cards.map((card) => (
              <div
                key={card.title}
                className="
                  bg-white
                  rounded-3xl
                  p-4
                  shadow-sm
                  border
                  border-gray-100
                "
              >
                <div className="flex flex-col justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">
                      {card.title}
                    </p>

                    <h2 className="mt-2 font-black text-xl text-gray-900">
                      {card.value}
                    </h2>
                  </div>

                  <div
                    className={`
                      w-12 h-12
                      rounded-2xl
                      flex items-center justify-center
                      ${card.bg}
                      ${card.color}
                    `}
                  >
                    {card.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Transaction List */}
          <div
            className="
    mx-4
    mt-6
    bg-white
    rounded-3xl
    border
    border-gray-100
    overflow-hidden
  "
          >
            <div className="p-5 border-b border-gray-100">
              <h2 className="font-bold text-lg">
                Daftar Transaksi
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Transaksi pada tanggal yang dipilih
              </p>

              <div className="mt-4">
                <input
                  type="text"
                  placeholder="Cari kode atau nama pelanggan..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="
            w-full
            px-4
            py-3
            rounded-2xl
            border
            border-gray-200
            bg-white
            focus:outline-none
            focus:ring-2
            focus:ring-orange-300
          "
                />
              </div>
            </div>

            {filteredTransactions.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                Tidak ada transaksi
              </div>
            ) : (
              filteredTransactions.map((trx) => (
                <div
                  onClick={() => navigate(`/admin/order/${trx.code}`)}
                  key={trx.id}
                  className="
          p-4
          border-b
          border-gray-100
          last:border-b-0
        "
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold">
                        {trx.orderCode}
                      </p>

                      <p className="text-sm text-gray-500">
                        {trx.customerName}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-bold text-orange-500">
                        {formatRupiah(trx.total)}
                      </p>

                      <span
                        className={`
                text-xs
                px-2
                py-1
                rounded-full
                ${trx.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : trx.status === "cancelled"
                              ? "bg-red-100 text-red-700"
                              : "bg-orange-100 text-orange-700"
                          }
              `}
                      >
                        {statusMap[trx.status] || trx.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          {/* Summary */}
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
              , sistem mencatat sebanyak{" "}
              <span className="font-semibold">
                {report.orders}
              </span>{" "}
              pesanan dengan total pendapatan sebesar{" "}
              <span className="font-semibold text-orange-500">
                {formatRupiah(report.revenue)}
              </span>
              .
            </p>
          </div>
          {/* Tombol Kembali */}
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => navigate("/admin/reports")}
              className="px-6 py-3 bg-orange-500 text-white rounded-2xl hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-300"
            >
              Kembali ke Daftar Laporan
            </button>
          </div>

        </>
      )}
    </div>
  );
}