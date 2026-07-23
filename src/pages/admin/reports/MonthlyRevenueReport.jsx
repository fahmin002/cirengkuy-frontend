// src/pages/admin/reports/MonthlyRevenueReport.jsx

import { useEffect, useState } from "react";
import { api } from "../../../services/api";

import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    Tooltip,
    CartesianGrid,
} from "recharts";

import {
    BiCalendar,
    BiDollarCircle,
    BiReceipt,
    BiCheckCircle,
} from "react-icons/bi";
import { formatMonthYear } from "../../../utils/date";
import { useNavigate } from "react-router-dom";

export default function MonthlyRevenueReport() {
    const navigate = useNavigate();
    const currentMonth = new Date()
        .toISOString()
        .slice(0, 7);

    const [month, setMonth] =
        useState(currentMonth);

    const [loading, setLoading] =
        useState(false);

    const [report, setReport] =
        useState(null);

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
                `/reports/admin/monthly-report?month=${month}`
            );

            setReport(res.data);
        } catch (err) {
            console.error(err);

            alert(
                "Gagal mengambil laporan bulanan"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReport();
    }, [month]);

    const cards = report
        ? [
            {
                title: "Pendapatan",
                value: formatRupiah(
                    report.revenue
                ),
                icon: (
                    <BiDollarCircle size={28} />
                ),
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
                icon: (
                    <BiCheckCircle size={28} />
                ),
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
        ]
        : [];

    return (
        <div className="min-h-screen bg-gray-50 lg:w-lg rounded-xl pb-24">
            {/* Header */}
            <div className="px-4 pt-4">
                <h1 className="text-3xl font-black text-left">
                    Laporan Bulanan
                </h1>

                <p className="text-gray-500 mt-1 text-left">
                    Analisis penjualan per bulan
                </p>
            </div>

            {/* Filter */}
            <div className="px-4 mt-5">
                <label className="block text-sm font-semibold mb-2">
                    Pilih Bulan
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
                        type="month"
                        value={month}
                        onChange={(e) =>
                            setMonth(e.target.value)
                        }
                        className="
              w-full
              pl-12
              pr-4
              py-4
              rounded-2xl
              border
              border-gray-200
              bg-white
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
                report && (
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
                    border
                    border-gray-100
                  "
                                >
                                    <div className="flex flex-col items-center">
                                        <p className="text-sm text-gray-500">
                                            {card.title}
                                        </p>

                                        <h2 className="mt-2 font-black text-xl">
                                            {card.value}
                                        </h2>

                                        <div
                                            className={`
                        mt-3
                        w-12
                        h-12
                        rounded-2xl
                        flex
                        items-center
                        justify-center
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

                            <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                                Pada bulan{" "}
                                <span className="font-semibold">
                                    {formatMonthYear(month)}
                                </span>
                                , sistem mencatat{" "}
                                <span className="font-semibold">
                                    {report.orders}
                                </span>{" "}
                                pesanan dengan total
                                pendapatan sebesar{" "}
                                <span className="font-semibold text-orange-500">
                                    {formatRupiah(
                                        report.revenue
                                    )}
                                </span>
                                .
                            </p>

                            <div className="mt-4">
                                <p className="text-sm text-gray-500">
                                    Rata-rata transaksi
                                </p>

                                <p className="font-black text-xl">
                                    {formatRupiah(
                                        report.averageOrderValue
                                    )}
                                </p>
                            </div>
                        </div>

                        {/* Chart */}
                        <div
                            className="
                mt-6
                mx-4
                bg-white
                rounded-3xl
                p-4
                border
                border-gray-100
              "
                        >
                            <h2 className="font-bold text-lg">
                                Pendapatan Harian
                            </h2>

                            <p className="text-sm text-gray-500">
                                Tren pendapatan selama
                                bulan ini
                            </p>

                            <div className="h-72 mt-4">
                                <ResponsiveContainer
                                    width="100%"
                                    height="100%"
                                >
                                    <LineChart
                                        data={report.chart}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />

                                        <XAxis dataKey="date" />

                                        <Tooltip />

                                        <Line
                                            type="monotone"
                                            dataKey="revenue"
                                            stroke="#f97316"
                                            strokeWidth={4}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Back Button */}
                        <div className="mt-6 flex justify-center">
                            <button
                                onClick={() => navigate("/admin/reports")}
                                className="px-6 py-3 bg-orange-500 text-white rounded-2xl hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-300"
                            >
                                Kembali ke Daftar Laporan
                            </button>
                        </div>
                    </>
                )
            )}
        </div>
    );
}