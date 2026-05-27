// src/components/orders/StatusTabs.jsx
const TABS = [
  { key: "", label: "Semua", style: "bg-linear-to-tl from-slate-300 to-slate-100 ring-1 shadow ring-slate-200 text-black" },
  { key: "pending", label: "Pending", style: "bg-linear-to-tl from-yellow-500 to-yellow-100 shadow ring-1 ring-yellow-200 shadow-yellow-200 text-white" },
  { key: "paid", label: "Dibayar", style: "bg-linear-to-tl from-blue-500 to-blue-100 shadow ring-1 ring-blue-200 shadow-blue-200 text-white" },
  { key: "cooking", label: "Disiapkan", style: "bg-linear-to-tl to-orange-100 from-orange-500 ring-1 shadow ring-orange-200 shadow-orange-200 text-white" },
  { key: "ready", label: "Siap", style: "bg-linear-to-tl to-green-100 from-green-500 ring-1 shadow ring-green-200 shadow-green-200 text-white" },
  { key: "cancelled", label: "Dibatalkan", style: "bg-linear-to-tl from-red-500 to-red-100 ring-1 shadow ring-red-100 shadow-red-200 text-white" },
  { key: "completed", label: "Selesai", style: "bg-linear-to-tl from-slate-500 to-slate-100 ring-1 shadow ring-slate-100 shadow-slate-200 text-white" },
];


export default function StatusTabs({ value, onChange, setOrders, setPage }) {
  return (
    <div className="flex p-2 gap-2 overflow-x-auto pb-2">
      {TABS.map((tab) => {
        const active = value === tab.key;
        return (
          <button
            disabled={active}
            key={tab.key || "all"}
            onClick={() => {
              onChange(tab.key)
              setOrders([])
              setPage(1)
            }}
            className={[
              "px-3 py-2 rounded-xl text-sm whitespace-nowrap transition",
              active
                ? `${tab.style}`
                : "bg-gray-100 text-gray-700 hover:bg-gray-200",
            ].join(" ")}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
