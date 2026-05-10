// src/components/orders/StatusTabs.jsx
const TABS = [
  { key: "", label: "Semua" },
  { key: "pending", label: "Pending" },
  { key: "paid", label: "Dibayar" },
  { key: "cooking", label: "Dimasak" },
  { key: "ready", label: "Siap" },
  { key: "completed", label: "Selesai" },
];

export default function StatusTabs({ value, onChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {TABS.map((tab) => {
        const active = value === tab.key;
        return (
          <button
            key={tab.key || "all"}
            onClick={() => onChange(tab.key)}
            className={[
              "px-3 py-2 rounded-xl text-sm whitespace-nowrap transition",
              active
                ? "bg-orange-500 text-white shadow"
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
