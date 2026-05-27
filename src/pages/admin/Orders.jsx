// src/pages/admin/Orders.jsx
import { useEffect, useState } from "react";
import StatusTabs from "../../components/admin/StatusTabs";
import OrderCard from "../../components/admin/OrderCard";
import { api } from "../../services/api";
import { socket } from "../../services/socket";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { BiSearch } from "react-icons/bi";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [loadingCode, setLoadingCode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [
    debouncedSearch,
    setDebouncedSearch,
  ] = useState("");

  const navigate = useNavigate();

  const notifSound = new Audio(
    "/sound/ding.mp3"
  );

  const handleSearch = async (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      fetchOrders();
    }
  }

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const params =
        new URLSearchParams({
          page,
          limit: 10,
        });

      if (status) {
        params.append(
          "status",
          status
        );
      }

      if (search) {
        params.append(
          "search",
          search
        )
      }

      const res = await api.get(
        `/orders/admin?${params.toString()}`
      );

      setOrders((prev) => {
        const merged =
          page === 1
            ? res.data
            : [...prev, ...res.data];

        const unique = merged.filter(
          (order, index, self) =>
            index ===
            self.findIndex(
              (o) => o.id === order.id
            )
        );

        return unique;
      });

      setHasMore(
        page < res.pagination.totalPages
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    fetchOrders();

    const interval = setInterval(fetchOrders, 5000); // 🔄 polling
    return () => {
      clearInterval(interval);
    }
  }, [status, page, debouncedSearch]);

  useEffect(() => {
    socket.emit("join-admin-room");
    const enableAudio = async () => {
      try {
        await notifSound.play();

        notifSound.pause();

        notifSound.currentTime = 0;
      } catch (err) {
        console.log("Audio belum diizinkan");
      }
    };

    window.addEventListener("click", enableAudio, {
      once: true,
    });

    socket.on('new-order', (newOrder) => {
      toast.success("Pesanan Baru", {
        description:
          `${newOrder.customerName} • Rp ${newOrder.total}`,

        action: {
          label: "Lihat",
          onClick: () =>
            navigate(`/admin/order/${newOrder.code}`),
        },
      });

      notifSound.currentTime = 0;

      notifSound.play();

      setOrders((prev) => {
        const exist = prev.some(
          (o) => o.id === newOrder.id
        );

        if (exist) return prev;

        return [newOrder, ...prev];
      });

    });
    return () => {
      socket.off("new-order");
    }
  }, []);

  const handleAction = async (code, nextStatus) => {
    try {
      setLoadingCode(code);
      await api.patch(`/orders/admin/code/${code}/status`, { status: nextStatus });
      await fetchOrders();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoadingCode(null);
    }
  };

  return (
    <div className="bg-gray-50 rounded-xl pb-24">
      <div className="sticky p-4 rounded-xl top-0 z-10 bg-gray-50 ">
        <h1 className="text-xl font-bold text-left mb-4">Pesanan</h1>
        {/* Search */}
        <div className="relative mb-4">
          <BiSearch
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Cari Nama / No.HP ..."
            value={search}
            onKeyDown={handleSearch}
            onChange={(e) => {
              setSearch(e.target.value)
            }}
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
        <StatusTabs value={status} onChange={setStatus} setOrders={setOrders} setPage={setPage} />
      </div>


      <div className=" p-4 space-y-3">
        {loading && <p className="text-center text-gray-400">Loading...</p>}

        {!loading && orders.length === 0 && (
          <p className="text-center text-gray-400">Belum ada pesanan</p>
        )}

        {orders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            loading={loadingCode === order.code}
            onAction={handleAction}
          />
        ))}
        {hasMore && (
          <button
            onClick={() =>
              setPage((prev) => prev + 1)
            }
            className="mt-4 w-full bg-orange-500 text-white rounded-2xl py-3"
          >
            Selanjutnya
          </button>
        )}
      </div>
    </div>
  );
}
