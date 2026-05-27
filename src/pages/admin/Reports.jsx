// src/pages/admin/Reports.jsx

import { useEffect, useState } from "react";
import { api } from "../../services/api";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import { BiDollarCircle, BiCalendarWeek, BiCalendar } from "react-icons/bi";

export default function Reports() {
  const [loading, setLoading] = useState(true);

  const [summary, setSummary] = useState({
    today: 0,
    week: 0,
    month: 0,
  });
  const [products, setProducts] = useState([]);
  const [chartData, setChartData] = useState([]);

  const formatRupiah = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value || 0);
  };

  const fetchRevenueChart = async () => {
    try {
      const res = await api.get("/reports/admin/revenue-chart");
      setChartData(res.data);
    } catch (err) {
      console.error(err);
      alert("Gagal mengambil laporan");
    } finally {
      setLoading(false);
    }
  };

  const fetchRevenueSummary = async () => {
    try {
      setLoading(true);

      const res = await api.get("/reports/admin/revenue-summary");
      setSummary(res.data);
    } catch (err) {
      console.error(err);

      alert("Gagal mengambil laporan");
    } finally {
      setLoading(false);
    }
  };

  const fetchTopProducts = async () => {
    try {
      setLoading(true);

      const res = await api.get("/reports/admin/top-products");
      setProducts(res.data);
    } catch (err) {
      console.error(err);
      alert("Gagal mengambil laporan");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRevenueSummary();
    fetchTopProducts();
    fetchRevenueChart();
  }, []);

  const cards = [
    {
      title: "Hari Ini",
      value: summary.today,
      icon: <BiDollarCircle size={28} />,
      bg: "bg-orange-50",
      ring: "ring-1 ring-orange-100 shadow-orange-200",
      text: "text-orange-500",
    },

    {
      title: "Minggu Ini",
      value: summary.week,
      icon: <BiCalendarWeek size={28} />,
      bg: "bg-green-50",
      ring: "ring-1 ring-green-100 shadow-green-200",
      text: "text-green-600",
    },

    {
      title: "Bulan Ini",
      value: summary.month,
      icon: <BiCalendar size={28} />,
      bg: "bg-blue-50",
      ring: "ring-1 ring-blue-100 shadow-blue-200",
      text: "text-blue-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 rounded-xl pb-24">
      {/* Header */}
      <div className="mb-6 pt-4 px-4">
        <h1
          className="
            google-sans-flex-bold
            text-left
            text-3xl
            font-black
            text-gray-900
          "
        >
          Reports
        </h1>

        <p className="text-left text-gray-500 mt-1">
          Ringkasan revenue CirengKuy 😄🔥
        </p>
      </div>

      {/* Loading */}
      {loading ? (
        <div
          className="
            flex
            items-center
            justify-center
            py-20
          "
        >
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
          {/* Revenue Cards */}
          <div className="grid px-4 grid-cols-1 gap-4">
            {cards.map((card) => (
              <div
                key={card.title}
                className={`
                  bg-white
                  ${card.ring}
                  text-left
                  rounded-3xl
                  p-5
                  shadow-sm
                `}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{card.title}</p>

                    <h2
                      className="
                        mt-2
                        text-2xl
                        font-black
                        text-gray-900
                      "
                    >
                      {formatRupiah(card.value)}
                    </h2>
                  </div>

                  <div
                    className={`
                      w-14 h-14
                      rounded-2xl
                      flex items-center justify-center
                      ${card.bg}
                      ${card.text}
                    `}
                  >
                    {card.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Top Product Cards */}
          <div className="space-y-3 px-4 mt-4 ">
            <h2
              className="
                mt-4
                text-center
                text-xl
                font-black
              text-gray-900"
            >
              Top Products
            </h2>
            {products.map((product) => (
              <div
                key={product.id}
                className="
                    flex items-center
                    justify-between
                    bg-white
                    ring-1 ring-orange-100 shadow-orange-200
                    p-4
                    rounded-2xl
                  "
              >
                <div className="flex items-center gap-3">
                  <img
                    src={`${import.meta.env.VITE_BACKEND_URL}${product.image}`}
                    className="
                        w-14 h-14
                        rounded-xl
                        object-cover
                      "
                  />

                  <div>
                    <p className="font-semibold">{product.name}</p>

                    <p className="text-sm text-gray-500">Produk terlaris</p>
                  </div>
                </div>

                <div
                  className="
                      text-orange-500
                      font-black
                      text-lg
                    "
                >
                  {product.sold}
                </div>
              </div>
            ))}
          </div>
          {/* Grafik  */}
          <div
            className="
                mt-6
                mx-4
                bg-white
                rounded-3xl
                px-1
                py-4
                border border-gray-100
              "
          >
            <div className="mb-4">
              <h2
                className="
                    text-lg
                    font-bold
                    text-gray-900
                  "
              >
                Revenue 7 Hari
              </h2>

              <p className="text-sm text-gray-500">Tren pemasukan CirengKuy</p>
            </div>

            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
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
        </>
      )}
    </div>
  );
}
