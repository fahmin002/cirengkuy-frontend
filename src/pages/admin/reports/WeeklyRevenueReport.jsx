// src/pages/admin/reports/WeeklyRevenueReport.jsx

import { useEffect, useState } from "react";
import { api } from "../../../services/api";
import {
  BiCalendarWeek,
  BiDollarCircle,
  BiReceipt,
  BiCheckCircle,
} from "react-icons/bi";
import { useNavigate } from "react-router-dom";

export default function WeeklyRevenueReport() {
  const navigate = useNavigate();
  const getCurrentWeek = () => {
    const now = new Date();

    const firstDay = new Date(now.getFullYear(), 0, 1);

    const days =
      Math.floor((now - firstDay) / 86400000);

    const week = Math.ceil((days + firstDay.getDay() + 1) / 7);

    return `${now.getFullYear()}-W${String(week).padStart(2, "0")}`;
  };

  const [week, setWeek] = useState(getCurrentWeek());

  const [loading, setLoading] = useState(false);

  const [report, setReport] = useState({
    revenue: 0,
    orders: 0,
    completed: 0,
    cancelled: 0,
  });

  const [search, setSearch] = useState("");

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
        `/reports/admin/weekly-report?week=${week}`
      );

      setReport(res.data);

    } catch (err) {
      console.error(err);

      alert("Gagal mengambil laporan");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [week]);

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

  return (
    <div className="min-h-screen bg-gray-50 lg:w-lg rounded-xl pb-24">
      <div className="px-4 pt-4">
        <h1 className="text-3xl font-black text-gray-900 text-left">
          Laporan Mingguan
        </h1>

        <p className="text-gray-500 mt-1 text-left">
          Pendapatan berdasarkan minggu tertentu
        </p>
      </div>

      {/* Filter Minggu */}
      <div className="px-4 mt-5">
        <label className="text-sm font-semibold text-gray-700 block mb-2">
          Pilih Minggu
        </label>

        <div className="relative">
          <BiCalendarWeek
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
            type="week"
            value={week}
            onChange={(e) => setWeek(e.target.value)}
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
          {/* Summary Cards */}
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
                <div className="flex flex-col items-center">
                  <p className="text-sm text-gray-500">
                    {card.title}
                  </p>

                  <h2 className="mt-2 font-black text-xl text-gray-900">
                    {card.value}
                  </h2>

                  <div
                    className={`
                      mt-3
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